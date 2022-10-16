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
  const user = new User();
  user.email = data.users[1].email;
  user.name = data.users[1].name;
  user.password = data.users[1].password;
  user.isAdmin = data.users[1].isAdmin;
  await db.AppDataSource.manager.save(user);
  await db.disconnection();
  res.send({ message: 'seeded successful' });
};
export default handler;
