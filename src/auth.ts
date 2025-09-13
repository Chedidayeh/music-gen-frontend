import {PrismaAdapter} from "@auth/prisma-adapter"
import NextAuth, { type DefaultSession } from "next-auth"
import authConfig from "./auth.config"
import { db } from "./server/db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

 
// declare module "next-auth/jwt" {
//   interface JWT {
//   }
// }




export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async session({ token,session }) {
      if(token.sub && session.user){
        session.user.id = token.sub
      }



      return session
    },
    async jwt ({token , trigger , session   }) {
      if(!token.sub) return token
      // Note: Removed Prisma call from JWT callback to avoid edge runtime issues
      return token
    },
  },
  adapter : PrismaAdapter(db),
  session : {strategy : "jwt" , 
  },
  ...authConfig,
})