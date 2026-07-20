const express = require("express");
const router = express.Router();
const leadService = require("../services/leadService");
const { authenticate } = require("../middlewares/auth");

const getAreas = async (req, res, next) => {
  try {
    const [areas, lastArea] = await Promise.all([
      leadService.getAreaSuggestions(),
      leadService.getLastAreaForRep(req.user),
    ]);
    return res.status(200).json({ success: true, data: { areas, lastArea } });
  } catch (error) {
    return next(error);
  }
};

router.get("/", authenticate, getAreas);

module.exports = router;
