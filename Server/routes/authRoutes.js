const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../Database/model/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

require('dotenv').config();
// a84jf9h2whf0



//***************************************email***************************************
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'jointomeet.com@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
});


async function mailer(recieverEmail, varificationCode) {
  const info = await transporter.sendMail({
    from: 'JOiNTOMEET',
    to: recieverEmail,
    subject: "Authentication",
    text: `Hello User`,
    html: `Your OTP code is <b>${varificationCode}</b>`,
  });

  console.log("varification code send");
  console.log("Message sent: %s", info.messageId);
}


async function mailer2(name, recieverEmail, varificationCode) {
  const info = await transporter.sendMail({
    from: 'JOiNTOMEET',
    to: recieverEmail,
    subject: "Authentication",
    text: `Hello ${name}`,
    html: `Your Varification code is <b>${varificationCode}</b>`,
  });

  console.log("varification code send");
  console.log("Message sent: %s", info.messageId);
}

//***************************************Varify***************************************
router.post('/varify', (req, res) => {
  console.log(req.body);
  const { name, email, phone, password } = req.body;

  const saved = async () => {
    const isAvilableEmail = await Student.findOne({ email });
    const isAvilablePhone = await Student.findOne({ phone });

    if (isAvilableEmail || isAvilablePhone) {
      console.log("Email and phone Avialable");
      return res.status(422).json({ err: "Invalid credentials" });
    }

    try {
      const newStudent = new Student({
        name,
        phone,
        email,
        password,
      });
      console.log(newStudent._id + "<<<<<<<<<<<<     ID");
      const newToken = await jwt.sign({ _id: newStudent._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

      newStudent.tokens = newStudent.tokens.concat({ token: newToken });

      res.cookie("jwt", newToken, {
        expiresIn: '2d',
        httpOnly: true,
      });
      console.log(newStudent.password + "<<<<<<<<<<<<<");
      await newStudent.save();
      console.log("sucessfully Sign Up " + newToken);
      let newData = {
        name: newStudent.name,
        email: newStudent.email,
        role: role,
        clg: clg
      }
      return res.status(200).json({ msg: "success", token: `${newToken}`, Data: newData });

    } catch (err) {
      console.log(err);
      return res.status(422).json({ err } + 'this');
    }
  }
  saved();
})


//***************************************forgot password***************************************
router.post('/password', async (req, res) => {
  console.log("h");
  const { email } = req.body;
  const clg = req.cookies.clg;
  const role = req.cookies.role;
  console.log(email);

  const saved = async () => {
    const isAvilableEmail = await Student.findOne({ email });

    if (isAvilableEmail) {
      try {
        const varificationCode = Math.round(100000 + Math.random() * 900000);

        console.log(email, clg, role);
        const Data = {
          email,
          role,
          clg,
          varificationCode,
        }
        
        console.log("1");
        //send email
        await mailer(email, varificationCode);
        console.log("2");
        res.json({ msg: `varification code send ${varificationCode}`, code: Data });
      } catch (err) {
        console.log(" this" + err);
        return res.status(422).json({ err });
      }
    } else {
      res.json({ err: "email not available" });
    }
  }
  saved();

});



//***************************************change password***************************************
router.post('/changePassword', async (req, res) => {

  const updatePassword = async (uemail, newPassword, clg, role) => {
    try {
      let url = "mongodb://127.0.0.1:27017/" + clg
      const db1 = mongoose.createConnection(url)
      let Database;
      if (role == "student") {
        const Schema = new mongoose.Schema({
          name: {
            type: String,
            require: true,
            trim: true,
          },
          phone: {
            type: String,
            require: true,
            maxlength: 10,
            minlength: 10,
            trim: true
          },
          email: {
            type: String,
            require: true,
            unique: true,
            trim: true
          },
          password: {
            type: String,
            require: true,
            trim: true
          },
          tokens: [{
            token: {
              type: String,
              require: true
            }
          }]
        })

        Database = db1.model("Student", Schema);
      } else if (role == "teacher") {
        Database = db1.model("teacher", require('../Database/model/Teacher'));
      }

      // Retrieve the student by email
      const user = await Database.findOne({ email: uemail });

      if (!user) {
        // Handle case where student with the provided email does not exist
        return { error: 'user not found' };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 8);

      // Update the password field
      user.password = hashedPassword;

      // Save the changes to the database
      await user.save();

      let { name, phone, email, password } = user;

      let newUser = {
        name, phone, email, password
      };

      console.log(newUser);
      return { success: 'Password updated successfully', newUser };
    } catch (error) {
      // Handle error
      console.error('Error updating password:', error);
      return { error: 'Error updating password' };
    }
  };


  let { email, password, role, clg } = req.body;
  console.log(req.body)

  // Usage example
  updatePassword(email, password, clg, role)
    .then(result => res.json({ sucess: result.success, student: result.newstudent }))
    .catch(error => console.error(error));

});



//***************************************Signup***************************************
router.post('/signup', async (req, res) => {
  console.log("h");
  console.log(req.body);
  const { name, email, phone, password, confirmPassword, clg } = req.body;

  if (!name || !email || !phone || !password) {
    console.log("Please Enter All Fields");
    res.status(422).json({ err: "Please enter all fields" });
    return;
  } else if (password != confirmPassword) {
    console.log("Password doesnt match " + password + " " + confirmPassword);
    res.status(422).json({ err: "Password doesnt match" });
    return;
  }

  const saved = async () => {
    const isAvilableEmail = await Student.findOne({ email });
    const isAvilablePhone = await Student.findOne({ phone });

    if (isAvilableEmail || isAvilablePhone) {
      console.log("Email and phone avialable");
      return res.status(422).json({ err: "Invalid credentials" });
    }

    try {
      const varificationCode = Math.round(100000 + Math.random() * 900000);

      const newStud = {
        name,
        email,
        phone,
        password,
        varificationCode,
        clg,
      }

      //send email 
      await mailer2(name, email, varificationCode);
      res.json({ msg: `varification code send ${varificationCode}`, studData: newStud });
    } catch (err) {
      console.log(" this" + err);
      return res.status(422).json({ err });
    }
  }

  saved();

});



//***************************************Login***************************************
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const savedStudent = await Student.findOne({ email });

  if (!savedStudent) {
    console.log("Email Not Exist")
    return res.status(422).json({ err: "Invalid Credentials" });
  }
  try {
    bcrypt.compare(password, savedStudent.password, async (err, result) => {
      if (result) {
        console.log("password match");
        const newToken = await jwt.sign({ _id: savedStudent._id }, process.env.JWT_SECRET);

        // savedStudent.tokens = { token: newToken };
        savedStudent.tokens = savedStudent.tokens.concat({ token: newToken });
        res.cookie("jwt", newToken, {
          expiresIn: "2d",
          httpOnly: true,
        })
        console.log(res.cookie + "Inide AuthRoute");

        await savedStudent.save();

        const detail = {
          name: savedStudent.name,
          phone: savedStudent.phone,
          email: savedStudent.email,
          pssword: savedStudent.password,
        };

        console.log(savedStudent);
        console.log(newToken);

        return res.status(200).json({ msg: newToken, studData: detail });
      } else {
        return res.status(422).json({ err: "Invalid Credentials" });
      }
    })
  } catch (err) {
    return res.status(422).json({ err: err });
  }
  return;
});



module.exports = router;