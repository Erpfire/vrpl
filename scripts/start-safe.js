const { exec } = require('child_process');

console.log('🔄 Application Startup: Checking for database migrations...');

// Run migrations
const migrationProcess = exec('npm run migrate:up', (error, stdout, stderr) => {
    if (error) {
        console.error('⚠️  Migration Warning: Database migration failed or timed out.');
        console.error('   This might be due to connection issues or config errors.');
        console.error('   Proceeding to start server anyway to ensure uptime.');
        console.error('   Error details:', stderr || error.message);
    } else {
        console.log('✅ Database migrations applied successfully.');
        if (stdout) console.log(stdout);
    }

    // Always start the server, regardless of migration success/failure
    console.log('🚀 Starting Server...');
    require('../server.js');
});

// Pipe migration output to console for visibility
migrationProcess.stdout.pipe(process.stdout);
migrationProcess.stderr.pipe(process.stderr);
