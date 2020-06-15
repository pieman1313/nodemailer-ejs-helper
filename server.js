let express = require("express");
const app = express();
const PORT = 4000;

app.set("views", "./template");
app.set("view engine", "ejs");

//Cors Configuration
const cors = require("cors");
app.use(cors());

//BodyParser Configuration
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Node Mailer Configuration
let nodemailer = require("nodemailer");
const config = require("./config/config");

//Creating transport instance
let transport = {
  host: config.HOST,
  auth: {
    user: config.EMAIL,
    pass: config.PASS,
  },
};

//Creating a Nodemailer Transport instance
let transporter = nodemailer.createTransport(transport);

//Verifying the Nodemailer Transport instance
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

//Express Router Configuration
let router = express.Router();

const model = {
  name: "DeWitt",
};

router.get("/", function (req, res) {
  res.render("email", model);
});

router.get("/send", (req, res, next) => {
  const ejs = require("ejs");

  ejs.renderFile(__dirname + "/template/email.ejs", model, function (
    err,
    data
  ) {
    if (err) {
      console.log(err);
    } else {
      let mainOptions = {
        from: `"${config.NAME}" ${config.EMAIL}`,
        to: config.TO,
        subject: config.SUBJECT,
        html: data,
      };

      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          res.json({
            msg: "fail",
          });
        } else {
          res.json({
            msg: "success",
          });
        }
      });
    }
  });
});

app.use("/", router);

app.listen(PORT, function () {
  console.log("Server is running at PORT:", PORT);
});
