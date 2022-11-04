import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from 'src/models/User.entity';
import { Product } from 'src/models/Product.entity';
import { Order } from 'src/models/Order.entity';

const AppDataSource = new DataSource({
  type: 'mongodb',
  // host: 'localhost',
  // port: 27017,
  url: process.env.MONGODB_URI,
  database: 'test',
  useUnifiedTopology: true,
  synchronize: true,
  logging: true,
  entities: [User, Product, Order],
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

const db = {
  connection,
  disconnection,
  AppDataSource,
};

export default db;
