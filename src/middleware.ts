import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const urlClone = req.nextUrl.clone();

  if (pathname === "/landing") {
    // we want our authenticated users to land on the dashboard
    if (req.auth) {
      urlClone.pathname = "/";
      return NextResponse.redirect(urlClone);
    }
  } else {
    // redirect unauthenticated users to sign in landing page
    if (!req.auth) {
      urlClone.pathname = "/landing";
      return NextResponse.redirect(urlClone);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
