import { Product } from 'src/models/Product.entity';
import db from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectID } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connection();
  const product = await db.AppDataSource.manager.findOne(Product, {
    where: {
      _id: new ObjectID(req.query.id as string),
    },
  });
  await db.disconnection();
  res.send(product);
};

export default handler;
