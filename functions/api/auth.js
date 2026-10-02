export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Step 1: GitHub sends user here after they click "authorize"
  if (url.pathname.endsWith('/auth') && !url.searchParams.has('code')) {
    const params = new URLSearchParams({
      client_id: env.GITHUB_CLIENT_ID,
      redirect_uri: url.origin + '/api/auth',
      scope: 'repo,user',
    });
    return Response.redirect(
      `https://github.com/login/oauth/authorize?${params}`,
      302
    );
  }

  // Step 2: GitHub redirects back with ?code=...
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return new Response('OAuth failed: ' + JSON.stringify(tokenData), { status: 400 });
  }

  // Send the token back to Decap CMS via postMessage
  const html = `<!DOCTYPE html><html><body><script>
    (function() {
      function receiveMessage(e) {
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}',
          e.origin
        );
      }
      window.addEventListener('message', receiveMessage, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script></body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
