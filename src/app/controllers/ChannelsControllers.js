import Channels from '../models/Channels'

class ChannelsControllers {

  async store(username, userId) {
    var channel = await Channels.findOne({where: {twitch_id: userId}})
    if(channel){
      if(channel.channel_name === username){
        return 'Eu ja estava no seu canal @' + channel.channel_name + '!'
      } else {
        channel.channel_name = username;
        channel.save();
        return 'Seu usuário foi atualizado para @' + channel.channel_name + '!'
      }
    } else {
      Channels.create({
        channel_name: username,
        twitch_id: userId
      })
      return 'Entrei no seu canal @' + username + '!'
    }
  }

  async delete(username, userId) {
    var channel = await Channels.findOne({where: {twitch_id: userId}})
    if(channel){
      channel.destroy()
      return 'Ja sai do seu canal @' + username + ', estarei aqui quando precisar!'
    } else {
      return 'Eu não estava no seu canal @' + username
    }
  }

  async findAll() {
    var channel = await Channels.findAll()
    return channel
  }
}
export default new ChannelsControllers();