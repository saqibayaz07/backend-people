const { Sequelize } = require('sequelize');
require('dotenv').config();


const db_name = process.env.DATABASE_NAME
const db_port = process.env.DATABASE_PORT
const db_username = process.env.DATABASE_USERNAME
const db_host = process.env.DATABASE_HOST
const db_password = process.env.DATABASE_PASSWORD

const database = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    port: db_port,
    dialect: 'postgres',
})

module.exports = database