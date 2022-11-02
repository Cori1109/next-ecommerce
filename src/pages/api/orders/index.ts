import { Order } from 'src/models/Order.entity';
import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

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
      _id: new ObjectID(user._id as string),
    },
  });

  const newOrder = {
    ...req.body,
    user: _user,
  };

  // console.log(newOrder);

  // const order = await db.AppDataSource.manager.save(newOrder);
  const order = await db.AppDataSource.getMongoRepository(Order).save(newOrder);
  res.status(201).send(order);
  await db.disconnection();
};

export default handler;
