const pg = require("pg");

module.exports = {
  development: {
    username: "bryxodbs",
    password: "G$&zk/2DQU5\\S8bRyx0!PV",
    database: "peopledb",
    host: "94.72.104.83",
    dialect: "postgres",
    dialectModule: pg,
    port: 5441,
  },
  test: {
    username: "bryxodbs",
    password: "G$&zk/2DQU5\\S8bRyx0!PV",
    database: "peopledb",
    host: "94.72.104.83",
    dialect: "postgres",
    dialectModule: pg,
    port: 5441,
  },
  production: {
    username: "bryxodbs",
    password: "G$&zk/2DQU5\\S8bRyx0!PV",
    database: "peopledb",
    host: "94.72.104.83",
    dialect: "postgres",
    dialectModule: pg,
    port: 5441,
  },
};