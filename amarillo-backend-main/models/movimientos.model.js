
const mongoose = require('mongoose');

const MovimientosSchema = new mongoose.Schema(
    {
        producto: {
            type: mongoose.Schema.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidadmov: {
            type: Number,
            default: null,
            min: 1
        },
        tipo: {
            type: String,
            enum: ['entrada', 'salida'],  
            required: true               
        },
        estado: {
            type: String,
            enum: ['aprobado', 'noaprobado', 'pendiente', 'rechazado'],  
            default: 'pendiente',
            required: true                
        },
        aprobadoPor: {
            type: mongoose.Schema.ObjectId,
            ref: 'Usuario', 
            required: false,
        },
        proveedor: {
            type: mongoose.Schema.ObjectId,
            ref: "proveedor", 
            required: false, 
          },
        empresa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'empresa',
        }
    },
    { timestamps: true}
    );



module.exports = mongoose.model ('Movimiento', MovimientosSchema);

