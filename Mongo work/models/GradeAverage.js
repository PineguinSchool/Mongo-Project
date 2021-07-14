const mongoose = require("mongoose");
const gradeAverageSchema = new mongoose.Schema({
    student_id: {type: Number},
    scores: [{assignment: String, score: Number}],
    class_id: {type: Number},
    date: {
      type: Date,
      default: Date.now,
    },
});

module.exports = mongoose.model("gradeAverage", gradeAverageSchema);