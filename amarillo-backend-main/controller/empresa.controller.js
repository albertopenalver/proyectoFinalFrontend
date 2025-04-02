const Empresa = require('../models/empresa.model');
const {createCreador} = require('../controller/user.controller');

const createEmpresa = async (req, res) => {
  console.log("Received Request Body:", req.body);
  try {
    // Validate the empresa data
    if (!req.body.empresa || typeof req.body.empresa !== "object") {
      console.log("Invalid empresa field:", req.body.empresa);
      return res.status(400).send({ message: 'Invalid request body. "empresa" must be an object with valid fields.' });
    }
    if (!req.body.empresa.nombre || !req.body.empresa.direccion || 
        !req.body.empresa.telefono || !req.body.empresa.correo) {
      return res.status(400).send({ message: 'Invalid request body. Missing empresa details.' });
    }

    // Create the Empresa document
    const empresaDoc = await Empresa.create({
      nombre: req.body.empresa.nombre,
      direccion: req.body.empresa.direccion,
      telefono: req.body.empresa.telefono,
      correo: req.body.empresa.correo,
    });

    console.log(`Empresa created successfully:`, empresaDoc);

    // Attach the Empresa ID for the creator
    req.body.empresa = empresaDoc._id; // Pass only the ObjectId
    req.createType = "empresa";

    const resultCreador = await createCreador(req);
    console.log("Creador Created:", resultCreador);

    if (!resultCreador) {
      return res.status(400).send("El usuario ya existe");
    }

    const response = {
      empresa: {
        nombre: empresaDoc.nombre,
        direccion: empresaDoc.direccion,
        telefono: empresaDoc.telefono,
        correo: empresaDoc.correo,
        creador: resultCreador.user._id,
      },
    };

    res.status(201).json(response);
  } catch (err) {
    console.error(`Error creating a new empresa: ${err}`);
    res.status(500).send({ message: 'Error creating a new empresa' });
  }
};






 const getEmpresas = (req, res) => { Empresa.find() .populate('creador') .then((empresaDocs) => { console.log("Empresas encontradas:", empresaDocs); res.send(empresaDocs); }) 
.catch((err) => { console.log("Error al buscar empresas", err); 
res.status(500).send({ message: 'Error al buscar empresas' }); }); }; 

//use this below to show empresa's name in perfil.jsx 
const getEmpresaByName = (req, res) => { const { nombre } = req.params; 
console.log('Nombre recibido:', nombre); Empresa.findOne({ nombre }) 
.populate('creador') .then((empresa) => { if (!empresa) {
 return res.status(404).send('Empresa no encontrada'); } res.send(empresa); }) 
.catch((err) => { console.error('Error al obtener la empresa:', err); res.status(500).send('Error en el servidor'); }); }; 

const updateEmpresa = async (req, res) => { try { const { id } = req.params; 
const updatedEmpresa = await Empresa.findByIdAndUpdate(id, req.body, { new: true }); 
if (!updatedEmpresa) { return res.status(404).json({ error: 'Empresa no encontrada' }); } res.json(updatedEmpresa); } 
catch (error) { console.log(`Error al actualizar la empresa: ${error}`); res.status(500).json({ error: 'Error en el servidor', details: error.message }); } }; 
const deleteEmpresa = async (req, res) => { try { const { id } = req.params; const deletedEmpresa = await Empresa.findByIdAndDelete(id);
 if (!deletedEmpresa) { return res.status(404).json({ error: 'Empresa no encontrada' }); } 
res.json({ message: 'Empresa eliminada correctamente' }); } catch (error) { console.log(`Error al eliminar la empresa: ${error}`); res.status(500).json({ error: 'Error en el servidor', details: error.message }); } }; 

const getEmpresaForUser = async (req, res) => { try { const { userId } = req.params; 
const empresa = await Empresa.findOne({ creador: userId }); if (!empresa) { return res.status(404).json({ error: 'No se encontró ninguna empresa para este usuario' }); } 
// Incluir solo el nombre de la empresa en la respuesta 
res.status(200).json({ empresaNombre: empresa.nombre }); } 
catch (error) { console.error(`Error al obtener la empresa del usuario: ${error}`); res.status(500).json({ error: 'Error en el servidor', details: error.message }); } }; 
module.exports = { createEmpresa, getEmpresas, getEmpresaByName, getEmpresaForUser, updateEmpresa, deleteEmpresa };
