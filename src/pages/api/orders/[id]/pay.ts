import { Order } from 'src/models/Order.entity';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Error: signin required');
  }

  await db.connection();
  // const order = await Order.findById(req.query.id);
  const order = await db.AppDataSource.manager.findOne(Order, {
    where: {
      _id: new ObjectID(req.query.id as string),
    },
  });

  if (order) {
    if (order.isPaid) {
      return res.status(400).send({ message: 'Error: order is already paid' });
    }
    order.isPaid = true;
    // @ts-ignore
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    };
    const paidOrder = await db.AppDataSource.getMongoRepository(Order).save(
      order
    );
    await db.disconnection();
    res.send({ message: 'order paid successfully', order: paidOrder });
  } else {
    await db.disconnection();
    res.status(404).send({ message: 'Error: order not found' });
  }
};

export default handler;
