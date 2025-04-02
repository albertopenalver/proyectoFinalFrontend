const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    categoria: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Categoria', 
      required: false 
    },
    cantidad: { 
      type: Number, 
      required: true 
    },
    nombre: { 
      type: String, 
      required: true 
    },
    proveedor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Proveedor', 
      required: false 
    },
    foto: { 
      type: String, 
      required: false 
    },
    isDeleted:{ 
      type: Boolean, 
      default: false 
    },
    deletedAt: { 
      type: Date,
      default: null 
    },
    empresa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Empresa',
          }
  },
  { 
    timestamps: true 
  }
);
  

  module.exports = mongoose.model('Producto', productoSchema);