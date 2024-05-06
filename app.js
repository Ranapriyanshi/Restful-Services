const express = require("express");

const { sequelize, Users, Addresses } = require("./models");
const { where } = require("sequelize");

const app = express();

app.use(express.json());

// Creating a new user
app.post("/users", async (req, resp) => {
  const { full_name, country_code } = req.body;
  try {
    const user = await Users.create({ full_name, country_code });
    resp.status(201).json(user);
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server error" });
  }
});

// Fetching all users
app.get("/users", async (req, resp) => {
  try {
    const users = await Users.findAll();
    resp.status(200).json(users);
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server error" });
  }
});

// Fetching a user by id
app.get("/users/:uuid", async (req, resp) => {
  const uuid = req.params.uuid;
  try {
    const user = await Users.findOne({ where: { uuid } });
    return resp.status(200).json(user);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Adding a new address to a user
app.post("/users/:uuid/addresses", async (req, resp) => {
  const { name, street, city, country, user_uuid } = req.body;
  try {
    const user = await Users.findOne({ where: { uuid: user_uuid } });
    const address = await Addresses.create({
      name,
      street,
      city,
      country,
      userId: user.uuid,
    });
    return resp.status(201).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Get all Addresses of a User
app.get("/users/:uuid/addresses", async (req, resp) => {
  const uuid = req.params.uuid;
  try {
    const addresses = await Addresses.findAll({ where: { userId: uuid } });
    return resp.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Get a user with specific address
app.get("/users/:id/addresses/:id", async (req, resp) => {
  const{ userId, addressId} = req.params;
  const user = await Users.findOne({where: { uuid : userId}});
  try {
    const address = await Addresses.findOne({
      where: { uuid: addressId, userId: userId },
    });
    return resp.status(200).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, async () => {
  console.log("Server is running on http://localhost:5000");
  await sequelize.authenticate();
  console.log("Database connected!");
});
