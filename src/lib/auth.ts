import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginCredentialsSchema } from "./validations";
import { getAuthSecret } from "./env";
import { securityLogger } from "./logger";
import { recordAuthSuccess } from "./rateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GithubProvider({
      clientId:
        process.env.GITHUB_ID && process.env.GITHUB_ID !== "placeholder_github_id"
          ? process.env.GITHUB_ID
          : "",
      clientSecret:
        process.env.GITHUB_SECRET && process.env.GITHUB_SECRET !== "placeholder_github_secret"
          ? process.env.GITHUB_SECRET
          : "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text" },
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          securityLogger.warn("AUTH_FAILURE", "Missing credentials payload");
          return null;
        }

        // Schema validation for email & password
        const validation = loginCredentialsSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validation.success) {
          securityLogger.warn("AUTH_FAILURE", "Invalid credentials schema format", {
            email: credentials.email,
          });
          return null;
        }

        const email = validation.data.email.toLowerCase();
        const rawName = typeof credentials.name === "string" ? credentials.name.trim() : "";
        const rawUsername = typeof credentials.username === "string" ? credentials.username.trim() : "";
        const name = rawName || email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
        const username = rawUsername || email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "");

        // Record successful auth to reset rate limit failures
        recordAuthSuccess(`auth:${email}`);
        securityLogger.log({
          event: "AUTH_SUCCESS",
          user: username,
          details: { email },
        });

        return {
          id: `usr_${Buffer.from(email).toString("base64").replace(/=/g, "")}`,
          name: name.slice(0, 100),
          email: email,
          image: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
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
  secret: getAuthSecret(),
});
