const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const cors = require('cors');
const port = 80;
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const multer = require('multer');
const nodemailer = require("nodemailer");
const io = require('socket.io')(server);
const path = require('path');
require('./Database/connect/db');
require('./Database/model/Student');
require('./Database/model/College');
require('./Database/model/StudentList');
require('./Database/model/TeacherList');
require('./Database/model/Assignment');
require('./Database/model/Attendence');
require('./Database/model/Shedule');
require('./Database/model/Notification');
// require('./Database/model/Teacher');

const mongoose = require('mongoose');
const Student = mongoose.model('Student');
const College = mongoose.model('College');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const ExcelJS = require('exceljs');

const authRoutes = require('./routes/authRoutes');
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(authRoutes);

const subjectData = new Map();
const adduser = (conferenceID, email, subject) => {
  // Check if the subject already exists in the map
  if (subjectData.has(subject)) {
    // If subject exists, add the student email to the existing array of students
    const students = subjectData.get(subject);
    if (!students.includes(email)) {
      // If email doesn't exist, add it to the array
      students.push(email);
      subjectData.set(subject, students);
    }
  } else {
    // If subject does not exist, create a new array with the student email and set it to the map
    subjectData.set(subject, [email]);
  }
}

const alluser = (subject) => {
  // Check if the subject exists in the map
  if (subjectData.has(subject)) {
    // Return the array of users for the specified subject
    return subjectData.get(subject);
  } else {
    // If subject does not exist, return an empty array or handle the error as needed
    return [];
  }
}

const userLeave = (subject, email) => {
  // Check if the subject exists in the map
  if (subjectData.has(subject)) {
    // Get the array of student emails for the specified subject
    const students = subjectData.get(subject);
    // Find the index of the student email to remove
    const index = students.indexOf(email);
    // If the student email is found, remove it from the array
    if (index !== -1) {
      students.splice(index, 1);
      subjectData.set(subject, students);
      return true; // Return true indicating the email was successfully removed
    }
  }
  return false; // Return false if the subject or email doesn't exist or if the email was not found
};

io.on("connection", socket => {
  console.log("someone connected");
  socket.on('join-room', ({ clg, email, subject, conferenceID }) => {
    console.log(email + " connected to " + clg + " " + subject + " " + conferenceID);
    socket.join(conferenceID)

    socket.to(conferenceID).emit("user", email)
    adduser(conferenceID, email, subject);
    console.log(subjectData);

    io.to(conferenceID).emit('all-user', alluser(subject))
    console.log(alluser(subject));

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      socket.leave(conferenceID);
      userLeave(subject, email);
      io.to(conferenceID).emit('all-user', alluser(subject))
      console.log(alluser(subject) + "<<<<<<<<<<<<<<<<<<");
    });
  });

})




const tlsOptions = {
  rejectUnauthorized: false,
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'jointomeet.com@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  },
  tls: tlsOptions,
});

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

app.get('/check', async (req, res) => {
  const cookieToken = req.cookies.jwt;
  const clg = req.cookies.clg;
  console.log(req.cookies);
  // const cookieToken = req.cookies.clg;
  const role = req.cookies.role;

  // res.json({ msg: "Done" });
  console.log("Cookie: " + cookieToken + " " + cookieToken + " " + role + " " + clg);

  if (!cookieToken) {
    console.log("You must Log in");
    return res.status(401).json({ err: "You must Log in" });
  }

  try {

    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    console.log(clg);

    const isAvilableCollege = await College.findOne({ college_Name: clg });

    if (!isAvilableCollege) {
      res.send("College not exist")
      console.log("College not exist")
    } else {
      jwt.verify(cookieToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ err: "token invalid" });
        }
        let { _id } = payload
        console.log(_id);
        try {
          let Database;
          if (role == 'student') {
            const studentSchema = new mongoose.Schema({
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

            Database = db1.model("Student", studentSchema);
          } else if (role == 'teacher') {
            Database = db1.model("teacher", require('./Database/model/Teacher'));

          }


          const { _id } = payload;
          Database.findById(_id)
            .then(studData => {
              if (studData) {
                let newData = {
                  name: studData.name,
                  email: studData.email,
                  phone: studData.phone,
                  role: role,
                  clg: clg
                }
                console.log(newData);
                console.log("Done " + JSON.stringify(newData));
                res.json({ Data: newData });
              } else {
                console.log("notDone");
                console.log(req.cookies.jwt + "<-this");
                res.json({ err: "notDone" });
              }
            })
        } catch (error) {
          console.log("not");
          res.json({ err: error });
        }
      })
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }



  // if (!cookieToken) {
  //   console.log("You must Log in");
  //   return res.status(401).json({ err: "You must Log in" });
  // }

  // jwt.verify(cookieToken, process.env.JWT_SECRET, async (err, payload) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(401).json({ err: "token invalid" });
  //   }

  //   try {
  //     const { _id } = payload;
  //     Student.findById(_id)
  //       .then(studData => {
  //         if (studData) {
  //           console.log("Done " + studData);
  //           res.json({ msg: "done", data: studData });
  //         } else {
  //           console.log("notDone");
  //           console.log(req.cookies.jwt + "<-this");
  //           res.json({ err: "notDone" });
  //         }
  //       })
  //   } catch (error) {
  //     console.log("not");
  //     res.json({ err: error });
  //   }
  // })


})

