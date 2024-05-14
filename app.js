const express = require("express");

const {
  sequelize,
  Users,
  Addresses,
  AadharCardDetails,
  Roles,
  UserRoles,
  Image,
  Comment,
} = require("./models");
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

    const aadhar = await AadharCardDetails.findOne({
      where: { uuid: user.aadharId },
    });
    return resp.status(200).json(aadhar);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Create Addresses for a User
app.post("/users/:id/addresses", async (req, resp) => {
  const { name, street, city, country } = req.body;
  if (!name || !street || !city || !country)
    return resp
      .status(400)
      .json({ message: "Name, street, city and country are required" });
  const userId = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const address = await Addresses.create({
      name,
      street,
      city,
      country,
      userId,
    });
    return resp.status(201).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Fetch all Addresses of a User
app.get("/users/:id/addresses", async (req, resp) => {
  const userId = req.params.id;
  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const addresses = await Addresses.findAll({ where: { userId } });
    return resp.status(200).json(addresses);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Fetch Specific Addresses of a User
app.get("/users/:userId/addresses/:addressId", async (req, resp) => {
  const { userId, addressId } = req.params;

  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const address = await Addresses.findOne({
      where: { uuid: addressId, userId: userId },
    });
    if (!address)
      return resp.status(404).json({ message: "Addresses not found" });
    return resp.status(200).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Update specific Addresses for a User
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
      return resp.status(404).json({ message: "Addresses not found" });
    address.set({ name, street, city, country });
    await address.save();
    return resp.status(200).json(address);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// get All roles
app.get("/user_roles", async (req, resp) => {
  try {
    const roles = await Roles.findAll();
    return resp.status(200).json(roles);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Add roles to a user
app.post("/users/:userId/roles", async (req, resp) => {
  const userId = req.params.userId;
  const rolesToAdd = req.body.rolesToAdd;
  const user = await Users.findOne({ where: { uuid: userId } });
  if (!user) return resp.status(404).json({ message: "User not found" });

  try {
    for (const roleId of rolesToAdd) {
      const role = await Roles.findOne({ where: { uuid: roleId } });
      if (!role) return resp.status(404).json({ message: "Role not found" });
      await UserRoles.create({ userId, roleId });
    }
    return resp.status(201).json("Roles added successfully");
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Fetch all Roles of a User
app.get("/users/:userId/roles", async (req, resp) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findOne({ where: { uuid: userId } });
    if (!user) return resp.status(404).json({ message: "User not found" });
    const roles = await UserRoles.findAll({ where: { userId } });
    return resp.status(200).json(roles);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Delete some roles of a User
app.put("/users/:userId/roles", async (req, resp) => {
  const userId = req.params.userId;
  const roles_to_delete = req.body.roleToDelete;
  const user = await Users.findOne({ where: { uuid: userId } });
  if (!user) return resp.status(404).json({ message: "User not found" });
  try {
    for (const roleId of roles_to_delete) {
      await UserRoles.destroy({ where: { userId, roleId } });
    }
    return resp.status(200).json("Roles deleted successfully");
    // const roles = await UserRoles.findAll({ where: { userId } });
    // return resp.status(200).json(roles);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Create Image
app.post("/images", async (req, resp) => {
  const { url, height, width } = req.body;
  if (!url || !height || !width)
    return resp
      .status(400)
      .json({ message: "URL, height and width are required" });
  try {
    const image = await Image.create({ url, height, width });
    return resp.status(201).json(image);
  } catch (err) {
    console.error(err);
    return resp.status(500).json({ message: "Server error" });
  }
});

// Create comment for an Image
app.post("/images/:id/comments", async (req, resp) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const image = await Image.findByPk(id);
    if (!image) {
      return resp.status(404).json({ error: "Image not found" });
    }
    const comment = await Comment.create({
      text,
      commentableType: "image",
      commentableId: id,
    });
    resp.status(201).json(comment);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
});

// Fetch all comments of an Image
app.get("/images/:id/comments", async (req, resp) => {
  const { id } = req.params;
  try {
    const image = await Image.findByPk(id);
    if (!image) {
      return resp.status(404).json({ error: "Image not found" });
    }
    const comments = await Comment.findAll({
      where: { commentableType: "image", commentableId: id },
    });
    if (!comments.length)
      return resp.status(404).json({ error: "No comments found" });
    resp.status(200).json(comments);
  } catch (error) {
    resp.status(500).json({ error: error.message });
  }
});

app.listen(5000, async () => {
  console.log("Server is running on http://localhost:5000");
  await sequelize.authenticate();
  console.log("Database connected!");
});
