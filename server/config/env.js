require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 3001,

  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },

  geocoding: {
    serverKey: process.env.GOOGLE_MAPS_SERVER_KEY,
    regionBias: process.env.GEOCODE_REGION_BIAS || "CA",
  },

  teamTimezone: process.env.TEAM_TIMEZONE || "America/Edmonton",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:8080",
};

module.exports = env;
