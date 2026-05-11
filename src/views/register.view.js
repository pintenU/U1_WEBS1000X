export function renderRegisterPage({ error } = {}) {
  return `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Registrera</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; max-width: 720px; margin: 0 auto; }
    form { display: grid; gap: 12px; padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
    label { display: grid; gap: 6px; }
    input { font: inherit; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { font: inherit; padding: 10px 14px; border: 0; border-radius: 10px; cursor: pointer; background: #111; color: #fff; }
    .error { color: red; }
  </style>
</head>
<body>
  <h1>Registrera konto</h1>
  ${error ? `<p class="error">${error}</p>` : ''}
  <form method="POST" action="/register">
    <label>
      Användarnamn
      <input name="username" maxlength="50" required />
    </label>
    <label>
      Lösenord
      <input name="password" type="password" required />
    </label>
    <button type="submit">Registrera</button>
  </form>
  <p><a href="/login">Har du redan ett konto? Logga in</a></p>
</body>
</html>`;
}