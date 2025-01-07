var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const userModel = require('../models/user');
const user = require('../models/user');
const { sessionChecker } = require('../middleware/middlewareController');

router.post('/register', async function (req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).json({
        message: "Please enter complete information"
      });
    }

    const findUser = await userModel.findOne({ username });
    if (findUser) {
      res.status(401).json({
        message: "username already exists"
      });
    }

    const salt = await bcrypt.genSalt(4);
    const hash = await bcrypt.hash(password, salt);
    console.log("hash", hash);

    const saveUser = await new userModel({
      username: username,
      password: hash
    })
    saveUser.save()
    res.status(200).json(saveUser);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(401).json({
        message: "Please enter complete information"
      });
    }
    const findUser = await userModel.findOne({ username })
    if (!findUser) {
      res.status(401).json({
        message: "username not already exists"
      });
    }

    bcrypt.compare(password, findUser.password, (err, result) => {
      if (err) return res.status(401).json({ message: "username already exists" });

      if (result == true) {

        /// ///session là gì ? session được sử dụng để theo dõi trạng thái của người dùng giữa các yêu cầu 
        // đăng nhập thành công set session 
        req.session.user = {
          id: findUser._id,
          username: findUser.username
        }


        console.log("req.session.user", req.session);
        res.status(200).json({ message: "Login sucess" });

      } else {
        res.status(401).json({
          message: "Incorrect password"
        });
      }
    })

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get("/", sessionChecker, async (req, res) => {
  try {
    const user = await userModel.find()
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router;
