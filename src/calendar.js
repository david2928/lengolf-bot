const { google } = require('googleapis');
const config = require('./config');
const path = require('path');

// Create a mock calendar client for testing
class MockCalendarClient {
  async getEvents(calendarId, timeMin, timeMax) {
    // Return mock events for testing
    return {
      data: {
        items: [
          {
            start: { dateTime: `${timeMin.toISOString().split('T')[0]}T12:00:00+08:00` },
            end: { dateTime: `${timeMin.toISOString().split('T')[0]}T14:00:00+08:00` }
          },
          {
            start: { dateTime: `${timeMin.toISOString().split('T')[0]}T16:00:00+08:00` },
            end: { dateTime: `${timeMin.toISOString().split('T')[0]}T18:00:00+08:00` }
          }
        ]
      }
    };
  }
}

// Initialize Google Calendar API with service account
function getCalendarClient() {
  if (process.env.NODE_ENV === 'test') {
    return new MockCalendarClient();
  }

  try {
    // Resolve the credentials path relative to project root
    const credentialsPath = path.resolve(__dirname, '..', process.env.GOOGLE_APPLICATION_CREDENTIALS);
    console.log('Loading credentials from:', credentialsPath);
    
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    return google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Calendar client:', error);
    // Fall back to mock client if authentication fails
    console.log('Falling back to mock calendar client');
    return new MockCalendarClient();
  }
}

const calendar = getCalendarClient();

async function findAvailableSlots(date) {
  const startTime = new Date(date);
  startTime.setHours(10, 0, 0); // 10 AM
  const endTime = new Date(date);
  endTime.setHours(22, 0, 0); // 10 PM

  const availableSlots = {};
  let message = `🏌️‍♂️ *Available Golf Bays on ${startTime.toISOString().split('T')[0]}* 🏌️‍♀️\n\n`;

  try {
    for (const [bayName, calendarId] of Object.entries(config.calendars)) {
      const events = await calendar.events.list({
        calendarId,
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      const slots = findAvailableSlotsInBay(events.data.items, startTime, endTime);
      if (slots.length > 0) {
        message += `${bayName}:\n`;
        slots.forEach(slot => {
          message += ` - ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}\n`;
        });
        message += '\n';
      }
    }

    if (message === `🏌️‍♂️ *Available Golf Bays on ${startTime.toISOString().split('T')[0]}* 🏌️‍♀️\n\n`) {
      message = `No available slots found for ${startTime.toISOString().split('T')[0]} between 10 AM and 10 PM.`;
    }
  } catch (error) {
    console.error('Error in findAvailableSlots:', error);
    if (process.env.NODE_ENV === 'development') {
      message = `Error: ${error.message}\n\nMock data will be used instead.\n\n`;
      // Use mock data as fallback
      const mockClient = new MockCalendarClient();
      const mockEvents = await mockClient.getEvents(null, startTime, endTime);
      const slots = findAvailableSlotsInBay(mockEvents.data.items, startTime, endTime);
      message += formatSlotsToMessage(slots, startTime);
    } else {
      message = 'Sorry, an error occurred while checking availability.';
    }
  }

  return message;
}

function formatSlotsToMessage(slots, date) {
  let message = `Available slots on ${date.toISOString().split('T')[0]}:\n`;
  slots.forEach(slot => {
    message += `- ${formatTime(slot.startTime)} to ${formatTime(slot.endTime)}\n`;
  });
  return message;
}

function findAvailableSlotsInBay(events, startTime, endTime) {
  const availableSlots = [];
  let previousEndTime = new Date(startTime);

  events.forEach(event => {
    const eventStartTime = new Date(event.start.dateTime);
    
    if (eventStartTime.getTime() - previousEndTime.getTime() >= 60 * 60 * 1000) {
      availableSlots.push({
        startTime: previousEndTime,
        endTime: eventStartTime
      });
    }
    previousEndTime = new Date(event.end.dateTime);
  });

  if (endTime.getTime() - previousEndTime.getTime() >= 60 * 60 * 1000) {
    availableSlots.push({
      startTime: previousEndTime,
      endTime: endTime
    });
  }

  return availableSlots;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

module.exports = {
  findAvailableSlots
};