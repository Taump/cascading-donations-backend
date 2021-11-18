const axios = require('axios');
const conf = require('ocore/conf.js');

module.exports = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Basic ${(`${conf.github_client_id}:${conf.github_secret_key}`).toString('base64')}`,
    "User-Agent": "CASCADING DONATION",
    "Content-Type": "application/json"
  }
});