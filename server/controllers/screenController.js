const Screen = require("../models/screenModel");

const createScreen = async (req, res) => {
  try {
    const { name, capacity, screenType } = req.body;

    if (!name || !capacity) {
      return res.status(400).json({ error: "Name and capacity are required" });
    }
    const capacityNum = parseInt(capacity);
    if (isNaN(capacityNum) || capacityNum < 1) {
      return res.status(400).json({ error: "Capacity must be a positive number" });
    }

    const screen = await Screen.create({
      name,
      capacity: capacityNum,
      screenType,
    });

    res.status(201).json(screen);
  } catch (error) {
    console.error("Error creating screen:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.findAll();
    res.status(200).json(screens);
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({ error: error.message });
  }
};

const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findByPk(id);
    if (!screen) {
      return res.status(404).json({ error: "Screen not found" });
    }
    res.status(200).json(screen);
  } catch (error) {
    console.error("Error fetching screen:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Screen.update(req.body, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Screen not found" });
    }
    const updatedScreen = await Screen.findByPk(id);
    res.status(200).json(updatedScreen);
  } catch (error) {
    console.error("Error updating screen:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Screen.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Screen not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting screen:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
};
