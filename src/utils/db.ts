import { DataSource, getMongoManager } from 'typeorm';
import 'reflect-metadata';
import { User } from 'src/models/User.entity';

const AppDataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'test',
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: [User],
});

const connection = async () => {
  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
    });
};

const disconnection = async () => {
  await AppDataSource.destroy()
    .then(() => {
      console.log('disconnection');
    })
    .catch((err) => {
      console.error('Error disconnection', err);
    });
};

const db = { connection, disconnection, AppDataSource };

export default db;
