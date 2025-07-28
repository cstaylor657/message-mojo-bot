import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    
    // Get auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'connect') {
      // Generate OAuth URL
      const facebookAppId = Deno.env.get('FACEBOOK_APP_ID')
      const baseUrl = req.headers.get('origin') || 'http://localhost:8080'
      const redirectUri = `${baseUrl}/oauth/facebook/callback`
      
      const scope = 'pages_show_list,pages_read_engagement,instagram_basic,instagram_content_publish'
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${user.id}&` +
        `response_type=code`

      return new Response(JSON.stringify({ oauthUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'callback') {
      const { code, state } = await req.json()
      
      if (state !== user.id) {
        return new Response(JSON.stringify({ error: 'Invalid state parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Exchange code for access token
      const facebookAppId = Deno.env.get('FACEBOOK_APP_ID')
      const facebookAppSecret = Deno.env.get('FACEBOOK_APP_SECRET')
      const baseUrl = req.headers.get('origin') || 'http://localhost:8080'
      const redirectUri = `${baseUrl}/oauth/facebook/callback`

      const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: facebookAppId!,
          client_secret: facebookAppSecret!,
          redirect_uri: redirectUri,
          code: code
        })
      })

      const tokenData = await tokenResponse.json()
      
      if (!tokenData.access_token) {
        console.error('Token exchange failed:', tokenData)
        return new Response(JSON.stringify({ error: 'Failed to exchange code for token' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Get user profile
      const profileResponse = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${tokenData.access_token}&fields=id,name`)
      const profileData = await profileResponse.json()

      // Get Facebook pages (for Instagram business accounts)
      const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}&fields=id,name,instagram_business_account`)
      const pagesData = await pagesResponse.json()

      // Save Facebook account
      const { error: fbError } = await supabase
        .from('connected_accounts')
        .upsert({
          user_id: user.id,
          platform: 'facebook',
          platform_user_id: profileData.id,
          platform_username: profileData.name,
          access_token: tokenData.access_token,
          token_expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          account_data: { pages: pagesData.data },
          is_active: true
        }, {
          onConflict: 'user_id,platform,platform_user_id',
          ignoreDuplicates: false
        })

      if (fbError) {
        console.error('Failed to save Facebook account:', fbError)
        return new Response(JSON.stringify({ error: 'Failed to save account' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Save Instagram accounts if available
      if (pagesData.data) {
        for (const page of pagesData.data) {
          if (page.instagram_business_account) {
            const igResponse = await fetch(`https://graph.facebook.com/v18.0/${page.instagram_business_account.id}?access_token=${tokenData.access_token}&fields=id,username`)
            const igData = await igResponse.json()

            await supabase
              .from('connected_accounts')
              .upsert({
                user_id: user.id,
                platform: 'instagram',
                platform_user_id: igData.id,
                platform_username: igData.username,
                access_token: tokenData.access_token,
                token_expires_at: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
                account_data: { page_id: page.id, page_name: page.name },
                is_active: true
              }, {
                onConflict: 'user_id,platform,platform_user_id',
                ignoreDuplicates: false
              })
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'disconnect') {
      const { platform, accountId } = await req.json()
      
      const { error } = await supabase
        .from('connected_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform)
        .eq('id', accountId)

      if (error) {
        return new Response(JSON.stringify({ error: 'Failed to disconnect account' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('OAuth error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})