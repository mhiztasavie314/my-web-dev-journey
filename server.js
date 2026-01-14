const express = require('express');
const mongoose = require('mongoose');
const dbAddress = 'mongodb://localhost:27017/myapp';
// Connect!
mongoose.connect(dbAddress)
.then(() => {
  console.log("Connected to the database successfully!");
})
.catch((error) => {
  console.log("Database connection error:", error);
});
const app = express();
app.use(express.json());
app.use(express.static('public'));
const userSchema = new mongoose.Schema({
  name: String,
  role: String,
});
const User = mongoose.model('User', userSchema);
// In-memory user data
// GET: See all users
// GET: Retrieve all users from the Database
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
// POST: Add a new user to the Database
app.post('/users', async (req, res) => {
  const newUser = new User(req.body)
  await newUser.save();
  res.status(201).json({message: "User saved to DB!", user: newUser });
});
// DELETE: Remove a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
const id = req.params.id;
const deletedUser = await User.findByIdAndDelete(id);
if (!deletedUser) {
  return res.status(404).json({ message: "User not found" });
} 
res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});
// PUT: Update a user's role by ID
app.put('/users/:id', async (req, res) => {
  try {
  const id = req.params.id;
  // { new: true } asks MongoDB to return the UPDATED version, not the old one
  const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
if (!updatedUser) {
  return res.status(404).json({ message: "User not found" });
}
res.json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});
// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
