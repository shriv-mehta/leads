const { DateTime } = require("luxon");
const env = require("../config/env");

// MTD/YTD boundaries computed in the team's local timezone, then
// converted to UTC so date-range queries line up with what the
// team actually considers "this month" / "this year".
const getMtdRange = (zone = env.teamTimezone) => {
  const now = DateTime.now().setZone(zone);
  return {
    from: now.startOf("month").toUTC().toJSDate(),
    to: now.toUTC().toJSDate(),
  };
};

const getYtdRange = (zone = env.teamTimezone) => {
  const now = DateTime.now().setZone(zone);
  return {
    from: now.startOf("year").toUTC().toJSDate(),
    to: now.toUTC().toJSDate(),
  };
};

const getCustomRange = (from, to, zone = env.teamTimezone) => {
  return {
    from: DateTime.fromISO(from, { zone }).startOf("day").toUTC().toJSDate(),
    to: DateTime.fromISO(to, { zone }).endOf("day").toUTC().toJSDate(),
  };
};

module.exports = { getMtdRange, getYtdRange, getCustomRange };
