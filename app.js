let express = require("express");
let body_parser = require("body-parser");
let ejs = require("ejs");
let _ = require('lodash');
let mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin-dp:admin-dp@cluster0.awtxs.mongodb.net/feedbackFormDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

let app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let questions = ["was well-prepared for classes",
  "gave interesting and informative classes",
  "was good at explaining things",
  "taught at an appropriate pace",
  "was effective in leading the class",
  "was receptive to student's questions",
  "stimulated interest in the subject",
  "stimulated discussion on the subject",
  "stimulated me to think and learn",
  "had a good report with the class",
  "was available to answer questions in office hours",
  "is creative in developing lesson plans",
  "encourages students to speak up",
  "is consistent and fair in discipline",
  "tries to model student's expectations"
];

const feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  que: [{
    op: Number
  }]
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

app.get("/", function(req, res) {
  res.render("form", {
    questions: questions
  });
})

app.post("/", function(req, res) {
  res.redirect("/");
})

app.get("/response", function(req, res) {
  Feedback.find(function(err, data) {
    res.render("db", {
      questions: questions,
      data: data
    });
  })
})

app.post("/response", function(req, res) {
  let id = req.body.btn;
  Feedback.findByIdAndRemove(id, function(err) {
    if (!err) {
      res.redirect("/response");
    }
  });
})

app.post("/submitted", function(req, res) {
  let userName = req.body.userName;
  let userEmail = req.body.userEmail;
  let que = req.body.q;
  let feedback = new Feedback({
    name: userName,
    email: userEmail
  });
  for (let i = 0; i < que.length; i++) {
    feedback.que.push({
      op: que[i]
    });
  }
  feedback.save();
  res.render("submitted", {
    name: userName
  });
})

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("server has started ...");
})
