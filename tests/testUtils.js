const axios = require('axios');
const fs = require('fs');
const path = require('path');

class LineWebhookSimulator {
  constructor(port = 3000) {
    this.port = port;
    this.webhookUrl = `http://localhost:${this.port}/webhook`;
  }

  async waitForServer(maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await axios.get(`http://localhost:${this.port}`);
        return true;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        // If we get any other error (like 404), the server is running
        return true;
      }
    }
    throw new Error(`Server not responding after ${maxAttempts} attempts`);
  }

  async simulateMessage(text, replyToken = 'test-reply-token') {
    await this.waitForServer();
    
    const webhookEvent = {
      events: [{
        type: 'message',
        replyToken: replyToken,
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

    try {
      console.log(`Sending webhook to ${this.webhookUrl}`);
      const response = await axios.post(this.webhookUrl, webhookEvent);
      // Increase delay after sending to ensure processing
      await new Promise(resolve => setTimeout(resolve, 500));
      return response;
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', {
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  }
}

module.exports = {
  LineWebhookSimulator
};