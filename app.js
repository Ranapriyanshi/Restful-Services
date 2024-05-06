const express = require("express");
const { sequelize, Users } = require("./models");

const app = express();
app.use(express.json());

// Endpoint for creating a new user
app.post("/user", async (req, resp) => {
  const { full_name, country_code } = req.body;
  try {
    const user = await Users.create({ full_name, country_code });
    resp.status(201).json(user);
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server error" });
  }
});

// Endpoint for fetching all users
app.get("/users", async (req, resp) => {
  try {
    const users = await Users.findAll();
    resp.status(200).json(users);
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server error" });
  }
});


app.listen(5000, async () => {
  console.log("Server is running on http://localhost:5000");
  await sequelize.authenticate();
  console.log("Database connected!");
});
