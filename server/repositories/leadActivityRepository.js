const LeadActivity = require("../models/LeadActivity");
const User = require("../models/User");

const create = (data) => LeadActivity.create(data);

const listForLead = (leadId) =>
  LeadActivity.findAll({
    where: { leadId },
    include: [{ model: User, as: "author", attributes: ["id", "name"] }],
    order: [["activityDate", "DESC"]],
  });

module.exports = { create, listForLead };
