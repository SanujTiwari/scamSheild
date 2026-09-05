require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

pool.query("SELECT 1")
  .then(() => {
    console.log("Database Connected");

    // Initialize tables
    const initDb = async () => {
      try {
        // Users role column
        await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user'`);

        // Legacy jobs table backwards compatibility
        await pool.query(`ALTER TABLE jobs ADD COLUMN IF NOT EXISTS ai_explanation TEXT`);

        // Resume matches table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS resume_matches (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            job_title VARCHAR(255) NOT NULL,
            company_name VARCHAR(255) NOT NULL,
            compatibility_score INTEGER NOT NULL,
            match_summary TEXT NOT NULL,
            missing_skills TEXT NOT NULL,
            improvement_tips TEXT NOT NULL,
            learning_path TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Scans V2 table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS scans (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            scan_type VARCHAR(50) NOT NULL,
            input_data JSONB NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level VARCHAR(50) NOT NULL,
            ai_explanation TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Risk factors breakdown table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS risk_factors (
            id SERIAL PRIMARY KEY,
            scan_id INTEGER REFERENCES scans(id) ON DELETE CASCADE,
            category VARCHAR(100) NOT NULL,
            reason TEXT NOT NULL,
            score INTEGER NOT NULL,
            severity VARCHAR(20) NOT NULL
          )
        `);

        // Widen reason column if it was previously VARCHAR(255)
        await pool.query(`ALTER TABLE risk_factors ALTER COLUMN reason TYPE TEXT`);

        // Companies verification lookup
        await pool.query(`
          CREATE TABLE IF NOT EXISTS companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            website VARCHAR(255),
            verification_status VARCHAR(50) DEFAULT 'Unverified',
            risk_score INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Domain intelligence cache (for external API results — 24h TTL)
        await pool.query(`
          CREATE TABLE IF NOT EXISTS domain_intel_cache (
            id SERIAL PRIMARY KEY,
            domain VARCHAR(255) UNIQUE NOT NULL,
            safe_browsing_result JSONB,
            virustotal_result JSONB,
            whois_result JSONB,
            cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Reports table
        await pool.query(`
          CREATE TABLE IF NOT EXISTS reports (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            scan_id INTEGER REFERENCES scans(id) ON DELETE SET NULL,
            scam_type VARCHAR(50) NOT NULL,
            company_name VARCHAR(255),
            recruiter_info VARCHAR(255),
            description TEXT NOT NULL,
            evidence TEXT,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        console.log("ScamShield database tables verified/created successfully.");
      } catch (err) {
        console.error("Database initialization error:", err);
      }
    };

    initDb();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Failed:", err);
  });