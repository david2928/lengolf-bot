const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function sendMessage(text) {
  try {
    const webhookEvent = {
      events: [{
        type: 'message',
        replyToken: 'test-reply-token',
        source: {
          userId: 'test-user-id',
          type: 'user'
        },
        message: {
          type: 'text',
          text: text,
          id: 'test-message-id'
        },
        timestamp: Date.now()
      }]
    };

    const response = await axios.post('http://localhost:3000/webhook', webhookEvent);
    console.log('\nServer response status:', response.status);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

async function chat() {
  console.log('Chat with the LINE bot server');
  console.log('Available commands:');
  console.log('  /checkpackages_by_person');
  console.log('  /checkpackages_by_package');
  console.log('  /availability_today');
  console.log('  /availability_tomorrow');
  console.log('  /availability_datepicker');
  console.log('Type "exit" to quit\n');

  const askQuestion = () => {
    rl.question('Enter your message: ', async (answer) => {
      if (answer.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      await sendMessage(answer);
      askQuestion();
    });
  };

  askQuestion();
}

chat();