const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  console.log("users");
  const users = await User.find();
  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  console.log("HERE //// ");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  const data = _.pick(user, ["_id", "name", "email"]);
  data.authtoken = token;


  res
    .header("x-auth-token", token)
    .send(data);
});

router.post("/update", async (req, res) => {
//working code
let user = await User.findOneAndUpdate({ email: req.body.email }, { name: req.body.name }, {new: true});
  const token = user.generateAuthToken();
  res.json({
    success: true,
    message: 'Enjoy your token!',
    token: token,
  });


  // res
  //   .header("x-auth-token", token)
  //   .send(data);

//  return res.send("test");
});




module.exports = router;
