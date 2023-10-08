const express = require('express');
const router = express.Router();
const UserApp = require("../model/userSchema");
const UserOTP = require("../model/otp_schema");
const Authenticate = require('../middleware/Authenticate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

router.post('/signupUser', async (req, res) => {
  const { fullName, contactNumber, emailAddress, city, state, postal, formId, password, confirmPassword } =
    req.body;
  if (!fullName || !contactNumber || !emailAddress || !city || !state || !postal || !formId || !password || !confirmPassword) {
    return res.status(421).json({ error: "please fill the blank input" });
  } else {
    try {
      const userExistemail = await UserApp.findOne({ emailAddress: emailAddress });
      const userExistcontactnumber = await UserApp.findOne({ contactNumber: contactNumber, });
      const userApp = new UserApp({
        fullName, contactNumber, emailAddress, city, state, postal, formId, password, confirmPassword
      });
      const userOTP = new UserOTP({
        emailAddress
      });

      if (userApp === "") {
        return res.status(401).json({ error: "error" });
      }
      else if (userExistemail) {
        return res.status("422").json({ error: "Email Alerady Exist" });
      } else if (userExistcontactnumber) {
        return res.status("424").json({ error: "Contact number Alerady Exist" });
      } else if (password != confirmPassword) {
        return res.status("425").json({ error: "Password is not match" });
      }
      else {
        await userApp.save();
        await userOTP.save();

        res.status(201).json({ massege: "user registered successfully" });
        console.log(fullName, contactNumber, emailAddress, city, state, postal, formId, password, confirmPassword);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error({ message: error.massege });
    }
  }
})

router.post("/signin", async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    if (!emailAddress || !password) {
      return res.status(400).json({ error: "please fill the blank input1" });
    }

    const userlogin = await UserApp.findOne({ emailAddress: emailAddress });

    if (userlogin) {
      const userIsmatch = await bcrypt.compare(password, userlogin.password);

      if (!userIsmatch) {
        res.status(400).json({ error: "Invalide credentials" });
      } else {
        const token = jwt.sign({ userlogin }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.json({  message: "user login successfully",token });
      }
    } else {
      res.status(400).json({ error: "Invalide credentials" });
    }
  } catch (err) {
    console.log(err);
  }
});

// function verifyToken(req, res, next) {
//   const token = req.header('authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
//     if (err) {
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//     req.user = decodedToken;
//     next();
//   });
// }

// Example protected route
router.get('/profile', Authenticate,async (req, res) => {
  try {
    res.status(200).json(req.user);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
    console.log({ message: error.message });
  }
});

router.post('/otp_user_token', async(req, res)=>{

})

router.get('/getUserDataAll', async (req, res) => {
  try {
    const data = await UserApp.find();
    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
    console.log({ message: error.message });
  }
})
module.exports = router;