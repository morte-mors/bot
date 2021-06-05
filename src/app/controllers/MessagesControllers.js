import Messages from '../models/Messages'
import fetch from 'node-fetch'

class MessagesControllers {
  async store(message) {
    const urls = [
      'https://decapi.me/twitch/avatar/' + message.context.username
    ];
    
    // Make a promisse with the urls and get the infos from the responses
    Promise.all(urls.map(u => fetch(u)))
    .then(responses => Promise.all(responses.map(res => res.text())))
    .then(async responses => {
      message.img = responses[0]
      var messageStored = await Messages.create({
        message: message,
      })
      var messageToDestroy = await Messages.findOne({where: {id: messageStored.id - 100}})
      if(messageToDestroy) messageToDestroy.destroy()
      console.log('mensagem armazenada')
    });
    
  }
  

  async delete(username, userId) {
    var message = await Messages.findOne({where: {twitch_id: userId}})
    if(message){
      message.destroy()
      return 'Ja sai do seu canal @' + username + ', estarei aqui quando precisar!'
    } else {
      return 'Eu não estava no seu canal @' + username
    }
  }

  async findAll() {
    var message = await Messages.findAll()
    return message
  }
}
export default new MessagesControllers();