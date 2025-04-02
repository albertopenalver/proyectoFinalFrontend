const user = require('../models/user.model');
const Empresa = require('../models/empresa.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;


const createUser = async (req, res) => {
  console.log(req.body);
  try {
    const userExists = await user.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    req.body.contraseña = hashedPassword;

      const userDoc = await user.create({
        nombre: req.body.nombre,
        email: req.body.email,
        contraseña: hashedPassword,
        permisos: "user",
        empresa: req.body.empresa
      });
          console.log(`User created successfully: ${userDoc}`);

    const token = jwt.sign(
      {
        userId: userDoc._id,
        nombre: userDoc.nombre,
        permisos: userDoc.permisos,
        empresa: userDoc.empresa,
      },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Token created', token);
    res.status(201).json({ user: userDoc, token });
  } catch (err) {
    console.log(`Error creating a new user: ${err}`);
    res.status(500).send({ message: 'Error creating a new user' });
  }
};

 

const createCreador = async (req) => {
  console.log(req.body);

  try {
    const userExists = await user.findOne({ email: req.body.email });
    if (userExists) {
      if (req.createType === "empresa") {
        return false;
      }
      return { error: 'El usuario ya existe' };
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(req.body.contraseña, 10);
    req.body.contraseña = hashedPassword;

    // Attach empresa ID to the user
    const userDoc = await user.create({
      ...req.body,
      empresa: req.body.empresa, // Use the empresa ID
    });

    console.log(`User created successfully: ${userDoc}`);

    const token = jwt.sign(
      {
        userId: userDoc._id,
        nombre: userDoc.nombre,
        permisos: userDoc.permisos,
        empresa: userDoc.empresa,
      },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    console.log('Token created', token);

    if (req.createType === "empresa") {
      return { user: userDoc, token };
    }

    return { user: userDoc, token };
  } catch (err) {
    console.error(`Error creating a new user: ${err}`);
    throw new Error('Error creating a new user');
  }
};


const loginUser = async (req, res) => {
  console.log('loginUser called');
  const { email, contraseña } = req.body;
  try {
    console.log('Searching for user');
    const userInstance = await user.findOne({ email });
    if (!userInstance) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }
    console.log('User found:', userInstance);
    console.log('Stored password:', userInstance.contraseña);
    console.log('Provided password:', contraseña);

    const isMatch = await bcrypt.compare(contraseña, userInstance.contraseña);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      {
        userId: userInstance._id,
        nombre: userInstance.nombre,
        permisos: userInstance.permisos,
        empresa: userInstance.empresa,
      },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );
    console.log('Token created', token);
    res.status(200).json({ token });
  } catch (error) {
    console.log(`Error al iniciar sesión: ${error}`);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const getUser = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); 

  if (!token) {
      return res.status(401).send({ message: 'No se proporcionó un token válido.' }); 
  }

  try {
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET); 
      
      const empresaId = decoded.empresa;

      
      user.find({ empresa: empresaId }) 
          .then((userDocs) => {
              if (!userDocs || userDocs.length === 0) {
                  return res.status(404).send({ message: 'No se encontraron usuarios para esta empresa.' });
              }
              console.log("Usuarios encontrados:", userDocs);
              res.send(userDocs); 
          })
          .catch((err) => {
              console.error("Error al buscar usuarios:", err);
              res.status(500).send({ message: 'Error al buscar usuarios.' });
          });
  } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(403).send({ message: 'Token inválido o expirado.' }); 
  }
};

const getUserById = (req, res) => {
  const { userId } = req.params; 
  console.log('ID recibido:', userId);

  if (userId === 'me') {
    return getCurrentUser(req, res);
  }

  user.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      res.send(user);
    })
    .catch((err) => {
      console.error('Error al obtener el usuario:', err);
      res.status(500).send('Error en el servidor');
    });
};

const getCurrentUser = (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    user.findById(decoded.userId)
      .then(user => res.json(user))
      .catch(err => res.status(500).json({ error: 'Error al obtener usuario', err }));
  });
};

const assignAdminRole = async (req, res) => {
  try {
    const { userId } = req.params; // Ensure userId is correctly captured
    
    const userInstance = await user.findById(userId);
    if (!userInstance) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if(userInstance.permisos === "creador"){
      return res.status(404).json({ error: 'El usuario tiene permisos de creador' });
    }
    userInstance.permisos = "admin";
    await userInstance.save();
    res.status(200).json({ message: `Rol de Admin asignado correctamente` });
  } catch (error) {
    console.log(`Error al asignar rol: ${error}`);
    res.status(500).json({ error: 'Error en el servidor', details: error.message });
  }
};

const fs = require('fs');
const updateUserPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó ninguna foto' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    const imageUrl = result.secure_url;

    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,

      { foto: imageUrl }, 
      { new: true } 

    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }


    // Eliminar el archivo temporal de la carpeta 'uploads'
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo temporal:', err);
      } else {
        console.log('Archivo temporal eliminado:', req.file.path);
      }
    });

    // Devuelve el usuario actualizado con la nueva imagen

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error en updateUserPhoto:", error);
    res.status(500).json({ message: 'Error al actualizar la foto del usuario', error: error.message });
  }
};
const updateUserName = async (req, res) => {
  try {
    const { id } = req.params; 
    const { nombre } = req.body;

    // Validar que el nombre fue proporcionado
    if (!nombre) {
      return res.status(400).json({ message: "El campo 'nombre' es obligatorio" });
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await user.findByIdAndUpdate(
      id,
      { nombre }, 
      { new: true } 
    );


    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Devolver el usuario actualizado
    return res.json(updatedUser);
  } catch (error) {
    console.error("Error en updateUserName:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL

    // Buscar y eliminar el usuario
    const deletedUser = await user.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado con éxito', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};


module.exports = { createUser, createCreador, getUser, loginUser, assignAdminRole, getUserById, getCurrentUser, updateUserPhoto,updateUserName,deleteUser };

