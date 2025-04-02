
const mongoose = require ('mongoose');

const CategoriaSchema = new mongoose.Schema(
{
    nombre: {
        type: String,
        required: true
    },
    categoriaPadre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categoria',
        default: null
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

module.exports = mongoose.model ('Categoria', CategoriaSchema);
