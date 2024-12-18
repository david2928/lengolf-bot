function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatPackageMessage(customerName, results) {
  if (results.length === 0) {
    return `No matching customer found for '${customerName}'.`;
  }

  let message = `📦 *Package Details for ${customerName}* 📦\n\n`;
  results.forEach(result => {
    message += `Customer Name: ${result.customer_name}\n`;
    message += `Package Name: ${result.package}\n`;
    message += `Purchase Date: ${formatDate(new Date(result.purchase_date))}\n`;
    message += `Expiry Date: ${formatDate(new Date(result.expiry_date))} (${result.days_until_expiry} days left)\n`;
    if (!result.package.includes('Diamond')) {
      message += `Remaining Hours: ${result.available_hours}\n`;
    }
    message += `\n`;
  });

  return message;
}

module.exports = {
  formatDate,
  formatPackageMessage
};