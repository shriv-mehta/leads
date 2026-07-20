const { DataTypes } = require("sequelize");
const sequelize = require("../database/database");
const User = require("./User");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    contactName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metOn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    conversationNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    businessChance: {
      type: DataTypes.ENUM("hot", "warm", "cold"),
      allowNull: false,
      defaultValue: "warm",
    },
    status: {
      type: DataTypes.ENUM("new", "in_progress", "converted", "lost"),
      allowNull: false,
      defaultValue: "new",
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaLat: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    areaLng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: true,
    },
    nextFollowupOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    convertedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

Lead.belongsTo(User, { foreignKey: "ownerId", as: "owner" });
User.hasMany(Lead, { foreignKey: "ownerId", as: "leads" });

module.exports = Lead;
