export function renderEditPage({ id, name, message }) {
  return `<!doctype html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Redigera meddelande #${id}</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; max-width: 720px; margin: 0 auto; }
    form { display: grid; gap: 12px; padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
    label { display: grid; gap: 6px; }
    input, textarea { font: inherit; padding: 10px; border: 1px solid #ccc; border-radius: 10px; }
    button { font: inherit; padding: 10px 14px; border: 0; border-radius: 10px; cursor: pointer; background: #111; color: #fff; }
    a { display: inline-block; margin-top: 12px; }
  </style>
</head>
<body>
  <h1>✏️ Redigera meddelande #${id}</h1>

  <form method="POST" action="/edit/${id}">
    <label>
      Namn
      <input name="name" maxlength="50" value="${name}" required />
    </label>

    <label>
      Meddelande
      <textarea name="message" rows="4" maxlength="500" required>${message}</textarea>
    </label>

    <button type="submit">Spara ändringar</button>
  </form>

  <a href="/messages">← Tillbaka till listan</a>
</body>
</html>`;
}