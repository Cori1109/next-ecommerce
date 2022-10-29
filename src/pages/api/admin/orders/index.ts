import { Order } from 'src/models/Order.entity';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req, res) => {
  const session = await getSession({ req });
  // @ts-ignore
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    await db.connection();
    // const orders = await Order.find({}).populate('user', 'name');

    const orders = await db.AppDataSource.getMongoRepository(Order).find({
      relations: ['user', 'name'],
    });

    await db.disconnection();
    res.send(orders);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
