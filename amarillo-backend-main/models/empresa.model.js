const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema(
  {
    nombre: { 
      type: String
    },
    direccion: { 
      type: String, 
      required: false 
    },
    telefono: { 
      type: String, 
      required: false 
    },
    correo: {
      type: String,
      required: false
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: false
    }
  },
  { 
    timestamps: false 
  }
);

module.exports = mongoose.model('Empresa', empresaSchema);
