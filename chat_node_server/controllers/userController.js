const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id }, jwtkey, { expiresIn: "1m" });
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json("User already exist!");
    if (!name || !password || !email)
      return res.status(400).json("All fields are required!");
    if (!validator.isEmail(email))
      return res.status(400).json("Invalid email!");
    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password is weak!");

    user = new userModel({ name, email, password });
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let isValidPassword = false;

  try {
    let user = await userModel.findOne({ email });

    if (user) {
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!user || !isValidPassword) {
      return res.status(400).json("Email or password incorrect");
    }

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
}

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json("Error: " + error);
  }
}

module.exports = { registerUser, loginUser, findUser, getUsers };