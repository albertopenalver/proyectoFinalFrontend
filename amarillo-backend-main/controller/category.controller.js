const Categoria = require ("../models/category.model");
const jwt = require('jsonwebtoken');


const crearCategoria = async (req, res) => {
    try {
      const { nombre, categoriaPadre,empresa  } = req.body;
  
      if (!nombre) {
        return res.status(400).json({ mensaje: 'El nombre de la categoría es obligatorio.' });
      }
  
      const nuevaCategoria = new Categoria({
        nombre,
        categoriaPadre: categoriaPadre || null ,
        empresa:empresa
      });

      const categoriaGuardada = await nuevaCategoria.save();
  
      res.status(201).json({ mensaje: 'Categoría creada con éxito.', categoria: categoriaGuardada });
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      res.status(500).json({ mensaje: 'Error del servidor al crear la categoría.' });
    }
  };

  function getCategories(req, res) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token válido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const empresaId = decoded.empresa; 

        Categoria.find({ isDeleted: false, empresa: empresaId  })
            .then((categoryDocs) => {
                res.send(categoryDocs); 
            })
            .catch((err) => {
                console.log("Error al buscar categorías:", err);
                res.status(500).send({ message: 'Error al buscar categorías' });
            });
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(401).send({ message: 'Token inválido o expirado.' });
    }
}

const getCategoryById = (req, res) => {
    const { id } = req.params; 
  
    Categoria.findById(id)
      .then((Categoria) => {
        if (!Categoria) {
          return res.status(404).send('Categoria no encontrada');
        }
        res.send(Categoria);
      })
      .catch((err) => {
        console.log('Error al obtener categoria:', err);
        res.status(500).send('Error en el servidor');
      });
  };

const softDeleteCategory = async (req, res) => {
    const { id } = req.params;

    try {

        const updatedCategory = await Categoria.findByIdAndUpdate(
            id,
            {
                isDeleted: true, 
                deletedAt: new Date() 
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).send("La categoria no existe"); 
        }

        res.send(updatedCategory);

    } catch (err) {
        console.log('Error:', err);
        res.status(500).send({ message: 'Error al eliminar categoria' });
    }
};

const updateCategory = (req, res) => {
    const { id } = req.params; 
 
    Categoria.findByIdAndUpdate(
      id,                
      req.body,          
      { new: true }      
    )
    .then((editCategory) => {
      res.send(editCategory); 
      console.log('Categoria modificada:', editCategory); 
    })
    .catch((err) => {
      console.log('Error al actualizar el categoria:', err);
      res.status(500).send('Error en el servidor');
    });
  };

  const getCategoriesByParent = async (req, res) => {
    const { categoriaPadreId } = req.params; 

    try {
        const categoriasHijas = await Categoria.find({
            categoriaPadre: categoriaPadreId, 
            isDeleted: false 
        });

        if (categoriasHijas.length === 0) {
            return res.status(404).send('No se encontraron categorías con este padre.');
        }

        res.status(200).json(categoriasHijas); 
    } catch (error) {
        console.error('Error al obtener las categorías por padre:', error);
        res.status(500).json({ mensaje: 'Error del servidor al obtener las categorías.' });
    }
};
const obtenerCategoriasSinPadre = async (req, res) => {
  try {

    const categoriasSinPadre = await Categoria.find({ categoriaPadre: null, isDeleted: false });
    res.json(categoriasSinPadre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las categorías sin padre' });
  }
};
const deleteAllCategory = async (req, res) => {
  try {
    await Categoria.deleteMany({});
    res.status(200).json({ message: 'Todas las categorias han sido eliminados.' });
  } catch (error) {
    console.error('Error al eliminar las categorias:', error);
    res.status(500).json({ error: 'Error al eliminar las categorias.' });
  }
};
  
  module.exports = { crearCategoria, getCategories, getCategoryById, softDeleteCategory, updateCategory, getCategoriesByParent,deleteAllCategory,obtenerCategoriasSinPadre};