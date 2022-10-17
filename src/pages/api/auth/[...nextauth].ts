import { User } from 'src/models/User.entity';
import db from '@/utils/db';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {},
      authorize: async (credentials: any): Promise<any> => {
        try {
          await db.connection();
          const user = await db.AppDataSource.manager.findOneBy(User, {
            email: credentials.email,
          });
          await db.disconnection();

          if (
            user &&
            bcryptjs.compareSync(credentials.password, user.password)
          ) {
            return {
              _id: user._id,
              name: user.name,
              email: user.email,
              image: 'f',
              isAdmin: user.isAdmin,
            };
          }
          throw new Error('Invalid email or password');
        } catch (e: any) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (user?.id) token._id = user.id;
      if (user?.isAdmin) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }: any) {
      if (token?._id) session.user._id = token._id;
      if (token?.isAdmin) session.user.isAdmin = token.isAdmin;
      return session;
    },
  },
});
