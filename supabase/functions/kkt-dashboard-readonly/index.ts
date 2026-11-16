// Supabase Edge Function — STAGING ONLY; production deployment forbidden until release gates pass.
// Returns no business data until verified authorization and data mapping are implemented.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigin = "https://kkt-setia-sdn-bhd.github.io";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const publishableKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const resources = new Set(["claims", "projects", "property", "documents"]);

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") || "";
  const cors = origin && origin === allowedOrigin
    ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" }
    : {};
  const headers = { ...cors, "Cache-Control": "no-store", "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" };
  const reply = (status: number, error: string) => new Response(JSON.stringify({error}), {status,headers});
  if (!allowedOrigin || !supabaseUrl || !publishableKey) return reply(503,"NOT_CONFIGURED");
  if (origin && origin !== allowedOrigin) return reply(403,"ORIGIN_DENIED");
  if (request.method === "OPTIONS") return new Response(null, {status:204,headers:{...headers,"Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"authorization, content-type"}});
  if (request.method !== "GET") return reply(405,"METHOD_NOT_ALLOWED");
  const url = new URL(request.url);
  const resource = url.pathname.split("/").filter(Boolean).at(-1);
  if (!resource || !resources.has(resource) || url.pathname !== "/functions/v1/kkt-dashboard-readonly/" + resource) return reply(404,"NOT_FOUND");
  const authorization = request.headers.get("authorization") || "";
  if (!/^Bearer\s+\S+$/i.test(authorization)) return reply(401,"AUTH_REQUIRED");
  const client = createClient(supabaseUrl,publishableKey,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:authorization}}});
  const {data,error} = await client.auth.getUser(authorization.replace(/^Bearer\s+/i,""));
  if (error || !data?.user?.id || data.user.is_anonymous) return reply(401,"AUTH_INVALID");
  // Deliberately fail closed: user existence does NOT grant access to finance or property.
  // Implement server-verified grants, project-scoped RLS and document entitlements before returning rows.
  return reply(403,"RESOURCE_ACCESS_NOT_YET_APPROVED");
});
