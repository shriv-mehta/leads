const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const User = require("./User");
const Lead = require("./Lead");

const LeadActivity = sequelize.define(
  "LeadActivity",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    leadId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Lead, key: "id" },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activityDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lead_activities",
    timestamps: true,
    updatedAt: false,
  }
);

LeadActivity.belongsTo(Lead, { foreignKey: "leadId", as: "lead" });
Lead.hasMany(LeadActivity, { foreignKey: "leadId", as: "activities" });

LeadActivity.belongsTo(User, { foreignKey: "userId", as: "author" });
User.hasMany(LeadActivity, { foreignKey: "userId", as: "leadActivities" });

module.exports = LeadActivity;
