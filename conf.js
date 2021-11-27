/*jslint node: true */
"use strict";
exports.bServeAsHub = false;
exports.bLight = true;
exports.bNoPassphrase = true;
exports.webPort = null;

exports.testnet = process.env.testnet == "1";

exports.hub = process.env.testnet ? 'obyte.org/bb-test' : 'obyte.org/bb';

exports.enableNotificationDiscord = true;
exports.aa_address = process.env.testnet ? "TYFWEYJLVKIJTB54LC2I3XPYFINKVXXZ" : "TYFWEYJLVKIJTB54LC2I3XPYFINKVXXZ";

exports.discord_channels = [process.env.discord_channel];
exports.discord_token = process.env.discord_token;

exports.token_registry_AA_address = "O6H6ZIFI57X3PLTYHOCVYPP5A553CYFQ"

exports.frontend_url = process.env.frontend_url;
exports.webserverPort = process.env.webserverPort;

exports.github_client_id = process.env.github_client_id;
exports.github_secret_key = process.env.github_secret_key;

console.log('finished server conf');
