const Proveedor = require ("../models/proveedor.model");
const jwt = require('jsonwebtoken');

const crearProveedor = async (req, res) => {
    try {
      const { nombre, cif, email, direccion, telefono, quieremail, empresa } = req.body;
  
      if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre del proveedor es obligatorio.' });
      }
  
      const nuevoProveedor = new Proveedor({
        nombre,
        cif,
        quieremail,
        email,
        direccion,
        telefono,
        empresa: empresa,
      });
  
      const proveedorGuardado = await nuevoProveedor.save();
  
      res.status(201).json({ mensaje: 'Proveedor creado con éxito.', proveedor: proveedorGuardado });
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({ mensaje: 'Error del servidor al crear proveedor.' });
    }
  };

  function getProveedores(req, res) {
      const token = req.header('Authorization')?.replace('Bearer ', ''); 
      if (!token) {
          return res.status(401).send({ message: 'No se proporcionó un token válido.' });
      }
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET); 
          const empresaId = decoded.empresa; 

    Proveedor.find({ isDeleted: false, empresa: empresaId })
        .then((proveedorDocs) => {
            res.send(proveedorDocs); 
        })
        .catch((err) => {
            console.log("Error al buscar proveedor", err);
            res.status(500).send({ message: 'Error al buscar proveedor' }); // Maneja el error
        });
      } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).send({ message: 'Token inválido o expirado.' });
    }
};

const getProveeodrById = (req, res) => {
    const { id } = req.params; 
  
    Proveedor.findById(id)
      .then((Proveedor) => {
        if (!Proveedor) {
          return res.status(404).send('Proveedor no encontrado');
        }
        res.send(Proveedor);
      })
      .catch((err) => {
        console.log('Error al obtener proveedor:', err);
        res.status(500).send('Error en el servidor');
      });
  };

  const softDeleteProveedor = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedProveedor = await Proveedor.findByIdAndUpdate(
            id,
            {
                isDeleted: true, 
                deletedAt: new Date() 
            },
            { new: true }
        );

        if (!updatedProveedor) {
            return res.status(404).send("El proveedor no existe"); 
        }

        res.send(updatedProveedor);
    } catch (err) {
        console.log('Error:', err);
        res.status(500).send({ message: 'Error al eliminar proveedor' });
    }
};

const updateProveedor = (req, res) => {
    const { id } = req.params; 
 
    Proveedor.findByIdAndUpdate(
      id,                
      req.body,          
      { new: true }      
    )
    .then((editProveedor) => {
      res.send(editProveedor); 
    })
    .catch((err) => {
      console.log('Error al actualizar el proveedor:', err);
      res.status(500).send('Error en el servidor');
    });
  };

  const deleteAllProveedor = async (req, res) => {
		try {
		  await Proveedor.deleteMany({});
		  res.status(200).json({ message: 'Todos los proveedores han sido eliminados.' });
		} catch (error) {
		  console.error('Error al eliminar los proveedores:', error);
		  res.status(500).json({ error: 'Error al eliminar los proveedores.' });
		}
	  };

  module.exports = { crearProveedor, getProveedores, getProveeodrById, softDeleteProveedor, updateProveedor,deleteAllProveedor};