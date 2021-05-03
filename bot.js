const comandos = require('./commands.js')
const canais = require('./channels.js')
const tmi = require('tmi.js');
require('dotenv').config();

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: canais
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  console.log(opts)
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  if (commandName === '!d20') {
    const num = rollDice(1,20);
    client.say(target, `Voce tirou ${num} no ${commandName.replace('!','')}.`);
  }
  if (commandName === '!d10') {
    const num = rollDice(1,10);
    client.say(target, `Voce tirou ${num} no ${commandName.replace('!','')}.`);
  }
  if (commandName === '!d6') {
    const num = rollDice(1,6);
    client.say(target, `Voce tirou ${num} no ${commandName.replace('!','')}.`);
  }
  if (commandName === '!d4') {
    const num = rollDice(1,4);
    client.say(target, `Voce tirou ${num} no ${commandName.replace('!','')}.`);
  }
  if (comandos[commandName]) {    
    client.say(target, comandos[commandName]);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice (quantidade, lados) {
  const sides = lados;
  return quantidade * Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
