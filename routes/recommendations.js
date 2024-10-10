const express = require("express");
const router = express.Router();
const findRecommendedJobs = require("../services/findRecommendedJobs");

router.post("/", async (req, res) => {
  const userProfile = req.body;

  try {
    const recommendations = await findRecommendedJobs(userProfile);

    if (Array.isArray(recommendations) && recommendations.length > 0) {
      res.status(200).json(recommendations);
    } else {
      res.status(404).json(recommendations);
    }
  } catch (error) {
    res.status(500).json({ message: "Error generating job recommendations." });
  }
});

module.exports = router;
