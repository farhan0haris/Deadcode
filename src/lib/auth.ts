import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID && process.env.GITHUB_ID !== "placeholder_github_id" ? process.env.GITHUB_ID : "",
      clientSecret: process.env.GITHUB_SECRET && process.env.GITHUB_SECRET !== "placeholder_github_secret" ? process.env.GITHUB_SECRET : "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const email = (credentials.email as string) || "user@deadcode.dev";
        const name = (credentials.name as string) || (email.includes("@") ? email.split("@")[0] : "Developer");
        const username = (credentials.username as string) || (email.includes("@") ? email.split("@")[0] : "user");

        return {
          id: `usr_${Date.now()}`,
          name: name,
          email: email,
          image: `https://api.dicebear.com/7.x/identicon/svg?seed=${username}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "deadcode_production_online_secret_key_32_characters_minimum",
});
