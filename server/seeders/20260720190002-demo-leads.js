"use strict";
const { EMPLOYEE_IDS } = require("./20260720190001-demo-users");

const AREAS = [
  { area: "Andheri East, Mumbai", lat: 19.1136, lng: 72.8697 },
  { area: "Bandra West, Mumbai", lat: 19.0596, lng: 72.8295 },
  { area: "Powai, Mumbai", lat: 19.1176, lng: 72.906 },
  { area: "Lower Parel, Mumbai", lat: 18.9967, lng: 72.8302 },
  { area: "Thane West, Mumbai", lat: 19.2183, lng: 72.9781 },
  { area: "Vashi, Navi Mumbai", lat: 19.0771, lng: 72.9986 },
  { area: "Malad West, Mumbai", lat: 19.1864, lng: 72.8493 },
  { area: "Chembur, Mumbai", lat: 19.0522, lng: 72.9005 },
];

const COMPANIES = [
  "Sunrise Textiles",
  "Bluewave Logistics",
  "Nimbus Retail",
  "Anchor Steel Co",
  "Greenfield Foods",
  "Orbit Electronics",
  "Harborline Shipping",
  "Crestline Realty",
  "Vertex Pharma",
  "Silverline Motors",
];

const CONTACT_NAMES = [
  "Rahul Sharma",
  "Neha Joshi",
  "Amit Verma",
  "Sneha Kulkarni",
  "Vikram Singh",
  "Pooja Iyer",
  "Arjun Reddy",
  "Divya Menon",
  "Rohan Kapoor",
  "Ananya Das",
];

const DESIGNATIONS = ["Procurement Manager", "Operations Head", "Founder", "Sales Director", "Owner"];
const CHANCES = ["hot", "warm", "cold"];
const STATUSES = ["new", "in_progress", "converted", "lost"];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const toDateOnly = (date) => date.toISOString().slice(0, 10);

const LEAD_COUNT = 50;

const buildLeads = () => {
  const leads = [];

  for (let i = 0; i < LEAD_COUNT; i += 1) {
    const id = `00000000-0000-4000-9000-${String(i + 1).padStart(12, "0")}`;
    const owner = EMPLOYEE_IDS[i % EMPLOYEE_IDS.length];
    const areaInfo = AREAS[i % AREAS.length];
    const status = STATUSES[i % STATUSES.length];
    const createdAt = daysAgo(180 - i * 3);
    const metOn = toDateOnly(createdAt);
    const convertedAt = status === "converted" ? daysAgo(180 - i * 3 - 5) : null;
    const nextFollowupOn = i % 4 === 0 ? toDateOnly(daysFromNow(i % 2 === 0 ? -3 : 5)) : null;

    leads.push({
      id,
      ownerId: owner,
      contactName: CONTACT_NAMES[i % CONTACT_NAMES.length],
      companyName: COMPANIES[i % COMPANIES.length],
      designation: DESIGNATIONS[i % DESIGNATIONS.length],
      email: `contact${i + 1}@example.com`,
      phone: `98${String(10000000 + i).padStart(8, "0")}`,
      metOn,
      conversationNotes: "Discussed requirements and next steps during the visit.",
      businessChance: CHANCES[i % CHANCES.length],
      status,
      area: areaInfo.area,
      areaLat: areaInfo.lat,
      areaLng: areaInfo.lng,
      nextFollowupOn,
      convertedAt,
      deletedAt: null,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return leads;
};

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("leads", buildLeads(), { ignoreDuplicates: true });
  },

  down: async (queryInterface) => {
    const ids = buildLeads().map((lead) => lead.id);
    await queryInterface.bulkDelete("leads", { id: ids });
  },
};
