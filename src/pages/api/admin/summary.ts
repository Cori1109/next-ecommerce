import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/db';
import { Order } from 'src/models/Order.entity';
import { Product } from 'src/models/Product.entity';
import { User } from 'src/models/User.entity';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  // console.log(session);
  // @ts-ignore
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  await db.connection();

  const ordersCount = await db.AppDataSource.getMongoRepository(Order).count();
  const productsCount = await db.AppDataSource.getMongoRepository(
    Product
  ).count();
  const usersCount = await db.AppDataSource.getMongoRepository(User).count();
  // const ordersPriceGroup = await Order.aggregate([
  //   {
  //     $group: {
  //       _id: null,
  //       sales: { $sum: '$totalPrice' },
  //     },
  //   },
  // ]);
  const ordersPriceGroup = await db.AppDataSource.getMongoRepository(Order)
    .aggregate([
      {
        $group: {
          _id: null,
          sales: {
            $sum: '$totalPrice',
          },
        },
      },
    ])
    .toArray();

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await db.AppDataSource.getMongoRepository(Order)
    .aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$created_at' } },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ])
    .toArray();

  const paidsData = await db.AppDataSource.getMongoRepository(Order)
    .aggregate([
      {
        $match: {
          isPaid: { $eq: true },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$created_at' } },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ])
    .toArray();

  await db.disconnection();
  res.send({
    ordersCount,
    productsCount,
    usersCount,
    ordersPrice,
    salesData,
    paidsData,
  });
};

export default handler;
