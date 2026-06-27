require("dotenv").config();
const express = require("express");
const cors = require("cors");
const reportRoutes = require("./routes/reports");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Park Report API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
