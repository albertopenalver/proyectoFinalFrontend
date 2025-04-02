const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
    },
    recipient: {
      type: String, 
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },

  },
  { timestamps: true }
);



module.exports = mongoose.model('mensaje', mensajeSchema);
