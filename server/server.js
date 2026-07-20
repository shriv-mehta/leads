const app = require("./app");
const env = require("./config/env");
const sequelize = require("./database/database");

const start = async () => {
  await sequelize.authenticate();
  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
