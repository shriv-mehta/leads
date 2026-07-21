"use strict";
const bcrypt = require("bcrypt");

const ADMIN_ID = "00000000-0000-4000-8000-000000000001";
const EMPLOYEE_IDS = [
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000004",
];

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const passwordHash = await bcrypt.hash("Prema@2026", 10);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: ADMIN_ID,
          name: "Jonathan Jeyathas",
          email: "j.jeyathas@prema.ca",
          passwordHash,
          phone: "9000000001",
          role: "admin",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: EMPLOYEE_IDS[0],
          name: "Shivam Mehta",
          email: "shivam.mehta@prema.ca",
          passwordHash,
          phone: "9000000002",
          role: "employee",
          isActive: true,
          createdAt: now,
          updatedAt: now,
        }
      ],
      { ignoreDuplicates: true }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", { id: [ADMIN_ID, ...EMPLOYEE_IDS] });
  },
};

module.exports.ADMIN_ID = ADMIN_ID;
module.exports.EMPLOYEE_IDS = EMPLOYEE_IDS;
