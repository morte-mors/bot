import DadoChannels from '../models/DadoChannels'

class DadoChannelsControllers {

  async store(username, userId) {
    var channel = await DadoChannels.findOne({where: {twitch_id: userId}})
    if(channel){
      if(channel.channel_name === username){
        return 'Eu ja estava no seu canal @' + channel.channel_name + '!'
      } else {
        channel.channel_name = username;
        channel.save();
        return 'Seu usuário foi atualizado para @' + channel.channel_name + '!'
      }
    } else {
      console.log('17')
      DadoChannels.create({
        channel_name: username,
        twitch_id: userId
      })
      return 'Entrei no seu canal @' + username + '!'
    }
  }

  async delete(username, userId) {
    var channel = await DadoChannels.findOne({where: {twitch_id: userId}})
    if(channel){
        channel.destroy()
    } 
    return 'Ja sai do seu canal @' + username + ', estarei aqui quando precisar!'
  }

  async findAll() {
    var channel = await DadoChannels.findAll()
    return channel
  }
}
export default new DadoChannelsControllers();