import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { sendEmail } from '../_shared/resend.ts'

// Initialize Supabase Admin Client for server-side operations
const supabaseAdmin: SupabaseClient = createClient(
  // @ts-ignore
  Deno.env.get('SUPABASE_URL') ?? '',
  // @ts-ignore
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const createShippingUpdateHtml = (order: any, status: string, siteContent: any): string => {
  const siteName = siteContent?.site_name ?? 'E-Shop Pro';
  const primaryColor = siteContent?.theme_primary ?? '#1a237e';
  const orderId = order.id.toString().slice(-6);
  
  let title = '';
  let message = '';

  switch (status) {
    case 'Processing':
      title = 'Your Order is Being Processed!';
      message = `We're getting your order #${orderId} ready for shipment. We will notify you again once it has been shipped.`;
      break;
    case 'Shipped':
      title = 'Your Order is on its way!';
      message = `We're happy to let you know that your order #${orderId} has been shipped. You can expect it to arrive soon.`;
      break;
    case 'Delivered':
      title = 'Your Order has been Delivered!';
      message = `Your order #${orderId} has been successfully delivered. We hope you enjoy your products!`;
      break;
    case 'Cancelled':
      title = 'Your Order has been Cancelled';
      message = `We have cancelled your order #${orderId} as requested. If you have any questions, please contact our support team.`;
      break;
    default:
      title = 'Update on your Order';
      message = `There is an update on your order #${orderId}. The new status is: ${status}.`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
            .container { max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .header { background-color: ${primaryColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>${title}</h1></div>
            <div class="content">
                <h2>Hi ${order.profiles.name},</h2>
                <p>${message}</p>
                <p>Thank you for shopping with us.</p>
            </div>
            <div class="footer">&copy; ${new Date().getFullYear()} ${siteName}. All Rights Reserved.</div>
        </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) throw new Error("orderId and status are required.");

    // Fetch the full order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, user_id, created_at, profiles(name)')
      .eq('id', orderId)
      .single();
    if (orderError) throw orderError;

    // Fetch the customer's email securely
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (userError) throw userError;
    if (!user || !user.email) throw new Error("Customer email not found.");

    // Fetch site content for theming
    const { data: siteContent, error: contentError } = await supabaseAdmin
      .from('site_content')
      .select('site_name, theme_primary, sender_email')
      .eq('id', 1)
      .single();
    if (contentError) throw contentError;
    if (!siteContent?.sender_email) {
      throw new Error("Sender email is not configured in site content.");
    }

    const subject = `Update on your ${siteContent?.site_name || 'E-Shop Pro'} Order #${order.id.toString().slice(-6)}`;
    const html = createShippingUpdateHtml(order, status, siteContent);

    await sendEmail({
      from: siteContent.sender_email,
      to: user.email,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true, message: 'Shipping update email sent.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending shipping update email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});