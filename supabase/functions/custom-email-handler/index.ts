import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Define types for clarity
interface SiteContent {
  site_name: string | null;
  theme_primary: string | null;
  email_verification_title: string | null;
  email_verification_body: string | null;
}

interface User {
  id: string;
  email?: string;
}

interface HookPayload {
  type: string;
  user: User;
  data: {
    confirmation_url: string;
  };
}

// Function to generate the HTML for the email
const createEmailHtml = (siteContent: SiteContent, confirmationUrl: string): string => {
  const { 
    site_name = 'E-Shop Pro', 
    theme_primary = '#1a237e',
    email_verification_title = 'Verify Your Email',
    email_verification_body = 'Thanks for signing up! Please click the button below to complete your registration.'
  } = siteContent;

  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${email_verification_title}</title>
    <style>
      body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f1f5f9; }
      .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
      .header { background-color: ${theme_primary}; color: #ffffff; padding: 24px; text-align: center; }
      .header h1 { margin: 0; font-size: 24px; }
      .content { padding: 32px; color: #1f2937; line-height: 1.6; }
      .content h2 { font-size: 20px; color: #111827; margin-top: 0; }
      .button { display: inline-block; background-color: ${theme_primary}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 24px 0; }
      .footer { background-color: #f8fafc; color: #64748b; padding: 24px; text-align: center; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${site_name}</h1>
      </div>
      <div class="content">
        <h2>${email_verification_title}</h2>
        <p>${email_verification_body.replace(/\n/g, '<br>')}</p>
        <a href="${confirmationUrl}" class="button">Verify Your Email</a>
        <p>If you cannot click the button, please copy and paste this link into your browser:</p>
        <p style="word-break: break-all; font-size: 12px;">${confirmationUrl}</p>
      </div>
      <div class="footer">
        &copy; ${currentYear} ${site_name}. All Rights Reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

// Initialize Supabase Admin Client
const supabaseAdmin: SupabaseClient = createClient(
  // @ts-ignore
  Deno.env.get('SUPABASE_URL') ?? '',
  // @ts-ignore
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: HookPayload = await req.json();
    const { user, data } = payload;
    const { confirmation_url } = data;

    if (!user || !confirmation_url) {
      throw new Error("Invalid request payload. 'user' and 'data.confirmation_url' are required.");
    }

    // Fetch site content from the database
    const { data: siteContent, error } = await supabaseAdmin
      .from('site_content')
      .select('site_name, theme_primary, email_verification_title, email_verification_body')
      .eq('id', 1)
      .single<SiteContent>();
      
    if (error) {
      console.error('Error fetching site content:', error);
      throw new Error('Failed to fetch site content for email template.');
    }
    
    if (!siteContent) {
        throw new Error("Site content not found in database.");
    }

    const emailHtml = createEmailHtml(siteContent, confirmation_url);
    
    // This is the response Supabase Auth expects to customize the email
    const responsePayload = {
      subject: siteContent.email_verification_title || 'Verify Your Email Address',
      html_body: emailHtml,
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in custom email handler:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});