require('dotenv').config();

async function main() {
    const ensureDatabase = require('./init-db');

    // Step 1: Auto-create database if POSTGRES_HOST is set
    if (!process.env.DATABASE_URL && process.env.POSTGRES_HOST) {
        await ensureDatabase();
    }

    // Step 2: Run migrations if we have a DATABASE_URL (either set directly or by init-db)
    if (process.env.DATABASE_URL) {
        await new Promise((resolve) => {
            const { exec } = require('child_process');
            console.log('🔄 Running database migrations...');

            const migrationProcess = exec('npm run migrate:up', (error, stdout, stderr) => {
                if (error) {
                    console.warn('⚠️  Migration warning:', stderr || error.message);
                    console.warn('   Proceeding to start server anyway.');
                } else {
                    console.log('✅ Database migrations applied.');
                    if (stdout) console.log(stdout);
                }
                resolve();
            });

            migrationProcess.stdout.pipe(process.stdout);
            migrationProcess.stderr.pipe(process.stderr);
        });
    } else {
        console.log('ℹ️  No database configured — starting in static-only mode.');
    }

    // Step 3: Start the server
    console.log('🚀 Starting Server...');
    require('../server.js');
}

main().catch((err) => {
    console.error('❌ Startup error:', err.message);
    console.log('🚀 Starting Server anyway...');
    require('../server.js');
});
