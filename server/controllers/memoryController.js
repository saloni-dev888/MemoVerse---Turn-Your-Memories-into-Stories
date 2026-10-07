const Memory = require("../models/Memory");
const { generateMemory } = require("../services/aiService");

const ALLOWED_TYPES = ["story", "poetry", "magazine"];

const parsePeople = (people) => {
  if (Array.isArray(people)) {
    return people
      .map((person) => String(person).trim())
      .filter(Boolean);
  }

  if (typeof people === "string") {
    return people
      .split(",")
      .map((person) => person.trim())
      .filter(Boolean);
  }

  return [];
};

const parseGeneratedResult = (result) => {
  if (!result) {
    return {
      title: "",
      content: "",
      data: null,
    };
  }

  // New structured AI response
  if (typeof result === "object") {
    return {
      title: result.title || "",
      content: result.content || "",
      data: result.data || result,
    };
  }

  // Backward compatibility if AI service returns plain text
  return {
    title: "",
    content: String(result),
    data: null,
  };
};

/*
  CREATE MEMORY
*/
exports.create = async (req, res) => {
  try {
    const {
      title,
      date,
      location,
      people,
      description,
      outputType,
    } = req.body;

    if (!title || !description || !outputType) {
      return res.status(400).json({
        message:
          "Title, description and output type are required.",
      });
    }

    if (!ALLOWED_TYPES.includes(outputType)) {
      return res.status(400).json({
        message:
          "Invalid output type. Choose Story Book, Poetry or Magazine.",
      });
    }

    const parsedPeople = parsePeople(people);

    const images = (req.files || []).map((file) => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname,
    }));

    const memory = await Memory.create({
      user: req.user.id,
      title: title.trim(),
      date: date || undefined,
      location: location?.trim() || undefined,
      people: parsedPeople,
      description: description.trim(),
      images,
      outputType,
      status: "draft",
    });

    res.status(201).json(memory);
  } catch (error) {
    console.error("Create memory error:", error);

    res.status(500).json({
      message: error.message || "Failed to create memory.",
    });
  }
};

/*
  GENERATE AI MEMORY
*/
exports.generate = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    const result = await generateMemory({
      title: memory.title,
      date: memory.date,
      location: memory.location,
      people: memory.people,
      description: memory.description,
      outputType: memory.outputType,
      images: memory.images,
    });

    const parsed = parseGeneratedResult(result);

    memory.generatedTitle =
      parsed.title?.trim() || memory.title;

    memory.generatedContent = parsed.content || "";
    memory.generatedData = parsed.data || null;
    memory.status = "generated";

    await memory.save();

    res.json(memory);
  } catch (error) {
    console.error("Generate memory error:", error);

    res.status(500).json({
      message:
        error.message ||
        "Failed to generate memory. Please try again.",
    });
  }
};

/*
  LIST USER MEMORIES
*/
exports.list = async (req, res) => {
  try {
    const memories = await Memory.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.json(memories);
  } catch (error) {
    console.error("List memories error:", error);

    res.status(500).json({
      message: error.message || "Failed to fetch memories.",
    });
  }
};

/*
  GET ONE MEMORY
*/
exports.getOne = async (req, res) => {
  try {
    const memory = await Memory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!memory) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    res.json(memory);
  } catch (error) {
    console.error("Get memory error:", error);

    res.status(500).json({
      message: error.message || "Failed to fetch memory.",
    });
  }
};

/*
  DELETE MEMORY
*/
exports.remove = async (req, res) => {
  try {
    const deleted = await Memory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Memory not found.",
      });
    }

    res.json({
      message: "Memory deleted successfully.",
    });
  } catch (error) {
    console.error("Delete memory error:", error);

    res.status(500).json({
      message: error.message || "Failed to delete memory.",
    });
  }
};