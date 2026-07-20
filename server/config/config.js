require("dotenv").config();

// Single environment — sequelize-cli always resolves to this "development"
// key since NODE_ENV is never set.
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: "postgres",
  },
};
