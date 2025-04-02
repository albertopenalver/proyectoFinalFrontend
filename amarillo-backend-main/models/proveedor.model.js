const mongoose = require("mongoose");

const proveedorSchema = new mongoose.Schema (
{
    nombre: {
        type: String,
        require: true
    },
    cif: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: false
    },
    quieremail: {
        type: Boolean,
        require: false,
    },
    direccion: {
        type: String,
        require: false
    },
    telefono: {
        type: String,
        require: false
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'empresa',
    },
    isDeleted:{ 
        type: Boolean, 
        default: false 
      },
      deletedAt: { 
        type: Date,
        default: null // Por defecto, null
      }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Proveedor", proveedorSchema);