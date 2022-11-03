import { User } from 'src/models/User.entity';
import { Product } from 'src/models/Product.entity';
import data from '@/utils/data';
import db from '@/utils/db';
import 'reflect-metadata';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  await db.connection();
  // await db.AppDataSource.manager.clear(User);
  // await db.AppDataSource.manager.clear(Product);
  let users: User[] = [];
  let products: Product[] = [];
  users = data.users;
  products = data.products;
  await db.AppDataSource.getMongoRepository(User).save(users);
  await db.AppDataSource.getMongoRepository(Product).save(products);

  await db.disconnection();
  res.send({ message: 'seeded successful' });
};
export default handler;
