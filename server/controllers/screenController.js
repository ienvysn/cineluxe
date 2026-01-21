const Screen = require("../models/screenModel");

const createScreen = async (req, res) => {
  try {
    const { name, capacity, rows, seatsPerRow } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    let finalCapacity = capacity;
    if (!finalCapacity && rows && seatsPerRow) {
      finalCapacity = rows * seatsPerRow;
    }

    if (!finalCapacity) {
      return res
        .status(400)
        .json({ error: "Capacity or layout info is required" });
    }

    const screen = await Screen.create({
      name,
      capacity: finalCapacity,
      rows: rows || 0,
      seatsPerRow: seatsPerRow || 0,
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
    const { name, capacity, rows, seatsPerRow, screenType } = req.body;

    let updateData = { ...req.body };
    if (!capacity && rows && seatsPerRow) {
      updateData.capacity = rows * seatsPerRow;
    }

    const [updated] = await Screen.update(updateData, {
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
