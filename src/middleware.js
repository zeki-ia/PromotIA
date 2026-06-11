import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/insights", "/billing", "/onboarding", "/settings"];
const REQUIRES_SUB = ["/dashboard", "/insights", "/settings"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { response.cookies.set({ name, value, ...options }); },
        remove(name, options) { response.cookies.set({ name, value: "", ...options }); },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();

  if (PROTECTED.some(r => pathname.startsWith(r)) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (REQUIRES_SUB.some(r => pathname.startsWith(r)) && session) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("status")
      .eq("company_id", session.user.user_metadata?.company_id)
      .single();

    if (sub && sub.status !== "active") {
      return NextResponse.redirect(new URL("/blocked", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/insights/:path*", "/billing/:path*", "/onboarding/:path*", "/settings/:path*"],
};
