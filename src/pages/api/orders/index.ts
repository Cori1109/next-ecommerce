import { Order } from 'src/models/Order.entity';
import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Signin required!');
  }

  const { user } = session;
  await db.connection();
  // const newOrder = new Order({
  //   ...req.body,
  //   user: user._id,
  // });
  // console.log(user);
  const _user = await db.AppDataSource.manager.findOne(User, {
    where: {
      email: user.email,
    },
  });
  // console.log(_user);
  const newOrder = new Order();
  newOrder.user = _user;
  newOrder.orderItems = req.body.orderItems;
  newOrder.shippingAddress = req.body.shippingAddress;
  newOrder.paymentMethod = req.body.paymentMethod;
  newOrder.itemsPrice = req.body.itemsPrice;
  newOrder.shippingPrice = req.body.shippingPrice;
  newOrder.taxPrice = req.body.taxPrice;
  newOrder.totalPrice = req.body.totalPrice;
  newOrder.isPaid = req.body.isPaid;
  newOrder.isDelivered = req.body.isDelivered;

  // console.log(newOrder);

  const order = await db.AppDataSource.manager.save(newOrder);
  res.status(201).send(order);
  await db.disconnection();
};

export default handler;
