import { Order } from 'src/models/Order.entity';
import db from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('Signin required!');
  }

  await db.connection();

  const order = await db.AppDataSource.manager.findOneBy(Order, {
    _id: new ObjectID(req.query.id as string),
  });
  // console.log(order);
  await db.disconnection();
  res.send(order);
};

export default handler;
