const { spawn } = require('child_process');
const path = require('path');

// Start the server in test mode
const server = spawn('node', ['src/app.js'], {
  env: { ...process.env, NODE_ENV: 'test' },
  stdio: 'inherit'
});

// Give the server time to start up
setTimeout(() => {
  // Run the tests
  const test = spawn('node', ['tests/manual-test.js'], {
    env: { ...process.env, NODE_ENV: 'test' },
    stdio: 'inherit'
  });

  test.on('exit', (code) => {
    // Kill the server when tests are done
    server.kill();
    process.exit(code);
  });
}, 3000); // Wait 3 seconds for server to start

// Handle cleanup on process termination
process.on('SIGTERM', () => {
  server.kill();
  process.exit();
});

process.on('SIGINT', () => {
  server.kill();
  process.exit();
});