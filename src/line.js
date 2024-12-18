const line = require('@line/bot-sdk');
const config = require('./config');

const client = new line.Client({
  channelAccessToken: config.line.channelAccessToken
});

// Create a global singleton for test messages
global.__testMessages = global.__testMessages || [];

async function sendMessage(replyToken, message) {
  // If it's a test token, store the message and notify waiters
  if (replyToken === 'test-reply-token') {
    console.log('Test mode - Message:', message);
    console.log('Before push - testMessages length:', global.__testMessages.length);
    global.__testMessages.push(message);
    console.log('After push - testMessages length:', global.__testMessages.length);
    console.log('Current testMessages:', JSON.stringify(global.__testMessages));
    // Return after ensuring the message is stored
    return Promise.resolve(message);
  }

  return client.replyMessage(replyToken, {
    type: 'text',
    text: message
  });
}

function getTestMessages() {
  console.log('Getting test messages - current length:', global.__testMessages.length);
  console.log('Current messages:', JSON.stringify(global.__testMessages));
  return [...global.__testMessages];
}

function clearTestMessages() {
  console.log('Clearing test messages - previous length:', global.__testMessages.length);
  global.__testMessages = [];
  console.log('After clear - new length:', global.__testMessages.length);
}

// Export the module
module.exports = {
  sendMessage,
  getTestMessages,
  clearTestMessages
};