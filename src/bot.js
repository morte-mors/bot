import comandos from './commands.js';
import tmi from 'tmi.js';
import express from 'express';
require('./database')
require('dotenv').config();
import ChannelsControllers from './app/controllers/ChannelsControllers';
import DadoChannelsControllers from './app/controllers/DadoChannelsControllers';
import MessagesControllers from './app/controllers/MessagesControllers';

const commandChannel = [process.env.BOT_USERNAME, process.env.DADO_BOT_USERNAME]
let canais = []
let dadoCanais = []


const loadChannels = async() => await new Promise(res => {
  const chan = ChannelsControllers.findAll()
  res(chan);
});
const loadDadoChannels = async() => await new Promise(res => {
  const chan = DadoChannelsControllers.findAll()
  res(chan);
});

loadChannels().then(string1 => {loadDadoChannels().then(string => {
  canais = string.map(function(chan) {return chan.channel_name})  
  dadoCanais = string1.map(function(chan) {return chan.channel_name})  
  console.log(canais, dadoCanais)
// Define configuration options
const commandOpts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: commandChannel
};
const commandClient = new tmi.client(commandOpts);
commandClient.on('message', onCommandMessageHandler);
commandClient.on('connected', onConnectedHandler);
commandClient.connect();


const opts = {
  connection: {
    secure: true,
    reconnect: true
  },
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: canais
};
const client = new tmi.client(opts);
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.connect();




const dadoOnlineOpts = {
  identity: {
    username: process.env.DADO_BOT_USERNAME,
    password: process.env.DADO_OAUTH_TOKEN
  },
  channels: ['dadoonline', 'morte_mors']
};
const dadoOnline = new tmi.client(dadoOnlineOpts);
dadoOnline.on('message', onDadoOnlineMessageHandler);
dadoOnline.on('connected', onConnectedHandler);
dadoOnline.connect();

// Called every time a message comes in
function onCommandMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  // Remove whitespace from chat message and transform into lowecase
  const commandName = msg.trim().toLowerCase(); 

  
  // If the command is known, let's execute it
  if (commandName === '!entrar') {
    if(target == `#${process.env.BOT_USERNAME}`) {
      const storeChannel = async() => await new Promise(res => {
        res(ChannelsControllers.store(context.username, context['user-id'])); //atrasado
      });
      
      storeChannel().then(string => commandClient.say(target, `${string}`));
      client.join(context.username)
    } else if (target == `#${process.env.DADO_BOT_USERNAME}`) {
      const storeChannel = async() => await new Promise(res => {
        res(DadoChannelsControllers.store(context.username, context['user-id'])); //atrasado
      });
      
      storeChannel().then(string => dadoOnline.say(target, `${string}`));
      dadoOnline.join(context.username)
    }
    
  }

  if (commandName === '!sair') {
    if(target == `#${process.env.BOT_USERNAME}`) {
      const deleteChannel = async() => await new Promise(res => {
        res(ChannelsControllers.delete(context.username, context['user-id'])); //atrasado
      });
      deleteChannel().then(string => client.say(target, `${string}`));
      client.part(context.username)
    } else if (target == `#${process.env.DADO_BOT_USERNAME}`) {
      const deleteChannel = async() => await new Promise(res => {
        res(DadoChannelsControllers.delete(context.username, context['user-id'])); //atrasado
      });
      deleteChannel().then(string => dadoOnline.say(target, `${string}`));
      dadoOnline.part(context.username)
    }
    
  }
  if (commandName.match(/^!adicionar/)) {
    var newCommand = commandName.replace(/\s+/,' ').replace(/^!adicionar\s+/, '')
    commandClient.say(target, `Qual será a resposta para o comando ${newCommand}`);
  }
}




function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  const ignore = {'morte_mors': false} //list of ignored users
  if(ignore[context.username]) {return}
  MessagesControllers.store({target, context, msg})
  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  if (comandos[commandName]) {    
    client.say(target, comandos[commandName]);
  }
}


function onDadoOnlineMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot
  console.log()
  
  // Remove whitespace from chat message
  const commandName = msg.trim().toLowerCase();

  // If the command is known, let's execute it
  if(commandName.match(/^!\d*d\d+/)) {
    const num = rollagem(commandName.replace(/^!d/, '!1d').replace(/[+]d/g,'+1d').replace(/[-]d/g,'-1d'))
    dadoOnline.say(target, `${num}`);
  }
  
  if(commandName.match(/^!\d+#\d*d\d+/)) {
    const vezes = commandName.match(/^!\d+/)
    vezes[0] = vezes[0].replace('!','')
    var roll = commandName.replace(/^!\d+#/,'!').replace(/^!d/, '!1d').replace(/[+]d/,'+1d').replace(/[-]d/,'-1d')
    if(parseInt(vezes[0]) < 6 ){
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
})});
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