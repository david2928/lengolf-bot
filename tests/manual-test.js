const { LineWebhookSimulator } = require('./testUtils');
const { getTestMessages, clearTestMessages } = require('../src/line');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForResponse(startCount, maxWait = 5000) {
  const startTime = Date.now();
  const checkInterval = 200; // Check every 200ms
  
  console.log(`Starting to wait for response - startCount: ${startCount}`);
  
  while (Date.now() - startTime < maxWait) {
    const messages = getTestMessages();
    console.log(`Checking messages - current length: ${messages.length}, startCount: ${startCount}`);
    
    if (messages.length > startCount) {
      console.log('Found new message!');
      // Add a small delay to ensure message is fully processed
      await sleep(100);
      return messages[messages.length - 1];
    }
    await sleep(checkInterval);
  }
  
  // If no response, log current state
  const messages = getTestMessages();
  console.log('Timeout reached. Current state:');
  console.log('Current messages:', messages);
  console.log('Start count:', startCount);
  return null;
}

async function runTest(testName, message, simulator) {
  console.log(`\n${testName}:`);
  console.log('Sending message:', message);
  
  // Clear messages before each test
  console.log('Clearing messages before test');
  clearTestMessages();
  await sleep(100); // Ensure clear takes effect
  
  // Send the message
  console.log('Simulating message');
  await simulator.simulateMessage(message);
  
  // Wait for new message with increased timeout
  console.log('Waiting for response');
  const response = await waitForResponse(0, 10000);
  
  if (response) {
    console.log('Bot response:', response);
  } else {
    console.error('❌ No response received within timeout');
    console.log('Current messages:', getTestMessages());
  }
  
  console.log(`${response ? '✓' : '❌'} ${testName} completed`);
  await sleep(1000); // Wait between tests
}

async function runTests() {
  const simulator = new LineWebhookSimulator(3000);
  console.log(`Starting manual tests with server on port 3000...\n`);

  try {
    // Clear messages at the start
    console.log('Initial message clear');
    clearTestMessages();
    await sleep(1000); // Wait for clear to take effect

    const tests = [
      ['Test 1: /checkpackages_by_person (no parameter)', '/checkpackages_by_person'],
      ['Test 2: /checkpackages_by_person with name', '/checkpackages_by_person Emmy'],
      ['Test 3: /checkpackages_by_package (no parameter)', '/checkpackages_by_package'],
      ['Test 4: /checkpackages_by_package with type', '/checkpackages_by_package Diamond'],
      ['Test 5: /availability_today', '/availability_today'],
      ['Test 6: /availability_tomorrow', '/availability_tomorrow'],
      ['Test 7: /availability_datepicker', '/availability_datepicker'],
      ['Test 8: Date input after datepicker', '2024-12-25'],
      ['Test 9: Unknown command', '/unknown_command']
    ];

    for (const [name, message] of tests) {
      await runTest(name, message, simulator);
    }

    console.log('\nAll tests completed successfully!');

  } catch (error) {
    console.error('Error during tests:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  runTests();
}