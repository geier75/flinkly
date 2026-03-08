/**
 * Favorites Edge Function
 * Handles user favorites for gigs
 * 
 * Endpoints:
 * - POST /favorites - Add gig to favorites
 * - DELETE /favorites/:gigId - Remove gig from favorites
 * - GET /favorites - List user's favorite gigs
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    // GET /favorites - List user's favorites
    if (req.method === "GET") {
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select(`
          gig_id,
          created_at,
          gigs (
            id,
            title,
            description,
            category,
            price,
            delivery_time,
            seller_id,
            image_url,
            average_rating,
            total_reviews
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ favorites: favorites || [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST /favorites - Add to favorites
    if (req.method === "POST") {
      const body = await req.json();
      const { gigId } = body;

      if (!gigId) {
        return new Response(
          JSON.stringify({ error: "gigId is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if gig exists
      const { data: gig, error: gigError } = await supabase
        .from("gigs")
        .select("id")
        .eq("id", gigId)
        .single();

      if (gigError || !gig) {
        return new Response(
          JSON.stringify({ error: "Gig not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already favorited
      const { data: existing } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("gig_id", gigId)
        .single();

      if (existing) {
        return new Response(
          JSON.stringify({ message: "Already in favorites" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Add to favorites
      const { data: favorite, error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          gig_id: gigId,
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ favorite }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE /favorites/:gigId - Remove from favorites
    if (req.method === "DELETE") {
      const gigId = pathParts[pathParts.length - 1];

      if (!gigId) {
        return new Response(
          JSON.stringify({ error: "gigId is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("gig_id", gigId);

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ message: "Removed from favorites" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
