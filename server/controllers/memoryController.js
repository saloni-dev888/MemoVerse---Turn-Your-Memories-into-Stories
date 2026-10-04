const Memory = require("../models/Memory");
const { generateMemory } = require("../services/aiService");

exports.create = async (req, res) => {
  try {
    const { title, date, location, people, description, outputType } = req.body;

    if (!title || !description || !outputType) {
      return res.status(400).json({ message: "Title, description and output type are required" });
    }

    const parsedPeople = Array.isArray(people)
      ? people
      : typeof people === "string"
        ? people.split(",").map(x => x.trim()).filter(Boolean)
        : [];

    const images = (req.files || []).map(file => ({
      url: `/uploads/${file.filename}`,
      originalName: file.originalname
    }));

    const memory = await Memory.create({
      user: req.user.id,
      title,
      date: date || undefined,
      location,
      people: parsedPeople,
      description,
      images,
      outputType,
      status: "draft"
    });

    res.status(201).json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.generate = async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, user: req.user.id });
    if (!memory) return res.status(404).json({ message: "Memory not found" });

    const content = await generateMemory({
      title: memory.title,
      date: memory.date,
      location: memory.location,
      people: memory.people,
      description: memory.description,
      outputType: memory.outputType
    });

    memory.generatedTitle = memory.title;
    memory.generatedContent = content;
    memory.status = "generated";
    await memory.save();

    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, user: req.user.id });
    if (!memory) return res.status(404).json({ message: "Memory not found" });
    res.json(memory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Memory.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: "Memory not found" });
    res.json({ message: "Memory deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
