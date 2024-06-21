import Google from "next-auth/providers/google";
import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      // XXX FIXME XXX
      // all this nexted control flow / waterfall is ugly
      // gotta be a way to improve this
      try {
        // check for existing user in the database
        const existsResponse = await fetch(
          `http://localhost:3000/api/users/email/${user.email}`,
          {
            method: "HEAD",
          },
        );
        if (existsResponse.status === 204) {
          // user exists, update their "last_login_at" field
          const updateResponse = await fetch(
            `http://localhost:3000/api/users/email/${user.email}`,
            {
              method: "PATCH",
            },
          );
          if (updateResponse.status === 500) {
            // some error updating login timestamp - deny auth
            return false;
          }
        }
        // no user exists in our database, so add 'em
        if (existsResponse.status === 404) {
          const insertResponse = await fetch(
            "http://localhost:3000/api/users/",
            {
              method: "POST",
              body: JSON.stringify({ name: user.name, email: user.email }),
            },
          );
          // some error adding user to database - deny auth
          if (insertResponse.status === 500) {
            return false;
          }
        }
        // some error checking for the user - deny auth
        if (existsResponse.status === 500) {
          return false;
        }
        // everything successful, so auth is good to go
        return true;
      } catch (err) {
        console.error("Error in signIn callback: ", err);
        // some unforseen problem - deny auth
        return false;
      }
    },
  },
});
