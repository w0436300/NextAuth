//pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import { verifyPassword } from "@/utils/auth";
import logger from '@/utils/logger';


const User = mongoose.models.Users;

// const MAX_LOGIN_ATTEMPTS = 5;
// const LOCK_TIME = 30 * 60 * 1000; 

export default NextAuth({
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'jenny@example.com' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          const user = await User.findOne({ email: credentials.email });
  
          if (!user) {
            throw new Error('No user found!');
          }
  
          const isValid = await verifyPassword(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Could not log you in!');
          }
  
          return { email: user.email, name: user.firstname, role: user.role };
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: 24 * 60 * 60,
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        if (account.provider === 'google') {
          // Check if the user already exists in the database
          const existingUser = await User.findOne({ email: profile.email });
          if (existingUser) {
            // If the user exists, return the user object
            return existingUser;
          } else {
            // If the user doesn't exist, create a new user record
            const newUser = new User({
              email: profile.email,
              firstname: profile.given_name,
              lastname: profile.family_name,
              password: '',
              role: 'user',
              bookmarks: [],
              createdAt: new Date(),
              updatedAt: null,
            });
            await newUser.save();
            return newUser;
          }
        }
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.email;
          token.role = user.role;
        }
        return token;
      },
      async session({ session, token }) {
        session.user.role = token.role;
        session.user.email = token.sub;
        
        const user = await User.findOne({ email: token.sub });

        if (user) {
          session.user._id = user._id.toString();
        }

        return session;
         
      },      
    },
    pages: {
      signIn: '/auth/signin',
    },
    events: {
      async signOut() {
      },
    },
});