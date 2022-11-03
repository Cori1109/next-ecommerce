import db from '@/utils/db';
import { getSession } from 'next-auth/react';
import { Order } from 'src/models/Order.entity';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  const { user } = session;
  await db.connection();

  const orders = await db.AppDataSource.manager.find(Order, {
    where: {
      // @ts-ignore
      'user.email': user.email,
    },
  });
  await db.disconnection();
  console.log(orders);
  res.send(orders);
};

export default handler;
