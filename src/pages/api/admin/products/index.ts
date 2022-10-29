import { Product } from 'src/models/Product.entity';
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/utils/db';
import { getSession } from 'next-auth/react';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
  await db.connection();
  const newProduct = {
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image: '/images/shirt1.jpg',
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  };

  // const product = await newProduct.save();
  const product = await db.AppDataSource.getMongoRepository(Product).save(
    newProduct
  );
  await db.disconnection();
  res.send({ message: 'Product created successfully', product });
};
const getHandler = async (req, res) => {
  await db.connection();
  // const products = await Product.find({});
  const products = await db.AppDataSource.manager.find(Product);
  await db.disconnection();
  res.send(products);
};
export default handler;
