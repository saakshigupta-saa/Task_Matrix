const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
{
project: {
type: mongoose.Schema.Types.ObjectId,
ref: "Project",
required: true,
},

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

action: {
  type: String,
  required: true,
  trim: true,
},

task: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Task",
},

},
{
timestamps: true,
}
);

module.exports = mongoose.model("Activity", activitySchema);
