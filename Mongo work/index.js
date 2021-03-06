const express = require("express");
const app = express();
const PORT = 3000;
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTasks");
const GradeAverage = require("./models/GradeAverage");
var id = null;
require("dotenv").config({ path: ".env" });


//
dotenv.config();

//
mongoose.connect(process.env.DATABASE_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.set("view engine", "ejs");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// GET method
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
      res.render("todo.ejs", { todoTasks: tasks });
    });
  });

app.get("/color", (req, res) => {
  GradeAverage.find({}, (err, grade) => {
    res.render("test.ejs", { GradeAverage: grade, student: id });
  });
});

// POST method
app.post("/", async (req, res) => {
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

app.post("/colorpost", async (req, res) => {
  const grade = new GradeAverage({
      student_id: req.body.student_id,
      scores: [{assignment: req.body.assignment_name, score: req.body.assingment_score}],
      class_id: req.body.class_id
  });
  id = req.body.student_id;
  try {
    await grade.save();
    res.redirect("/color");
  } catch (err) {
    res.redirect("/color");
  }
});

app.post("/colorfind", (req,res) => {
  GradeAverage.find({}, (err, grade) => {
    res.render("test.ejs", { GradeAverage: grade, student: id });
  });
  id = req.body.student_id;
});

// UPDATE method
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

// DELETE method
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});

app.route("/color/remove/:id").get((req, res) => {
  const id = req.params.id;
  GradeAverage.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/color");
  });
});

app.listen(PORT, () => {
    console.log(`Server is up and running on port: ${PORT}.`);
})
