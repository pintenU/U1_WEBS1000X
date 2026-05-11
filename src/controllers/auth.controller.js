import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../lib/supabase.js';
import { clampString } from '../utils/sanitize.js';
import { renderRegisterPage } from '../views/register.view.js';
import { renderLoginPage } from '../views/login.view.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('[env] Missing JWT_SECRET in .env');
  process.exit(1);
}

export async function showRegister(req, res) {
  res.type('html').send(renderRegisterPage());
}

export async function register(req, res) {
  const username = clampString(req.body?.username, 50);
  const password = clampString(req.body?.password, 200);

  if (!username || !password) {
    return res.status(400).type('html').send(renderRegisterPage({ error: 'Fyll i både användarnamn och lösenord.' }));
  }

  // Kolla om användarnamnet redan finns
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();

  if (existing) {
    return res.status(400).type('html').send(renderRegisterPage({ error: 'Användarnamnet är redan taget.' }));
  }

  const password_hash = await bcrypt.hash(password, 12);

  const { error } = await supabase
    .from('users')
    .insert([{ username, password_hash }]);

  if (error) {
    console.error('[supabase] insert user error:', error);
    return res.status(500).type('html').send(renderRegisterPage({ error: 'Serverfel, försök igen.' }));
  }

  res.redirect('/login');
}

export async function showLogin(req, res) {
  res.type('html').send(renderLoginPage());
}

export async function login(req, res) {
  const username = clampString(req.body?.username, 50);
  const password = clampString(req.body?.password, 200);

  if (!username || !password) {
    return res.status(400).type('html').send(renderLoginPage({ error: 'Fyll i både användarnamn och lösenord.' }));
  }

  const { data: user } = await supabase
    .from('users')
    .select('id, username, password_hash')
    .eq('username', username)
    .single();

  if (!user) {
    return res.status(401).type('html').send(renderLoginPage({ error: 'Fel användarnamn eller lösenord.' }));
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).type('html').send(renderLoginPage({ error: 'Fel användarnamn eller lösenord.' }));
  }

  const token = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000
  });

  res.redirect('/messages');
}

export async function logout(req, res) {
  res.clearCookie('token');
  res.redirect('/login');
}