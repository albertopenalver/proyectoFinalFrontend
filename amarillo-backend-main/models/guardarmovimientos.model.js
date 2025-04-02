const mongoose = require('mongoose');

const GuardarMovimientoSchema = new mongoose.Schema(
    {
        movimiento: [
            {
            type: mongoose.Schema.ObjectId,
            ref: 'Movimiento'
        },
    ],
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
      }
    },
    { timestamps: true }
);


module.exports = mongoose.model ('GuardarMovimientos', GuardarMovimientoSchema); 