import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import bcryptjs from 'bcryptjs';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !email.includes('@') ||
    !password ||
    password.trim().length < 5
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connection();

  // const existingUser = await User.findOne({ email: email });
  const existingUser = await db.AppDataSource.manager.findOneBy(User, {
    email: email,
  });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnection();
    return;
  }

  const newUser = {
    name,
    email,
    password: bcryptjs.hashSync(password),
    isAdmin: false,
  };

  // const user = await newUser.save();
  const user = await db.AppDataSource.getMongoRepository(User).save(newUser);

  await db.disconnection();
  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
