import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const urlClone = req.nextUrl.clone();

  if (pathname === "/") {
    // we want our authenticated users to land on the dashboard
    if (req.auth) {
      urlClone.pathname = "/dashboard";
      return NextResponse.redirect(urlClone);
    }
  } else {
    // redirect unauthenticated users to sign in landing page
    if (!req.auth) {
      urlClone.pathname = "/";
      return NextResponse.redirect(urlClone);
    }
  }
  return NextResponse.next();
});

// need to add each new route we want protected in this way
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
