require('dotenv').config();

const config = {
  line: {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  calendars: {
    "Bay 1 (Bar)": process.env.CALENDAR_BAY1,
    "Bay 2": process.env.CALENDAR_BAY2,
    "Bay 3 (Entrance)": process.env.CALENDAR_BAY3
  }
};

module.exports = config;