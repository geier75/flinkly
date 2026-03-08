/**
 * Deliveries Edge Function
 * Handles file upload/download for order deliveries
 * 
 * Endpoints:
 * - POST /deliveries - Upload delivery file
 * - GET /deliveries/:id - Get delivery metadata
 * - GET /deliveries/:id/download - Download delivery file
 * - PUT /deliveries/:id - Update delivery (accept/reject)
 * - GET /deliveries/order/:orderId - List deliveries for order
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface DeliveryMetadata {
  orderId: number;
  message?: string;
  version?: number;
}

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

    // POST /deliveries - Upload delivery file
    if (req.method === "POST" && pathParts.length === 1) {
      return await handleUpload(req, supabase, user.id);
    }

    // GET /deliveries/:id - Get delivery metadata
    if (req.method === "GET" && pathParts.length === 2 && pathParts[1] !== "download") {
      const deliveryId = parseInt(pathParts[1]);
      return await getDelivery(supabase, deliveryId, user.id);
    }

    // GET /deliveries/:id/download - Download delivery file
    if (req.method === "GET" && pathParts.length === 3 && pathParts[2] === "download") {
      const deliveryId = parseInt(pathParts[1]);
      return await downloadDelivery(supabase, deliveryId, user.id, req);
    }

    // PUT /deliveries/:id - Update delivery (accept/reject)
    if (req.method === "PUT" && pathParts.length === 2) {
      const deliveryId = parseInt(pathParts[1]);
      return await updateDelivery(req, supabase, deliveryId, user.id);
    }

    // GET /deliveries/order/:orderId - List deliveries for order
    if (req.method === "GET" && pathParts.length === 3 && pathParts[1] === "order") {
      const orderId = parseInt(pathParts[2]);
      return await listDeliveries(supabase, orderId, user.id);
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Deliveries function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Upload delivery file
 */
async function handleUpload(req: Request, supabase: any, userId: string) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const metadata = JSON.parse(formData.get("metadata") as string) as DeliveryMetadata;

  if (!file) {
    return new Response(
      JSON.stringify({ error: "No file provided" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate file size (500MB max)
  if (file.size > 524288000) {
    return new Response(
      JSON.stringify({ error: "File too large. Maximum size is 500MB" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Verify user is seller for this order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, seller_id, buyer_id, status")
    .eq("id", metadata.orderId)
    .eq("seller_id", userId)
    .single();

  if (orderError || !order) {
    return new Response(
      JSON.stringify({ error: "Order not found or unauthorized" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Check order status (must be in_progress or in_review)
  if (!["in_progress", "in_review"].includes(order.status)) {
    return new Response(
      JSON.stringify({ error: "Order must be in progress to upload delivery" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Generate storage path: deliveries/{seller_id}/{order_id}/{timestamp}_{filename}
  const timestamp = Date.now();
  const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${userId}/${metadata.orderId}/${timestamp}_${sanitizedFilename}`;

  // Upload to Supabase Storage
  const fileBuffer = await file.arrayBuffer();
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("deliveries")
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return new Response(
      JSON.stringify({ error: "Failed to upload file" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Create delivery record
  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .insert({
      order_id: metadata.orderId,
      seller_id: userId,
      buyer_id: order.buyer_id,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      storage_path: storagePath,
      message: metadata.message || null,
      version: metadata.version || 1,
      status: "delivered",
    })
    .select()
    .single();

  if (deliveryError) {
    // Rollback: delete uploaded file
    await supabase.storage.from("deliveries").remove([storagePath]);
    
    return new Response(
      JSON.stringify({ error: "Failed to create delivery record" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Update order status to in_review
  await supabase
    .from("orders")
    .update({ status: "in_review" })
    .eq("id", metadata.orderId);

  return new Response(
    JSON.stringify({ delivery }),
    { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Get delivery metadata
 */
async function getDelivery(supabase: any, deliveryId: number, userId: string) {
  const { data: delivery, error } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", deliveryId)
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .single();

  if (error || !delivery) {
    return new Response(
      JSON.stringify({ error: "Delivery not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ delivery }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Download delivery file
 */
async function downloadDelivery(supabase: any, deliveryId: number, userId: string, req: Request) {
  // Get delivery metadata
  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("id", deliveryId)
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .single();

  if (deliveryError || !delivery) {
    return new Response(
      JSON.stringify({ error: "Delivery not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Download from storage
  const { data: fileData, error: downloadError } = await supabase.storage
    .from("deliveries")
    .download(delivery.storage_path);

  if (downloadError) {
    return new Response(
      JSON.stringify({ error: "Failed to download file" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Track download
  const userAgent = req.headers.get("user-agent") || "unknown";
  const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  
  await supabase.from("delivery_downloads").insert({
    delivery_id: deliveryId,
    user_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
  });

  // Return file with appropriate headers
  return new Response(fileData, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": delivery.file_type,
      "Content-Disposition": `attachment; filename="${delivery.file_name}"`,
      "Content-Length": delivery.file_size.toString(),
    },
  });
}

/**
 * Update delivery (accept/reject)
 */
async function updateDelivery(req: Request, supabase: any, deliveryId: number, userId: string) {
  const body = await req.json();
  const { status, rejection_reason } = body;

  if (!["accepted", "rejected"].includes(status)) {
    return new Response(
      JSON.stringify({ error: "Invalid status. Must be 'accepted' or 'rejected'" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Get delivery and verify buyer
  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .select("*, orders!inner(id, status)")
    .eq("id", deliveryId)
    .eq("buyer_id", userId)
    .single();

  if (deliveryError || !delivery) {
    return new Response(
      JSON.stringify({ error: "Delivery not found or unauthorized" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Update delivery status
  const updateData: any = { status };
  if (status === "rejected" && rejection_reason) {
    updateData.rejection_reason = rejection_reason;
  }

  const { data: updatedDelivery, error: updateError } = await supabase
    .from("deliveries")
    .update(updateData)
    .eq("id", deliveryId)
    .select()
    .single();

  if (updateError) {
    return new Response(
      JSON.stringify({ error: "Failed to update delivery" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // If accepted, update order status to completed
  if (status === "accepted") {
    await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", delivery.order_id);
  }

  return new Response(
    JSON.stringify({ delivery: updatedDelivery }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * List deliveries for an order
 */
async function listDeliveries(supabase: any, orderId: number, userId: string) {
  // Verify user has access to this order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id")
    .eq("id", orderId)
    .or(`seller_id.eq.${userId},buyer_id.eq.${userId}`)
    .single();

  if (orderError || !order) {
    return new Response(
      JSON.stringify({ error: "Order not found or unauthorized" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Get all deliveries for this order
  const { data: deliveries, error: deliveriesError } = await supabase
    .from("deliveries")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false });

  if (deliveriesError) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch deliveries" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ deliveries }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
