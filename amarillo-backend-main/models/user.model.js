const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contraseña: { type: String, required: true },
    foto: {
      type: String,
      default: 'https://res.cloudinary.com/dnaeqfn5j/image/upload/v1733249651/obteenoufnaiv2bf4kag.jpg',
    },
    permisos: { type: String, enum: ['user', 'admin', 'creador'], default: 'creador' },
    //comentario para borrar
    empresa: { type: mongoose.Schema.Types.ObjectId, ref: 'Empresas' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Usuario', userSchema);
