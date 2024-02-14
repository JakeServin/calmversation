import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { useStore } from "./store";

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();

	// Create a Supabase client configured to use cookies
	const supabase = createMiddlewareClient<Database>({ req, res });

	// Refresh session if expired - required for Server Components
	await supabase.auth.getSession();

	const { data } = await supabase.auth.getUser();

	// if user is signed in and the current path is / redirect the user to /account
	if (data.user && req.nextUrl.pathname.includes("auth")) {
		return NextResponse.redirect(new URL("/", req.url));
	}
	if (!data.user && req.nextUrl.pathname.includes("settings")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
