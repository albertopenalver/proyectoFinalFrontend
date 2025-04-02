const Message = require('../models/message.model');

exports.createMessage = async (req, res) => {
  try {
    const { content, sender, userId } = req.body;
    const message = new Message({ content, sender, userId, timestamp: new Date() });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate('userId', 'nombre');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
