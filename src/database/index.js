import Sequelize from 'sequelize';
import Channels from '../app/models/Channels';
import DadoChannels from '../app/models/DadoChannels';
import Messages from '../app/models/Messages';
import databaseConfig from '../config/database'

const models = [Channels, DadoChannels, Messages];

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