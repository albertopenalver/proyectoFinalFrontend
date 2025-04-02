const Mensaje = require("../models/mensaje.model");

const getMensajes = async (req, res) => {
  const { sender, recipient } = req.query;

  try {
    const messages = await Mensaje.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).send('Error al obtener mensajes');
  }
};

const createMensaje = async (req, res) => {
  const { sender, recipient, message } = req.body;

  try {

    const newMessage = new Mensaje({
      sender,
      recipient,
      message,
    });


    await newMessage.save();

    res.status(201).json(newMessage); 
  } catch (error) {
    console.error('Error al guardar el mensaje:', error);
    res.status(500).json({ error: 'Hubo un error al guardar el mensaje' });
  }
};

module.exports = { getMensajes, createMensaje };
