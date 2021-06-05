import Sequelize, { Model } from 'sequelize';

class Messages extends Model {
  static init(sequelize){
    super.init({
      message:  Sequelize.JSONB,
    },{
      sequelize,
      tableName: 'messages'
    })
  }
}
export default Messages;