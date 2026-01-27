const Pricing = require("../models/pricingModel");

// Get current pricing (create if not exists)
const getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne();
    if (!pricing) {
      pricing = await Pricing.create({});
    }
    res.json(pricing);
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update pricing
const updatePricing = async (req, res) => {
  try {
    const { frontRow, normal, discountDays, discountPercent } = req.body;
    let pricing = await Pricing.findOne();

    if (!pricing) {
      pricing = await Pricing.create({
        frontRow,
        normal,
        discountDays,
        discountPercent
      });
    } else {
      await pricing.update({
        frontRow,
        normal,
        discountDays,
        discountPercent
      });
    }

    res.json(pricing);
  } catch (error) {
    console.error("Error updating pricing:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPricing,
  updatePricing,
};