app.post('/update', async (req, res) => {
  const { clg, name, phone, email, role } = req.body;
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  try {


    let Database;

    if (role == "teacher") {
      Database = db1.model("teacher", require('./Database/model/Teacher'));
    } else {
      const studentSchema = new mongoose.Schema({
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
      Database = db1.model("Student", studentSchema);
    }

    user = await Database.findOne({ email: email });
    user.name = name;
    user.phone = phone;
    console.log(user);
    let User = {
      clg, email, name, phone, role
    }
    await user.save();
    // consoel.log()
    res.json({ Data: User })
  } catch (error) {
    res.json({ err: error })
  }
})

app.post('/StudentList', async (req, res) => {
  const studentList = req.body;
  const { clg } = studentList[0];

  const isAvilableCollege = await College.findOne({ college_Name: clg });
  console.log(isAvilableCollege);
  if (isAvilableCollege == null) {
    res.send("College Already exist")
  } else {
    console.log(studentList[1]);
    console.log(studentList[3]);
    console.log(studentList[2]);
    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    const StudentList = db1.model("studentList", require('./Database/model/StudentList'));

    const Student = db1.model("Student", mongoose.Schema({ name: String, phone: String, email: String, password: String }));


    let ex = 0;
    for (let i = 1; i < studentList.length; i++) {
      let { name, email, roll } = studentList[i];
      const exist = await Student.findOne({
        student_Email: email
      });
      const existStudent = await StudentList.findOne({
        student_Email: email
      });

      if (exist || existStudent) {

        console.log(name + " existing student");

        ex = 1;
        break;
      }
      let newStd = new StudentList({ student_Name: name, student_Email: email, student_RollNo: roll });
      console.log(newStd);
      await newStd.save();
    }
    if (ex == 1) {
      res.send("existing student");
    } else {
      res.send("done")
    }
  }
})

app.post('/TeacherList', async (req, res) => {
  const teacherList = req.body;
  const { clg } = teacherList[0];

  const isAvilableCollege = await College.findOne({ college_Name: clg });
  console.log(isAvilableCollege);
  if (isAvilableCollege == null) {
    res.send("College Already exist")
  } else {
    console.log(teacherList[1]);
    console.log(teacherList[3]);
    console.log(teacherList[2]);
    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    const TeacherList = db1.model("teacherList", require('./Database/model/TeacherList'));

    const Teacher = db1.model("teacher", require('./Database/model/Teacher'));


    let ex = 0;
    for (let i = 1; i < teacherList.length; i++) {
      let { name, email } = teacherList[i];
      const exist = await Teacher.findOne({ teacher_Email: email });
      const existTeacher = await TeacherList.findOne({
        teacher_Email: email
      });

      if (exist || existTeacher) {

        console.log(name + " existing teacher");

        ex = 1;
        break;
      }
      let newTeacher = new TeacherList({ teacher_Name: name, teacher_Email: email });
      console.log(newTeacher);
      await newTeacher.save();
    }
    if (ex == 1) {
      res.send("existing teacher");
    } else {
      res.send("done")
    }
  }
})

app.post('/admin', async (req, res) => {

  try {

    console.log(req.body);
    const { clg, name, email } = req.body
    let url = "mongodb://127.0.0.1:27017/" + clg;
    const db1 = mongoose.createConnection(url)

    const isAvilableCollege = await College.findOne({ college_Name: clg });
    console.log(isAvilableCollege);
    if (isAvilableCollege) {
      res.send("College Already exist")
    } else {
      const newClg = new College({ college_Name: clg, admin_Name: name, admin_Mail: email });
      const Student = db1.model("student", mongoose.Schema({ name: String }));
      const Message = db1.model("message", mongoose.Schema({ message: String }));
      const Shedule = db1.model("shedule", require('./Database/model/Shedule'));
      const Assignment = db1.model("assignment", require('./Database/model/Assignment'));
      const Attendence = db1.model("attendence", require('./Database/model/Attendence'));
      const StudentList = db1.model("studentList", require('./Database/model/StudentList'));
      const Teacher = db1.model("teacher", require('./Database/model/Teacher'));
      const TeacherList = db1.model("teacherList", require('./Database/model/TeacherList'));
      const Notification = db1.model("notification", require('./Database/model/Notification'));

      // const student = Student.create({ name: "aryan" });
      // const message = Message.create({ message: "aryan is good" });
      await newClg.save();

      console.log("done");
      res.send("done");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }

})

app.post('/teacher', async (req, res) => {
  try {
    const { clg, name, phone, email, password, role } = req.body;

    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    console.log(clg);

    const isAvilableCollege = await College.findOne({ college_Name: clg });

    if (!isAvilableCollege) {
      res.json({ err: "College not exist" })
      console.log("College not exist")
    } else {
      const TeacherList = db1.model("teacherList", require('./Database/model/TeacherList'));

      // const StudentList = db1.model("studentList", require('./Database/model/StudentList'));
      const isAvilableTeacher = await TeacherList.findOne({ teacher_Email: email });
      // console.log(isAvilableStudent + "<<<<<<<<< thsi");
      if (isAvilableTeacher) {

        // const isAvilableStudent = await StudentList.findOne({ email });
        // const Student = require('./Database/model/Student');

        // const studentSchema = new mongoose.Schema({
        //   name: {
        //     type: String,
        //     require: true,
        //     trim: true,
        //   },
        //   phone: {
        //     type: String,
        //     require: true,
        //     maxlength: 10,
        //     minlength: 10,
        //     trim: true
        //   },
        //   email: {
        //     type: String,
        //     require: true,
        //     unique: true,
        //     trim: true
        //   },
        //   password: {
        //     type: String,
        //     require: true,
        //     trim: true
        //   },
        //   tokens: [{
        //     token: {
        //       type: String,
        //       require: true
        //     }
        //   }]
        // })
        const Teacher = db1.model("teacher", require('./Database/model/Teacher'));

        // const Student = db1.model("Student", studentSchema);
        // const Student = db1.model("Student", studentSchema);

        // studentSchema.pre('save', async function (next) {
        //   const student = this;
        //   if (!student.isModified('password')) {
        //     return next();
        //   }
        //   try {
        //     const hashedPassword = await bcrypt.hash(student.password, 10);
        //     student.password = hashedPassword;
        //     next();
        //   } catch (error) {
        //     return next(error);
        //   }
        // });
        let nH = password;
        // let nP;

        const compare = async () => {
          // nP = password;

          // Hash the password
          nH = await bcrypt.hash(password, 8);
          console.log(`Hash: ${nH}, ${password}`);

          // Compare the plain text password with the hashed password
          const result = await bcrypt.compare(password, nH);

          // Password matched
          if (result) {
            console.log("Password verified");
          }
          // Password not matched
          else {
            console.log("Password not verified");
          }
        };

        // await compare();
        const isDuplicate = await Teacher.findOne({ email: email });
        if (isDuplicate) {
          console.log("teacher already exist")
          res.json({ err: "teacher already exist" })
        } else {
          // const newTeacher = {
          //   name,
          //   phone,
          //   email,
          //   password: nH,
          // };
          const varificationCode = Math.round(100000 + Math.random() * 900000);

          const newTeacher = {
            varificationCode,
            name,
            phone,
            email,
            password: nH,
            clg,
            role
          };

          await mailer2(name, email, varificationCode);
          // const newToken = await jwt.sign({ _id: newTeacher._id, clg: clg, role: role }, process.env.JWT_SECRET, { expiresIn: '1d' });
          // res.cookie("jwt", newToken, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });
          // res.cookie("clg", clg, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });
          // res.cookie("role", role, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });

          // newTeacher.tokens = newTeacher.tokens.concat({ token: newToken });

          // console.log(newStudent);
          // await newTeacher.save();
          console.log("done");
          res.status(200).json({ data: newTeacher });
        }
      } else {
        console.log("Invalid teacher")
        res.json({ err: "Invalid teacher" })
      }
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.post('/student', async (req, res) => {
  console.log("entered");

  try {
    const { clg, name, phone, email, password, role } = req.body;

    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    console.log(clg);

    const isAvilableCollege = await College.findOne({ college_Name: clg });

    if (!isAvilableCollege) {
      res.status(422).json({ err: "College Not exist" });
      console.log("College not exist")
    } else {
      const StudentList = db1.model("studentList", require('./Database/model/StudentList'));
      const isAvilableStudent = await StudentList.findOne({ student_Email: email });
      // console.log(isAvilableStudent + "<<<<<<<<< thsi");
      if (isAvilableStudent) {

        // const isAvilableStudent = await StudentList.findOne({ email });
        // const Student = require('./Database/model/Student');

        const studentSchema = new mongoose.Schema({
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

        const Student = db1.model("Student", studentSchema);

        let nH = password;
        // let nP;

        const compare = async () => {
          // nP = password;

          // Hash the password
          nH = await bcrypt.hash(password, 8);
          console.log(`Hash: ${nH}, ${password}`);

          // Compare the plain text password with the hashed password
          const result = await bcrypt.compare(password, nH);

          // Password matched
          if (result) {
            console.log("Password verified");
          }
          // Password not matched
          else {
            console.log("Password not verified");
          }
        };

        // await compare();
        const isDuplicate = await Student.findOne({ email: email });
        if (isDuplicate) {
          console.log("student already exist")
          res.status(422).json({ err: "student already exist" });
        } else {
          const varificationCode = Math.round(100000 + Math.random() * 900000);

          const newStudent = {
            varificationCode,
            name,
            phone,
            email,
            password: nH,
            clg,
            role
          };

          await mailer2(name, email, varificationCode);
          // const newToken = await jwt.sign({ _id: newStudent._id, clg: clg, role: role }, process.env.JWT_SECRET, { expiresIn: '1d' });
          // res.cookie("jwt", newToken, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });
          // res.cookie("clg", clg, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });
          // res.cookie("role", role, {
          //   maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          //   httpOnly: true,
          // });

          // newStudent.tokens = newStudent.tokens.concat({ token: newToken });

          // console.log(newStudent);
          // await newStudent.save();
          console.log("done")
          res.status(200).json({ data: newStudent })
        }
      } else {
        console.log("Invalid student")
        res.status(422).json({ err: "Invalid Student" });
      }
    }
  } catch (error) {
    console.log(error)
    res.json({ err: error })
  }
})

app.post('/userSignup', async (req, res) => {
  console.log(req.body);
  const { name, email, phone, password, clg, role } = req.body;
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
    Database = db1.model("teacher", require('./Database/model/Teacher'));
  }


  const isAvilableEmail = await Database.findOne({ email });
  const isAvilablePhone = await Database.findOne({ phone });

  if (isAvilableEmail || isAvilablePhone) {
    console.log("Duplicate");
    res.json({ err: "We send verification code To this email id" });
  }
  else {
    const saved = async () => {
      try {
        let nH = password;

        const compare = async () => {

          nH = await bcrypt.hash(password, 8);
          console.log(`Hash: ${nH}, ${password}`);

          const result = await bcrypt.compare(password, nH);

          if (result) {
            console.log("Password verified");
          }
          else {
            console.log("Password not verified");
          }
        };

        await compare();

        const newData = new Database({
          name,
          phone,
          email,
          password: nH,
        });

        const newToken = await jwt.sign(
          { _id: newData._id, clg: clg, role: role },
          process.env.JWT_SECRET,
          { expiresIn: '2d' }
        );

        res.cookie("jwt", newToken, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        res.cookie("clg", clg, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        res.cookie("role", role, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        newData.tokens = newData.tokens.concat({ token: newToken });

        console.log(newData);
        const Data = {
          name,
          email,
          clg,
          role,
          phone
        };

        await newData.save();
        res.json({ Data });
      } catch (error) {
        console.log(error);
        res.json({ err: error });
      }
    }

    saved();
  }
})

app.post('/userLogin', async (req, res) => {
  const { email, password } = req.body;
  const clg = req.cookies.clg;
  const role = req.cookies.role;
  console.log(email, password,clg,role);


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
    Database = db1.model("teacher", require('./Database/model/Teacher'));
  }

  const isAvilableEmail = await Database.findOne({ email });

  if(!isAvilableEmail) {
    console.log("invalid emaid");
    return res.status(422).json({ err: "invalid credentials" });
  }

  try {
    bcrypt.compare(password, isAvilableEmail.password, async (err, result) => {
      if (result) {
        console.log("password match");
        // const newToken = await jwt.sign({ _id: isAvilableEmail._id }, process.env.JWT_SECRET);

        // savedStudent.tokens = { token: newToken };
        // isAvilableEmail.tokens = isAvilableEmail.tokens.concat({ token: newToken });
        
        const newToken = await jwt.sign(
          { _id: isAvilableEmail._id, clg: clg, role: role },
          process.env.JWT_SECRET,
          { expiresIn: '2d' }
        );

        res.cookie("jwt", newToken, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        res.cookie("clg", clg, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        res.cookie("role", role, {
          maxAge: 2 * 24 * 60 * 60 * 1000, // Expires in 2 days
          httpOnly: true,
        });

        isAvilableEmail.tokens = isAvilableEmail.tokens.concat({ token: newToken });

        await isAvilableEmail.save();

        const Data = {
          name: isAvilableEmail.name,
          email,
          clg,
          role,
          phone: isAvilableEmail.phone
        };

        // console.log(savedStudent);
        // console.log(newToken);

        return res.status(200).json({ Data });
      } else {
        return res.status(422).json({ err: "Invalid Credentials" });
      }
    })
  } catch (err) {
    return res.status(422).json({ err: err });
  }
  return;
});

app.post('/shedule', async (req, res) => {

  const { clg, id, password, name, start, email } = req.body;
  console.log(req.body);
  try {
    // Convert start time to a Date object
    const startTime = new Date(start);

    // Add 30 minutes to the start time
    const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes in milliseconds
    const formattedEndTime = endTime.toISOString().slice(0, 16).replace('T', ' ');
    console.log(endTime + "<<<");
    // Now you can save `updatedData` to MongoDB
    console.log(startTime + "" + endTime);

    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    const Shedule = db1.model("shedule", require('./Database/model/Shedule'));

    // const start = Date.now();
    // const end = endTime.toISOString().slice(0, 16).replace('T', ' ');

    const newShedule = new Shedule({
      email, id, password, start: startTime, end: endTime, name
    })

    await newShedule.save();
    console.log(newShedule);
    res.json({ msg: "done" });
  } catch (error) {

    console.log(error);
    res.json({ err: error });

  }

})

app.post('/attendence', async (req, res) => {

  const { clg, subject, name, email } = req.body;

  console.log(clg, subject);
  try {

    let url = "mongodb://127.0.0.1:27017/" + clg
    const db1 = mongoose.createConnection(url)
    const Attendence = db1.model("attendence", require('./Database/model/Attendence'));
    const attendance = alluser("gujarati");
    console.log(alluser("gujarati"));

    const convertedArray = attendance.map(email => {
      return { studentEmail: email };
    });

    console.log(convertedArray);


    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;

    const duplicate = await Attendence.findOne({ date, subject });

    if (!duplicate) {

      const newAt = new Attendence({
        subject,
        attendance: convertedArray,
        name, email
      });

      await newAt.save();
      console.log(newAt);
      res.json({ msg: "done" });
    } else {
      console.log("Already done");
      res.json({ err: "already take today attendece" });
    }
  } catch (error) {
    console.log(error);
    res.json({ err: error });
  }
})

app.post('/notification', async (req, res) => {

  const { clg, notification } = req.body;

  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Notification = db1.model("notification", require('./Database/model/Notification'));

  const newAt = new Notification({
    notification
  });

  await newAt.save();
  console.log(req.body);
  res.send("done");
})
// const { resolve } = require('path');

async function generateExcelFiles(clg, subject, date) {
  // console.log(clg, subject);
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const StudentList = db1.model("studentList", require('./Database/model/StudentList'));
  const Attendence = db1.model("attendence", require('./Database/model/Attendence'));

  let students = [];
  let data = await StudentList.find({});
  // console.log(data + "<- data");
  data.forEach((val, index) => {
    // console.log(val);
    students.push(val.student_Email);
  })

  students.sort();
  console.log(students + "<- students");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Attendance');

  // Set student names in the first column (column A)
  worksheet.getColumn(1).width = 25;
  students.forEach((studentName, rowIndex) => {
    worksheet.getCell(rowIndex + 2, 1).value = studentName; // Start from row 2 (rowIndex + 2)
  });

  // Calculate and set dates for the current month in the first row (starting from column B)
  const currentDate = new Date();

  worksheet.getCell(1, 1).value = subject
  const [month2, year2] = date.split('-');

  console.log(month2); // Output: 3
  console.log(year2);  // Output: 2024
  console.log(new Date(year2, month2, 1));

  const daysInMonth = new Date(year2, month2, 0).getDate();
  console.log(daysInMonth);
  for (let day = 1; day <= daysInMonth; day++) {
    worksheet.getCell(1, day + 1).value = new Date(year2, month2 - 1, day + 1);
    console.log(new Date(year2, month2 - 1, day + 1));
    worksheet.getColumn(day + 1).width = 12; // Adjust column width as needed
  }

  // // Retrieve unique dates and student email IDs
  const attendenceData = await Attendence.find({ subject });
  const filteredData = attendenceData.filter(item => {
    const month = item.date.getMonth() + 1; // JavaScript month is 0-indexed
    return month === Number(month2) && item.subject === subject;
  });

  console.log(">>>>>>>>>>>>" + filteredData + "<<<<<<<<<<<<<<<");

  filteredData.forEach((attendances, index) => {
    // console.log(attendances.date)
    const presentStudent = []
    attendances.attendance.forEach((attendance, index) => {
      presentStudent.push(attendance.studentEmail)
    })
    presentStudent.sort();

    const today = attendances.date.getDate()
    // console.log(">>>>>>>>>>>>" + attendances + "<<<<<<<<<<<<<<<");
    const column = Number(today) + 1;
    for (let row = 0; row < students.length; row++) {
      const currentStudent = worksheet.getCell(row + 2, 1).value;
      const index = presentStudent.indexOf(currentStudent);
      if (index === -1) {
        worksheet.getCell(row + 2, column).value = 'A';
      } else {
        worksheet.getCell(row + 2, column).value = 'P';
      }
    }

    // console.log(students)
    // console.log(presentStudent);
  })

  // console.log(attendenceData)
  const year = attendenceData[0].date.getFullYear()
  const month = attendenceData[0].date.toLocaleString('en-US', { month: 'long' });

  // console.log(worksheet.getCell(1, 2).value);
  const file_name = `${clg}_Attendance_${subject}-${month}-${year}`
  // Save the Excel file
  await workbook.xlsx.writeFile(`${file_name}.xlsx`)
    .then(() => {
      console.log('Excel file generated successfully');
    })
    .catch((error) => {
      console.error('Error generating Excel file:', error);
    });

  // const filePath = resolve(__dirname, `${file_name}.xlsx`);
  const filePath = path.join(__dirname, `${file_name}.xlsx`);
  console.log(filePath + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  return filePath;
}

app.get('/download-excel', async (req, res) => {
  try {
    const { subject, date, clg } = req.query;
    console.log(subject, date, clg);

    const filePath = await generateExcelFiles(clg, subject, date);
    const [month2, year2] = date.split('-');
    const file_name = `${clg}_Attendance_${subject}-${month2}-${year2}`
    // const filePath = `C:\\Users\\Jigar\\Desktop\\JOiNTOMEET - Document\\PROJECT\\Server\\Attendance_java-April-2024.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${file_name}.xlsx`);
    console.log(filePath);
    console.log(file_name);
    res.sendFile(filePath, (error) => {
      if (error) {
        console.error('Error sending file:', error);
        res.status(500).json({ error: 'Could not send file' });
      } else {
        console.log('File sent successfully');
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Could not retrieve attendance records' });
  }
});

app.get('/download', async (req, res) => {
  const { subject, date, clg } = req.query;
  console.log(subject, date, clg);
  res.json({ msg: "Done" });
  // const filePath = await generateExcelFiles(clg, subject, date);

})

app.get('/atd', async (req, res) => {
  const { clg } = req.query;

  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Attendence = db1.model("attendence", require('./Database/model/Attendence'));

  const attendence = await Attendence.find({});
  res.send(attendence);
})

app.get('/shedule', async (req, res) => {

  const { clg } = req.query;

  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Shedule = db1.model("shedule", require('./Database/model/Shedule'));

  const shedule = await Shedule.find({});
  res.send(shedule);
})

app.get('/notification', async (req, res) => {

  const { clg } = req.query;

  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Notification = db1.model("notification", require('./Database/model/Notification'));

  const notification = await Notification.find({});
  res.send(notification);
})


app.get('/StudentList', async (req, res) => {
  const { clg } = req.query;
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const StudentList = db1.model("studentList", require('./Database/model/StudentList'));

  const studentList = await StudentList.find({});
  res.send(studentList);

})

app.get('/TeacherList', async (req, res) => {
  const { clg } = req.query;
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const TeacherList = db1.model("teacherList", require('./Database/model/TeacherList'));
  const teacherList = await TeacherList.find({});
  res.send(teacherList);

})


app.get('/assignment', async (req, res) => {

  const { clg } = req.query;

  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Assignment = db1.model("assignment", require('./Database/model/Assignment'));

  const assignment = await Assignment.find({});
  res.send(assignment);
})

const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer
});
// const Pdf = mongoose.model('Pdf', pdfSchema);

const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to handle file upload
app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  console.log("hello");
  let clg = req.body.clg;
  console.log(clg);
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Pdf = db1.model("Pdf", pdfSchema);

  // const Pdf = mongoose.model('Pdf', pdfSchema);

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded file
    const fileData = req.file.buffer;
    // console.log(filePath);
    // Create a new document in MongoDB
    const fileName = req.file.originalname;
    const nameWithoutExtension = fileName.slice(0, -4); // Remove the last 4 characters (.pdf)
    const newPdf = new Pdf({
      name: nameWithoutExtension,
      data: fileData
    });

    // Save the PDF document to MongoDB
    await newPdf.save();
    console.error('Done');
    res.status(200).json({ message: 'PDF uploaded successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }
});

app.post('/assignment', upload.single('pdf'), async (req, res) => {

  // const { instruction } = req.body;
  let clg = req.body.clg;
  let title = req.body.title;
  let instruction = req.body.instruction;
  let deadline = req.body.d;

  console.log(clg, title, instruction, deadline);
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Assignment = db1.model("assignment", require('./Database/model/Assignment'));
  // const currentDate = new Date();
  // // Format the date as "dd-mm-yyyy"
  // const formattedDate = `${currentDate.getDate() + 1}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  const outputArray = instruction.split('.');
  console.log(outputArray);


  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const pdf = await Assignment.findOne({ assignment_Title: title });

    if (pdf) {
      console.log("hello");
      return res.status(400).json({ error: 'already uploaded' });
    }

    const fileData = req.file.buffer;

    const newAsg = new Assignment({
      assignment_Title: title,
      assignment_Instruction: outputArray,
      assignment_Deadline: deadline,
      data: fileData
    })

    await newAsg.save();
    console.log(req.body);
    res.status(200).json({ message: 'PDF uploaded successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to upload PDF' });
  }


})

// Endpoint to serve the uploaded PDF
app.get('/get-pdf/:name', async (req, res) => {
  let clg = req.query.clg;
  console.log(clg);
  let url = "mongodb://127.0.0.1:27017/" + clg
  const db1 = mongoose.createConnection(url)
  const Assignment = db1.model("assignment", require('./Database/model/Assignment'));

  try {
    const pdf = await Assignment.findOne({ assignment_Title: req.params.name });

    if (!pdf) {
      return res.status(404).json({ error: 'PDF not found' });
    }
    // console.log(pdf);
    // fs.writeFileSync('downloadedFile.pdf', pdf.data);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
      'Content-Length': pdf.data.length
    });
    console.log("done");

    res.status(200).send(pdf.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get PDF' });
  }
});

server.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
})
