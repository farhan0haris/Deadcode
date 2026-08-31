import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { loginCredentialsSchema } from "./validations";
import { getAuthSecret } from "./env";
import { securityLogger } from "./logger";
import { recordAuthSuccess } from "./rateLimit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
      profile(profile) {
        return {
          id: String(profile.id),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          githubId: String(profile.id),
          githubUsername: profile.login,
          bio: profile.bio || null,
          githubUrl: profile.html_url || null,
          publicRepos: profile.public_repos || 0,
          followers: profile.followers || 0,
          following: profile.following || 0,
        };
      },
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
          securityLogger.warn("AUTH_FAILURE", "Missing credentials payload");
          return null;
        }

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

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email,
              name,
              githubUsername: username,
              image: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
            },
          });
        }

        recordAuthSuccess(`auth:${email}`);
        securityLogger.log({
          event: "AUTH_SUCCESS",
          user: username,
          details: { email },
        });

        return {
          id: dbUser.id,
          name: dbUser.name || name,
          email: dbUser.email,
          image: dbUser.image,
          githubUsername: dbUser.githubUsername || username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        if ((user as any).githubUsername) {
          token.githubLogin = (user as any).githubUsername;
        }
      }
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile && (profile as any).login) {
        token.githubLogin = (profile as any).login;
        token.githubId = String(profile.id);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        (session.user as any).accessToken = token.accessToken as string | undefined;
        (session.user as any).githubLogin = token.githubLogin as string | undefined;
        (session.user as any).githubId = token.githubId as string | undefined;
      }
      return session;
    },
  },
  secret: getAuthSecret(),
});
