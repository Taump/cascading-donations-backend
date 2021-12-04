const conf = require('ocore/conf.js');
const network = require('ocore/network.js');
const eventBus = require('ocore/event_bus.js');
const lightWallet = require('ocore/light_wallet.js');
const wallet_general = require('ocore/wallet_general.js');
const DAG = require('aabot/dag.js');
const Discord = require('discord.js');

const webserver = require('./webserver.js');
const updater = require('./popularRepoUpdater.js');
const getTokens = require('./getTokens');

var discordClient = null;

lightWallet.setLightVendorHost(conf.hub);

eventBus.on('connected', function (ws) {
	network.initWitnessesIfNecessary(ws, start);
});

eventBus.on('aa_response', async function (objResponse) {
	if (objResponse.response.error)
		return console.log('ignored response with error: ' + objResponse.response.error);

	const responseVars = objResponse.response.responseVars;

	if (responseVars && responseVars.message && responseVars.message.includes("Successful donation to ")) {
		const repository = responseVars.message.split(" ")[3];
		const donor = objResponse.trigger_address;
		const donatedVarName = Object.keys(responseVars).find(v => v.includes("donated_in_"));
		const asset = donatedVarName.split("_")[2];
		const amount = responseVars[donatedVarName];
		const unit = objResponse.response.unit;
		const symbol = asset === "base" ? "GBYTE" : await getSymbol(asset);
		const decimals = asset === "base" ? 9 : await getDecimal(asset);

		const embed = new Discord.MessageEmbed()
			.setAuthor(`Obyte cascading donation`)
			.setTitle(`New donation`)
			.setColor('#0099ff')
			.setDescription(`You can support this repository using [website](${conf.frontend_url}/repo/${repository})`)
			.setURL(`https://${conf.testnet ? "testnet" : ""}explorer.obyte.org/#${unit}`)
			.addFields({ name: "Donor", value: `[${donor}](${`https://${conf.testnet ? "testnet" : ""}explorer.obyte.org/#${donor}`})` })
			.addFields({ name: "Repository", value: `[${repository}](https://github.com/${repository})` })
			.addFields({ name: "Amount", value: `${amount / 10 ** decimals} ${asset === "base" ? symbol : `[${symbol}](https://${conf.testnet ? "testnet" : ""}explorer.obyte.org/#${asset})`}` })
			.setThumbnail(`https://avatars.githubusercontent.com/${repository.split("/")[0]}`)

		sendToDiscord(embed);
	}
});

async function start() {
	if (conf.enableNotificationDiscord){
		await initDiscord();
		wallet_general.addWatchedAddress(conf.aa_address, function (error) {
			if (error)
				console.log(error)
			else
				console.log(conf.aa_address + " added as watched address")
		});
	}

	webserver();
	updater();
	getTokens();
	setInterval(lightWallet.refreshLightClientHistory, 60 * 1000);
}


async function initDiscord() {
	if (!conf.discord_token)
		throw Error("discord_token missing in conf");
	if (!conf.discord_channels || !conf.discord_channels.length)
		throw Error("channels missing in conf");
	discordClient = new Discord.Client();
	discordClient.on('ready', () => {
		console.log(`Logged in Discord as ${discordClient.user.tag}!`);
	});
	discordClient.on('error', (error) => {
		console.log(`Discord error: ${error}`);
	});

	await discordClient.login(conf.discord_token);

	setBotActivity();

	setInterval(setBotActivity, 1000 * 60 * 24);
}

function setBotActivity() {
	discordClient.user.setActivity("cascading donations", { type: "WATCHING" });
}


function sendToDiscord(to_be_sent) {
	if (!discordClient)
		return console.log("discord client not initialized");
	conf.discord_channels.forEach(function (channelId) {
		discordClient.channels.fetch(channelId).then(function (channel) {
			channel.send(to_be_sent);
		});
	});
}

async function getSymbol(asset) {
	try {
		const symbol = await DAG.readAAStateVar(conf.token_registry_AA_address, 'a2s_' + asset);
		return symbol || asset.slice(0, 5);
	} catch (e) {
		console.error("getSymbol", e);
		return asset.slice(0, 5);
	}
}

async function getDecimal(asset) {
	try {
		const desc_hash = await DAG.readAAStateVar(conf.token_registry_AA_address, 'current_desc_' + asset);
		console.error("desc_hash", desc_hash);

		if (desc_hash) {
			return await DAG.readAAStateVar(conf.token_registry_AA_address, 'decimals_' + desc_hash) || 0;
		} else {
			return 0
		}

	} catch (e) {
		console.error("getSymbol", e);
		return 0;
	}
}

process.on('unhandledRejection', up => { throw up });