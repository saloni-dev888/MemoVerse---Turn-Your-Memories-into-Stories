const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    date: { type: Date },
    location: { type: String, trim: true },
    people: [{ type: String, trim: true }],
    description: { type: String, required: true },
    images: [
      {
        url: String,
        originalName: String
      }
    ],
    outputType: {
      type: String,
      enum: ["story", "poetry", "magazine", "short-book"],
      required: true
    },
    generatedTitle: String,
    generatedContent: String,
    status: {
      type: String,
      enum: ["draft", "generated"],
      default: "draft"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Memory", memorySchema);
