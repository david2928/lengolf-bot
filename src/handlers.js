const { getPackagesByPerson, getPackagesByType } = require('./database');
const { sendMessage } = require('./line');
const { formatPackageMessage, formatDate } = require('./utils');
const { findAvailableSlots } = require('./calendar');

async function handleCheckPackagesByPerson(replyToken, customerName) {
  try {
    const results = await getPackagesByPerson(customerName);
    const message = formatPackageMessage(customerName, results);
    await sendMessage(replyToken, message);
  } catch (error) {
    console.error('Error in handleCheckPackagesByPerson:', error);
    await sendMessage(replyToken, 'Sorry, an error occurred while processing your request.');
  }
}

async function handleCheckPackagesByPackage(replyToken, packageType) {
  try {
    const results = await getPackagesByType(packageType);
    const message = formatPackageMessage(`Package Type: ${packageType}`, results);
    await sendMessage(replyToken, message);
  } catch (error) {
    console.error('Error in handleCheckPackagesByPackage:', error);
    await sendMessage(replyToken, 'Sorry, an error occurred while processing your request.');
  }
}

async function sendAvailabilityMessage(replyToken, date) {
  try {
    const message = await findAvailableSlots(date);
    await sendMessage(replyToken, message);
  } catch (error) {
    console.error('Error in sendAvailabilityMessage:', error);
    await sendMessage(replyToken, 'Sorry, an error occurred while checking availability.');
  }
}

async function promptForDate(replyToken) {
  await sendMessage(replyToken, "Please enter the date in the format YYYY-MM-DD (e.g., 2024-08-30):");
}

async function handleDateInput(replyToken, dateStr) {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      await sendMessage(replyToken, "Invalid date format. Please use YYYY-MM-DD format.");
      return;
    }
    await sendAvailabilityMessage(replyToken, date);
  } catch (error) {
    console.error('Error in handleDateInput:', error);
    await sendMessage(replyToken, 'Sorry, an error occurred while processing the date.');
  }
}

async function sendUnknownCommandMessage(replyToken) {
  await sendMessage(replyToken, 
    "Sorry, I didn't understand that command. Available commands:\n" +
    "- /checkpackages_by_person\n" +
    "- /checkpackages_by_package\n" +
    "- /availability_today\n" +
    "- /availability_tomorrow\n" +
    "- /availability_datepicker"
  );
}

module.exports = {
  handleCheckPackagesByPerson,
  handleCheckPackagesByPackage,
  sendAvailabilityMessage,
  promptForDate,
  handleDateInput,
  sendUnknownCommandMessage
};