import db from '@/utils/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';
import { Product } from '@/models/Product.entity';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'PUT') {
    return putHandler(req, res);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connection();
  // const product = await Product.findById(req.query.id);
  const product = await db.AppDataSource.getMongoRepository(Product).findOneBy({
    _id: new ObjectID(req.query.id as string),
  });
  await db.disconnection();
  res.send(product);
};
const putHandler = async (req, res) => {
  await db.connection();
  // const product = await Product.findById(req.query.id);
  const product = await db.AppDataSource.getMongoRepository(Product).findOneBy({
    _id: new ObjectID(req.query.id as string),
  });
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.category = req.body.category;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await db.AppDataSource.getMongoRepository(Product).save(product);
    await db.disconnection();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnection();
    res.status(404).send({ message: 'Product not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connection();
  // const product = await Product.findById(req.query.id);
  const product = await db.AppDataSource.getMongoRepository(Product).findOneBy({
    _id: new ObjectID(req.query.id as string),
  });
  if (product) {
    // await product.remove();
    await db.AppDataSource.getMongoRepository(Product).remove(product);
    await db.disconnection();
    res.send({ message: 'Product deleted successfully' });
  } else {
    await db.disconnection();
    res.status(404).send({ message: 'Product not found' });
  }
};
export default handler;
