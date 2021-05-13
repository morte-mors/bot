const comandos = require('./commands.js')
const tmi = require('tmi.js');
const express = require('express');
require('./database')
require('dotenv').config();
import ChannelsControllers from './app/controllers/ChannelsControllers';
const commandChannel = ['vida_bot']
var canais = []

const fnAtrasada2 = async() => await new Promise(res => {
  res(ChannelsControllers.findAll()); //atrasado
});

fnAtrasada2().then(string => {
  canais = string.map(function(chan) {return chan.channel_name})  
  console.log(canais)
  

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: canais
};
const commandOpts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: commandChannel
};
const dadoOnlineOpts = {
  identity: {
    username: process.env.DADO_BOT_USERNAME,
    password: process.env.DADO_OAUTH_TOKEN
  },
  channels: ['dadoonline', 'morte_mors']
};
// Create a client with our options

const commandClient = new tmi.client(commandOpts);
const dadoOnline = new tmi.client(dadoOnlineOpts);
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
commandClient.on('message', onCommandMessageHandler);
commandClient.on('connected', onConnectedHandler);
dadoOnline.on('message', onDadoOnlineMessageHandler);
dadoOnline.on('connected', onConnectedHandler);
// Connect to Twitch:
client.connect();
commandClient.connect();
dadoOnline.connect();

// Called every time a message comes in
function onCommandMessageHandler (target, context, msg, self) {
  console.log(opts)
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  if (commandName === '!entrar') {
    const fnAtrasada = async() => await new Promise(res => {
      res(ChannelsControllers.store(context.username)); //atrasado
    });
    
    fnAtrasada().then(string => client.say(target, `${string}`));
    commandClient.join(context.username)
  }

  if (commandName === '!sair') {
    ChannelsControllers.delete(context.username)
    commandClient.part(context.username)
    commandClient.say(target, `Sai do seu canal @${context.username}`); 
  }
  if (commandName.match(/^!adicionar/)) {
    var newCommand = commandName.replace(/\s+/,' ').replace(/^!adicionar\s+/, '')
    commandClient.say(target, `Qual será a resposta para o comando ${newCommand}`);
  }
}

function onMessageHandler (target, context, msg, self) {

  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  if (comandos[commandName]) {    
    client.say(target, comandos[commandName]);
  }
}

function onDadoOnlineMessageHandler (target, context, msg, self) {

  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  if(commandName.match(/^!\d*d\d+/)) {
    const num = rollagem(commandName.replace(/^!d/, '!1d')).replace(/[+]d/,'1d').replace(/[-]d/,'1d')
    dadoOnline.say(target, `${num}`);
  }
  
  if(commandName.match(/^!\d+#\d*d\d+/)) {
    const vezes = commandName.match(/^!\d+/)
    vezes[0] = vezes[0].replace('!','')
    var roll = commandName.replace(/^!\d+#/,'!').replace(/^!d/, '!1d').replace(/[+]d/,'1d').replace(/[-]d/,'1d')
    if(parseInt(vezes[0]) < 10 ){
      for (let index = 0; index < parseInt(vezes[0]); index++) {
        const num = rollagem(roll)
        dadoOnline.say(target, `${index+1}# ${num}`);
      }
    }
  }
}

// Function called when the "dice" command is issued
function rollagem (str){
  var resultado = 0
  var respostaSegundaParte = ''
  var regex = /!*([+-]*\s*\d*d\d+)/g;
  var ocorrencias = 0
  str = str.replace(/\s*/g,'').replace(/!/,'+')
  while(str.match(/[+-]\d*d\d+/) || str.match(/[+-]\d+/)){
    console.log(str)
    if (str.match(/[+-]\d*d\d+/)) {
      var parcial = str.match(/[+-]\d*d\d+/)
      var sinal = parcial[0].match(/[+-]/)
      parcial[0] = parcial[0].replace(/[+-]/, '')
      var quantidade = parcial[0].match(/^\d+/)
      var faces = parcial[0].match(/\d+$/)
      if(sinal[0] == '+'){
        var roll = rollDice(quantidade[0], faces[0])
        if(ocorrencias == 0) {
          respostaSegundaParte = respostaSegundaParte.concat('[' + roll.resArray +'] ' + parcial[0]+ ' ')
          ocorrencias = 1
        } else {
          respostaSegundaParte = respostaSegundaParte.concat(sinal[0] + ' [' + roll.resArray +'] ' + parcial[0] + ' ')
        }
        resultado += roll.resultado
      } else {
        var roll = rollDice(quantidade[0], faces[0])
        respostaSegundaParte = respostaSegundaParte.concat(sinal[0] + ' [' + roll.resArray +'] ' + parcial[0] + ' ')
        resultado -= roll.resultado
      }
      str = str.replace(/[+-]\d*d\d+/, '')
    }else {
      var parcial = str.match(/[+-]\d+/)
      var sinal = parcial[0].match(/[+-]/)
      var valor = parcial[0].match(/\d+$/)
      respostaSegundaParte = respostaSegundaParte.concat(sinal[0] + ' ' + valor[0] + ' ')
      if(sinal == '+'){
        resultado += parseInt(valor[0])
      } else {
        resultado -= parseInt(valor[0])
      }
      str = str.replace(/[+-]\d+/, '')
    }
  }
  var resposta = `${resultado} <-- `
  resposta = resposta.concat(respostaSegundaParte)
  return resposta
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
});
function rollDice (quantidade, lados) {
  const sides = lados
  var resultado = 0
  var resArray = []
  for (let i = 0; i < quantidade; i++) {
    var resParcial = Math.floor(Math.random() * sides) + 1;
    resArray.push(resParcial)
    resultado += resParcial
  }
  return { resultado, resArray }
}

express().listen(process.env.PORT || 5433) 