import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

import { addNewProfileImage } from "./lib/images/images";
import generateError from "./lib/errors/errors";

import {
  addUserToDatabase,
  getUserIdFromEmail,
  updateUserLoginTimestamp,
} from "./lib/db/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email || !user.name || !user.image) {
          throw new Error("Missing user data");
        }
        // this gives our user's id if they're in the db, 0 if not
        let userId = await getUserIdFromEmail(user.email);
        if (userId) {
          await updateUserLoginTimestamp(userId);
        } else {
          const newUserId = await addUserToDatabase({
            name: user.name,
            email: user.email,
          });
          userId = newUserId;
          // get their profile image, reisze & store it locally
          await addNewProfileImage(userId, user.image);
        }
        // store the id in the auth user object
        user.id = userId.toString();
        return true;
      } catch (err) {
        // some error in database calls
        console.error(
          JSON.stringify(
            generateError(
              err,
              "signIn",
              "Error signing in within next-auth callback",
              0,
            ),
          ),
        );
        return false;
      }
    },
    jwt({ token, user }) {
      if (user && user.id) {
        // attach user id to token for access in session
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        // make sure we have the id available in the current session
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
