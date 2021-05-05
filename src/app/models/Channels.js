import Sequelize, { Model } from 'sequelize';

class Channels extends Model {
  static init(sequelize){
    super.init({
      channel_name:  Sequelize.STRING,
    },{
      sequelize,
      tableName: 'channels'
    })
  }
}
export default Channels;