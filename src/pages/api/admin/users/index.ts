import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  await db.connection();
  // const users = await User.find({});
  const users = await db.AppDataSource.manager.find(User);
  await db.disconnection();
  res.send(users);
};

export default handler;
