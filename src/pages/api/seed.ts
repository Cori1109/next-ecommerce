import { User } from 'src/models/User.entity';
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
  await db.AppDataSource.manager.clear(User);
  let users: User[] = [];
  users = data.users;
  await db.AppDataSource.getMongoRepository(User).save(users);

  await db.disconnection();
  res.send({ message: 'seeded successful' });
};
export default handler;
