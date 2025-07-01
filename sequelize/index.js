const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "peopledb",
  "bryxodbs",
  "G$&zk/2DQU5\\S8bRyx0!PV",
  {
    host: "94.72.104.83",
    dialect: "postgres",
    port: 5441,
  }
);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { connectToDatabase };

