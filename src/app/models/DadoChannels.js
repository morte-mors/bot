import Sequelize, { Model } from 'sequelize';

class DadoChannels extends Model {
  static init(sequelize){
    super.init({
      channel_name:  Sequelize.STRING,
      twitch_id:  Sequelize.STRING,
    },{
      sequelize,
      tableName: 'dadochannels'
    })
  }
}
export default DadoChannels;