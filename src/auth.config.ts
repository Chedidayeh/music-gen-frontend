import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"


export  default {
    pages: {
        signIn: "/auth/sign-in",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnCreate = nextUrl.pathname.startsWith("/create");
            const isOnAuth = nextUrl.pathname.startsWith("/auth");
            
            if (isOnDashboard || isOnCreate) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            
            if (isLoggedIn && isOnAuth) {
                return Response.redirect(new URL("/dashboard", nextUrl));
            }
            
            return true;
        },
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        // Credentials({
        //     async authorize(credentials) {
        //         const validatedFields = LoginSchema.safeParse(credentials)

        //         if(validatedFields.success){
        //             const {email , password } = validatedFields.data

        //             const user = await getUserByEmail(email)
        //             if(!user || !user.password){
        //                 return null;
        //             }
        //             const passwordMatch = await bcrypt.compare(
        //                 password,
        //                 user.password,
        //             );

        //             if(passwordMatch) return user;
        //         }
        //         return null
        //     }
        // })
    ],
} satisfies NextAuthConfig