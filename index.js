const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const jobRecommendationsRoute = require("./routes/recommendations");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

connectDB();

app.use("/api/recommendations", jobRecommendationsRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
