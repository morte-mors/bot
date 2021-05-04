import Sequelize from 'sequelize';
import Channels from '../app/models/channels';
import databaseConfig from '../config/database'

const models = [Channels];

class Database {
  constructor(){
    this.init();
  }
  init(){
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();