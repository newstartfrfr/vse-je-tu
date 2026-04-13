(function () {
  const url = window.VSETU_SUPABASE_URL || "";
  const anonKey = window.VSETU_SUPABASE_ANON_KEY || "";
  const siteUrl = window.VSETU_SITE_URL || window.location.origin;

  function hasSupabase() {
    return Boolean(window.supabase && url && anonKey);
  }

  function getClient() {
    if (!hasSupabase()) return null;
    const { createClient } = window.supabase;
    return createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }

  async function saveInquiry(payload) {
    const client = getClient();
    if (!client) {
      throw new Error("Supabase config is missing.");
    }

    const { error } = await client.from("inquiries").insert(payload);
    if (error) throw error;
    return true;
  }

  async function saveNewsletter(payload) {
    const client = getClient();
    if (!client) {
      throw new Error("Supabase config is missing.");
    }

    const { error } = await client.from("newsletter_signups").insert(payload);
    if (error) throw error;
    return true;
  }

  window.VSETU_DB = {
    siteUrl,
    hasSupabase,
    getClient,
    saveInquiry,
    saveNewsletter
  };
})();