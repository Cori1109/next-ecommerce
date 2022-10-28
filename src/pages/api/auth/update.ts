import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import bcryptjs from 'bcryptjs';
import { getSession } from 'next-auth/react';
import { ObjectID } from 'mongodb';

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }

  const { user } = session;
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !email.includes('@') ||
    (password && password.trim().length < 5)
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connection();
  const toUpdateUser = await db.AppDataSource.manager.findOneBy(User, {
    email: user.email,
  });
  toUpdateUser.name = name;
  toUpdateUser.email = email;

  if (password) {
    toUpdateUser.password = bcryptjs.hashSync(password);
  }
  // console.log(toUpdateUser);
  await db.AppDataSource.getMongoRepository(User).save(toUpdateUser);
  await db.disconnection();
  res.send({
    message: 'User updated',
  });
}

export default handler;
