require('dotenv').config();

/**
 * @typedef EnvironmentConfiguration
 * @prop {string} PORT the port to listen on
 * @prop {string} TWITCH_CLIENT_ID client ID for the Twitch app
 * @prop {string} TWITCH_CLIENT_SECRET client OAuth secret for the Twitch app
 * @prop {string} TWITCH_CLIENT_REDIR_HOST client redirect
 */

/**
 * @type {EnvironmentConfiguration}
 */

const config = {
    ...process.env,
};

module.exports = config;