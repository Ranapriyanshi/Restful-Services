const express = require("express");

const { sequelize, Users, Addresses, AadharCardDetails } = require("./models");
const { where } = require("sequelize");

const app = express();

app.use(express.json());

// Fetch all users
app.get("/users", async (req, resp) => {
  try {
    const users = await Users.findAll();
    resp.status(200).json(users);
  } catch (err) {
    console.error(err);
    resp.status(500).json({ message: "Server error" });
  }
});

// Create a new user
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

// Fetch user by id
app.get("/users/:id", async (req, resp) => {
  const uuid = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    return resp.status(200).json(user);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Update a User
app.put("/users/:id", async (req, resp) => {
  const { full_name, country_code } = req.body;
  if (!full_name || !country_code)
    return resp
      .status(400)
      .json({ message: "Full name and country code are required" });
  try {
    const uuid = req.params.id;
    const user = await Users.findOne({ where: { uuid } });
    if (!user) return resp.status(404).json({ message: "User not found!" });
    user.set({ full_name, country_code });
    await user.save();
    return resp.status(200).json(user);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Delete a User
app.delete("/users/:id", async (req, resp) => {
  const uuid = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    await user.destroy();
    return resp.status(204).json();
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Create Aadhar for a User
app.post("/users/:id/aadhar", async (req, resp) => {
  const { aadharNumber, name } = req.body;
  const user_uuid = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid: user_uuid } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const aadhar = await AadharCardDetails.create({
      aadharNumber,
      name,
    });
    const aadharId = await aadhar.uuid;
    await user.set({ aadharId });
    await user.save();
    return resp.status(201).json(aadhar);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Fetch Aadhar of a User
app.get("/users/:id/aadhar", async (req, resp) => {
  const uuid = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const aadhar = user.aadharId;
    if (aadhar == null)
      return resp.status(404).json({ message: "Aadhar not found" });
    const aadharDetails = await AadharCardDetails.findOne({
      where: { uuid: aadhar },
    });
    return resp.status(200).json(aadharDetails);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Create new Address for a user
app.post("/users/:id/addresses", async (req, resp) => {
  const { name, street, city, country } = req.body;
  const user_uuid = req.params.id;
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

// Fetch all Addresses of a User
app.get("/users/:id/addresses", async (req, resp) => {
  const uuid = req.params.id;
  try {
    const addresses = await Addresses.findAll({ where: { userId: uuid } });
    if (addresses.length === 0)
      return resp.status(404).json({ message: "Addresses not found" });

    return resp.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Fetch Specific Address of a User
app.get("/users/:userId/addresses/:addressId", async (req, resp) => {
  const { userId, addressId } = req.params;

  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const address = await Addresses.findOne({
      where: { uuid: addressId, userId: userId },
    });
    if (!address)
      return resp.status(404).json({ message: "Address not found" });
    return resp.status(200).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Update specific Address for a User
app.put("/users/:userId/addresses/:addressId", async (req, resp) => {
  const { userId, addressId } = req.params;
  const { name, street, city, country } = req.body;
  if (!name || !street || !city || !country)
    return resp
      .status(400)
      .json({ message: "Name, street, city and country are required" });
  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const address = await Addresses.findOne({ where: { uuid: addressId } });
    if (!address)
      return resp.status(404).json({ message: "Address not found" });
    address.set({ name, street, city, country });
    await address.save();
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
