import { Order } from 'src/models/Order.entity';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

const handler = async (req, res) => {
  const session = await getSession({ req });
  // @ts-ignore
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('Error: signin required');
  }
  await db.connection();
  // const order = await Order.findById(req.query.id);
  const order = await db.AppDataSource.getMongoRepository(Order).findOneBy({
    _id: new ObjectID(req.query.id as string),
  });
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const deliveredOrder = await db.AppDataSource.getMongoRepository(
      Order
    ).save(order);
    await db.disconnection();
    res.send({
      message: 'order delivered successfully',
      order: deliveredOrder,
    });
  } else {
    await db.disconnection();
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
