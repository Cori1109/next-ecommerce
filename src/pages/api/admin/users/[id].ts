import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }

  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (req, res) => {
  await db.connection();
  // const user = await User.findById(req.query.id);
  const user = await db.AppDataSource.getMongoRepository(User).findOneBy({
    _id: new ObjectID(req.query.id as string),
  });
  if (user) {
    if (user.email === 'admin@example.com') {
      return res.status(400).send({ message: 'Can not delete admin' });
    }
    // await user.remove();
    await db.AppDataSource.getMongoRepository(User).remove(user);
    await db.disconnection();
    res.send({ message: 'User Deleted' });
  } else {
    await db.disconnection();
    res.status(404).send({ message: 'User Not Found' });
  }
};

export default handler;
