import NextAuth, { Session } from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import Models from "../../../utils/models";

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: +process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  adapter: Adapters.TypeORM.Adapter(
    // The first argument should be a database connection string or TypeORM config object
    // {type: 'mariadb',
    //   database: process.env.NEXT_PUBLIC_DATABASE_URL},
    process.env.NEXT_PUBLIC_DATABASE_URL,
    // The second argument can be used to pass custom models and schemas
    {
      models: {
        Account: Adapters.TypeORM.Models.Account,
        Session: Adapters.TypeORM.Models.Session,
        VerificationRequest: Adapters.TypeORM.Models.VerificationRequest,
        User: Models.User,
      },
    }
  ),

  // A database is optional, but required to persist accounts in a database
  // database: process.env.NEXT_PUBLIC_DATABASE_URL,
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session: Session, token) => {
      console.log("nextauth:::user: ", token);
      console.log("nextauth:::session before: ", session);
      session.jwt = token.jwt;
      session.id = token.id;
      console.log("nextauth:::session after: ", session);
      return Promise.resolve(session);
    },
    jwt: async (token, user, account) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_GRAPHQL_API_HOST}/auth/${account.provider}/callback?access_token=${account?.accessToken}`
        );
        const data = await response.json();
        console.log('jwt data::: ',data);
        token.jwt = data.jwt;
        token.id = data.user.id;
      }
      return Promise.resolve(token);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
