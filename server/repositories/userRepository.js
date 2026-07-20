const User = require("../models/User");

const findByEmail = (email) => User.findOne({ where: { email } });

const findById = (id) => User.findByPk(id);

const create = (data) => User.create(data);

const update = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  return user.update(data);
};

const list = ({ limit, offset }) =>
  User.findAndCountAll({
    limit,
    offset,
    order: [["createdAt", "ASC"]],
  });

module.exports = { findByEmail, findById, create, update, list };
