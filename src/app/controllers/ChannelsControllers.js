import Channels from '../models/Channels'

class ChannelsControllers {

  async store(username) {
    var channel = await Channels.findOne({where: {channel_name: username}})
    if(channel){
      'Eu ja estava no seu canal @' + username + '!'
      return 'Eu ja estava no seu canal @' + channel.channel_name + '!'
    } else {
      Channels.create({
        channel_name: username
      })
      return 'Entrei no seu canal @' + username + '!'
    }
  }

  async delete(username) {
    var channel = await Channels.findOne({where: {channel_name: username}})
    if(channel){
        channel.destroy()
    } 
    return 'Ja sai do seu canal @' + username + ', estarei aqui quando precisar!'
  }

  async searchAll() {
    var channel = await Channels.findAll()
    console.log('canal', channel[0].channel_name)
    var channels = channel.map(function(chan) {
      return chan.channel_name
    })
    return channels[0] + 'como?'
  }
}
export default new ChannelsControllers();