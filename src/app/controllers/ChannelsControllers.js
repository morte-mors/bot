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
    return 'Ja sai do seu canal @' + username + ', starei aqui quando precisar!'
  }

  async findAll() {
    var channel = await Channels.findAll()
    return channel
  }
}
export default new ChannelsControllers();