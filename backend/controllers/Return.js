// backend/controllers/Return.js
const Return = require('../models/Return');

exports.getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate('user')
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedReturn = await Return.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user').populate('order');
    
    res.json(updatedReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};