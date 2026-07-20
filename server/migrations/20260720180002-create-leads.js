"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("leads", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      contactName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metOn: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      conversationNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      businessChance: {
        type: Sequelize.ENUM("hot", "warm", "cold"),
        allowNull: false,
        defaultValue: "warm",
      },
      status: {
        type: Sequelize.ENUM("new", "in_progress", "converted", "lost"),
        allowNull: false,
        defaultValue: "new",
      },
      area: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      areaLat: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: true,
      },
      areaLng: {
        type: Sequelize.DECIMAL(9, 6),
        allowNull: true,
      },
      nextFollowupOn: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      convertedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("leads", ["ownerId"]);
    await queryInterface.addIndex("leads", ["status"]);
    await queryInterface.addIndex("leads", ["createdAt"]);
    // Expression index — area has no separate normalized column, so
    // grouping/filtering matches on lower(trim(area)) directly.
    await queryInterface.sequelize.query(
      'CREATE INDEX "leads_area_normalized_idx" ON "leads" (LOWER(TRIM("area")));'
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("leads");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_businessChance";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_leads_status";');
  },
};
