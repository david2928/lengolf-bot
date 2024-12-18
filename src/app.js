const express = require('express');
const fs = require('fs');
const path = require('path');
const { 
  handleCheckPackagesByPerson, 
  handleCheckPackagesByPackage,
  handleDateInput,
  promptForDate,
  sendAvailabilityMessage,
  sendUnknownCommandMessage
} = require('./handlers');
const { sendMessage } = require('./line');

const app = express();
app.use(express.json());

// Store session state in memory (for testing purposes)
const sessionState = new Map();

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/webhook', async (req, res) => {
  try {
    const event = req.body.events[0];
    const { replyToken, message: { text }, source: { userId } } = event;
    const userMessage = text.toLowerCase();

    // Get session state for this user
    const userState = sessionState.get(userId) || {};

    switch (true) {
      case userMessage === '/checkpackages_by_person':
        await sendMessage(replyToken, "Please enter the customer's name to check packages:");
        sessionState.set(userId, { ...userState, awaitingCustomerName: true });
        break;

      case userMessage.startsWith('/checkpackages_by_person ') || userState.awaitingCustomerName:
        sessionState.set(userId, { ...userState, awaitingCustomerName: false });
        const customerName = userMessage.replace('/checkpackages_by_person ', '').trim();
        await handleCheckPackagesByPerson(replyToken, customerName);
        break;

      case userMessage === '/checkpackages_by_package':
        await sendMessage(replyToken, "Please enter the package type to check all packages:");
        sessionState.set(userId, { ...userState, awaitingPackageType: true });
        break;

      case userMessage.startsWith('/checkpackages_by_package ') || userState.awaitingPackageType:
        sessionState.set(userId, { ...userState, awaitingPackageType: false });
        const packageType = userMessage.replace('/checkpackages_by_package ', '').trim();
        await handleCheckPackagesByPackage(replyToken, packageType);
        break;

      case userMessage === '/availability_today':
        await sendAvailabilityMessage(replyToken, new Date());
        break;

      case userMessage === '/availability_tomorrow':
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        await sendAvailabilityMessage(replyToken, tomorrow);
        break;

      case userMessage === '/availability_datepicker':
        await promptForDate(replyToken);
        sessionState.set(userId, { ...userState, awaitingDate: true });
        break;

      case userState.awaitingDate:
        sessionState.set(userId, { ...userState, awaitingDate: false });
        await handleDateInput(replyToken, userMessage.trim());
        break;

      default:
        await sendUnknownCommandMessage(replyToken);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

// Use PORT environment variable for Cloud Run
const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});