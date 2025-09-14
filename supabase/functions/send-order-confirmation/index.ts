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

const createOrderConfirmationHtml = (order: any, siteContent: any): string => {
  const siteName = siteContent?.site_name ?? 'E-Shop Pro';
  const primaryColor = siteContent?.theme_primary ?? '#1a237e';
  const orderId = order.id.toString().slice(-6);
  const orderDate = new Date(order.created_at).toLocaleDateString();

  const itemsHtml = order.order_items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.products.name} (x${item.quantity})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${(item.price_at_purchase * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

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
            table { width: 100%; border-collapse: collapse; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header"><h1>Thank you for your order!</h1></div>
            <div class="content">
                <h2>Hi ${order.profiles.name},</h2>
                <p>Your order #${orderId} has been confirmed. We're getting it ready and will notify you once it has shipped.</p>
                <h3>Order Summary (${orderDate})</h3>
                <table>
                    ${itemsHtml}
                    <tr>
                      <td style="padding: 10px; font-weight: bold;">Total</td>
                      <td style="padding: 10px; font-weight: bold; text-align: right;">₦${order.total.toLocaleString()}</td>
                    </tr>
                </table>
                <p>You can view your order details in your account dashboard.</p>
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
    const { order } = await req.json();
    if (!order) throw new Error("Order data is required.");

    // Fetch the customer's email securely using their user_id
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(order.user_id);
    if (userError) throw userError;
    if (!user || !user.email) throw new Error("Customer email not found.");

    // Fetch site content for theming the email
    const { data: siteContent, error: contentError } = await supabaseAdmin
      .from('site_content')
      .select('site_name, theme_primary, sender_email')
      .eq('id', 1)
      .single();
    if (contentError) throw contentError;
    if (!siteContent?.sender_email) {
      throw new Error("Sender email is not configured in site content.");
    }

    const subject = `Your ${siteContent?.site_name || 'E-Shop Pro'} Order #${order.id.toString().slice(-6)} is Confirmed!`;
    const html = createOrderConfirmationHtml(order, siteContent);

    await sendEmail({
      from: siteContent.sender_email,
      to: user.email,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true, message: 'Confirmation email sent.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});