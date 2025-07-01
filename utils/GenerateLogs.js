const axios = require("axios");

const sendLog = async (logEntry) => {
  try {
    const response = await axios.post(
      // "https://api.bryxo.one/logs/v1/console/add-logs",
      // "https://j0wogccsoow00gsgsg0o4oo8.bryxo.app/logs/v1/console/add-logs",
      logEntry
    );
    console.log("Log added successfully:", response.data);
    return response.data; // Resolves with the response data if successful
  } catch (error) {
    console.error("Error adding log:", error.message);
    throw error; // Rejects the promise with the error
  }
};

module.exports = { sendLog };
