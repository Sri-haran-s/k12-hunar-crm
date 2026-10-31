require('dotenv').config();

const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const SALT_ROUNDS = 12;

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      '[createAdmin] Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file.'
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('[createAdmin] Error: ADMIN_PASSWORD must be at least 8 characters long.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : undefined,
  });

  try {
    // Check if admin with this email already exists
    const existing = await pool.query('SELECT id FROM admins WHERE email = $1 LIMIT 1', [email]);

    if (existing.rows.length > 0) {
      console.log(`[createAdmin] Admin with email "${email}" already exists. No action taken.`);
      process.exit(0);
    }

    // Hash the password
    console.log('[createAdmin] Hashing password...');
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new admin
    const result = await pool.query(
      `INSERT INTO admins (email, password_hash, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING id, email`,
      [email, passwordHash]
    );

    const newAdmin = result.rows[0];
    console.log(
      `[createAdmin] ✅ Admin created successfully!\n  ID: ${newAdmin.id}\n  Email: ${newAdmin.email}`
    );
    process.exit(0);
  } catch (err) {
    console.error('[createAdmin] Error creating admin:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createAdmin();
