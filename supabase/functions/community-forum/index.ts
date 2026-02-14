import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    switch (action) {
      case 'create_post':
        return await handleCreatePost(supabaseClient, data)
      case 'get_posts':
        return await handleGetPosts(supabaseClient, data)
      case 'create_comment':
        return await handleCreateComment(supabaseClient, data)
      case 'get_comments':
        return await handleGetComments(supabaseClient, data)
      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

async function handleCreatePost(supabaseClient: any, data: any) {
  const { title, content, user_id, category } = data
  
  const { data: post, error } = await supabaseClient
    .from('community_posts')
    .insert({
      title,
      content,
      user_id,
      category,
      created_at: new Date().toISOString(),
      likes: 0,
      views: 0
    })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify(post),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function handleGetPosts(supabaseClient: any, data: any) {
  const { category, limit = 10, offset = 0 } = data
  
  let query = supabaseClient
    .from('community_posts')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      ),
      comments:community_comments (
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          username,
          avatar_url
        )
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data: posts, error } = await query

  if (error) throw error

  return new Response(
    JSON.stringify(posts),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function handleCreateComment(supabaseClient: any, data: any) {
  const { post_id, content, user_id } = data
  
  const { data: comment, error } = await supabaseClient
    .from('community_comments')
    .insert({
      post_id,
      content,
      user_id,
      created_at: new Date().toISOString(),
      likes: 0
    })
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify(comment),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}

async function handleGetComments(supabaseClient: any, data: any) {
  const { post_id, limit = 20, offset = 0 } = data
  
  const { data: comments, error } = await supabaseClient
    .from('community_comments')
    .select(`
      *,
      profiles:user_id (
        username,
        avatar_url
      )
    `)
    .eq('post_id', post_id)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return new Response(
    JSON.stringify(comments),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
} 