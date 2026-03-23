import { supabase } from '../lib/supabase.js';
import { clampString } from '../utils/sanitize.js';
import { escapeHtml } from '../utils/html.js';

import { renderFormPage } from '../views/form.view.js';
import { renderReceivedPage } from '../views/received.view.js';
import { renderMessagesPage } from '../views/messages.view.js';

export async function showForm(req, res) {
  res.type('html').send(renderFormPage());
}

export async function sendMessage(req, res) {
  // 🔺 Här kommer användarens input in i servern
  const nameRaw = clampString(req.body?.name, 50);
  const messageRaw = clampString(req.body?.message, 500);

  if (!nameRaw || !messageRaw) {
    return res.status(400).type('html').send('<p>Fel: saknar namn eller meddelande.</p><p><a href="/">Tillbaka</a></p>');
  }

  const userAgent = clampString(req.get('user-agent'), 200);
  const ip = clampString(req.ip, 60);

  const { error } = await supabase
    .from('request_messages')
    .insert([{ name: nameRaw, message: messageRaw, user_agent: userAgent, ip }]);

  if (error) {
    console.error('[supabase] insert error:', error);
    return res.status(500).type('html').send('<p>Serverfel när vi skulle spara i databasen.</p><p><a href="/">Tillbaka</a></p>');
  }

  // 🧽 Escape innan vi stoppar in i HTML (XSS-säker visning)
  const safeName = escapeHtml(nameRaw);
  const safeMessage = escapeHtml(messageRaw).replaceAll('\n', '<br/>');

  res.type('html').send(
    renderReceivedPage({ name: safeName, message: safeMessage })
  );
}

export async function listMessages(req, res) {
  const { data, error } = await supabase
    .from('request_messages')
    .select('id, created_at, name, message')
    .order('created_at', { ascending: false })
    .limit();

  if (error) {
    console.error('[supabase] select error:', error);
    return res.status(500).type('html').send('<p>Serverfel när vi skulle läsa från databasen.</p><p><a href="/">Tillbaka</a></p>');
  }

  const itemsHtml = (data || []).map((row) => {
    const when = escapeHtml(new Date(row.created_at).toLocaleString('sv-SE'));
    const n = escapeHtml(row.name);
    const m = escapeHtml(row.message).replaceAll('\n', '<br/>');
    return `<li>
      <div><strong>#${row.id}</strong> · ${when}</div>
      <div><strong>${n}</strong></div>
      <div>${m}</div>
    </li>`;
  }).join('');

  res.type('html').send(renderMessagesPage({ itemsHtml }));
}
