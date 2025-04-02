const product = require("../models/product.model");
const Categoria = require ("../models/category.model");
const Proveedor = require ("../models/proveedor.model");
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken');

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
  })

  const createProduct = async (req, res) => {
	try {
	  // Extraemos los parámetros del cuerpo de la solicitud
	  const { categoria, cantidad, nombre, proveedor, foto,empresa } = req.body;
  
	  // Creamos un nuevo producto con los datos proporcionados
	  const newProduct = await product.create({
		
		categoria,
		cantidad,
		nombre,
		proveedor,
		foto,
		isDeleted: false, 
		empresa:empresa
	  });
  
	  res.status(201).json(newProduct);
	} catch (error) {
	
	  console.error('Error al crear el producto:', error);

	  res.status(500).json({ message: 'Error al crear el producto' });
	}
  };
  

  function getProducts(req, res) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token válido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const empresaId = decoded.empresa;

        product.find({ isDeleted: false, empresa: empresaId })
            .populate('proveedor')
            .populate('categoria')
            .then((productDocs) => {
                if (productDocs.length === 0) {
                    return res.status(404).send({ message: 'No se encontraron productos para esta empresa.' });
                }
                res.send(productDocs);
            })
            .catch((err) => {
                console.error('Error al buscar productos:', err);
                res.status(500).send({ message: 'Error al buscar productos' });
            });
    } catch (err) {
        console.error('Error al verificar el token:', err);
        res.status(403).send({ message: 'Token inválido o expirado.' });
    }
}


	const softDeleteProduct = async (req, res) => {
		const { id } = req.params;
		try {
			const updatedProduct = await product.findByIdAndUpdate(
				id,
				{
					isDeleted: true, 
					deletedAt: new Date() 
				},
				{ new: true }
			);
	
			if (!updatedProduct) {
				return res.status(404).send("El producto no existe"); 
			}
	
			res.send(updatedProduct);
		} catch (err) {
			console.log('Error:', err);
			res.status(500).send({ message: 'Error al eliminar el producto' });
		}
	};

	
	const getProductById = (req, res) => {
		const { id } = req.params;
	  
		product.findById(id)
		  .then((product) => {
			if (!product) {
			  return res.status(404).send('Producto no encontrado');
			}
			res.send(product);
		  })
		  .catch((err) => {
			console.log('Error al obtener el producto:', err);
			res.status(500).send('Error en el servidor');
		  });
	  };

	const updateProduct = (req, res) => {
		const { id } = req.params; 	 
		product.findByIdAndUpdate(
		  id,                
		  req.body,          
		  { new: true }      
		)
		.then((editProduct) => {
		  res.send(editProduct);
		})
		.catch((err) => {
		  console.log('Error al actualizar el producto:', err);
		  res.status(500).send('Error en el servidor');
		});
	  };
		
	  const getProductsByCategoryName = async (req, res) => {
		try {
		  const { categoryName } = req.params; 
		  
		  const category = await Categoria.findOne({ nombre: { $regex: new RegExp(categoryName, 'i') } }); 
		  
		  if (!category) {
			return res.status(404).json({ message: 'Categoría no encontrada' });
		  }
	  
		  const products = await product.find({ categoria: category._id, isDeleted: false });
	  
		  if (products.length === 0) {
			return res.status(404).json({ message: 'No hay productos en esta categoría' });
		  }
	  
		  res.status(200).json(products);
		} catch (error) {
		  console.error('Error al obtener productos por categoría:', error);
		  res.status(500).json({ message: 'Error al obtener productos por categoría' });
		}
	  };
	  const getProductsByProveedorName = async (req, res) => {
		try {
		  const { proveedorName } = req.params; 
		  
		  const proveedor = await Proveedor.findOne({ nombre: { $regex: new RegExp(proveedorName, 'i') } }); //Tiene en cuenta mayusculas y minusculas
		  
		  if (!proveedor) {
			return res.status(404).json({ message: 'Proveedor no encontrado' });
		  }
	  
		  const products = await product.find({ proveedor: proveedor._id, isDeleted: false });
	  
		  if (products.length === 0) {
			return res.status(404).json({ message: 'No hay productos con ese proveedor' });
		  }
	  
		  res.status(200).json(products);
		} catch (error) {
		  console.error('Error al obtener productos por categoría:', error);
		  res.status(500).json({ message: 'Error al obtener productos por proveedor' });
		}
	  };

	  const getProductsByName = async (req, res) => {
		try {
		  const { productName } = req.params; 
	  
		  const products = await product.find({ 
			nombre: { $regex: new RegExp(productName, 'i') },
			isDeleted: false 
		  });
	  
		  if (products.length === 0) {
			return res.status(404).json({ message: 'No se encontraron productos con ese nombre' });
		  }
	  
		  res.status(200).json(products);
		} catch (error) {
		  console.error('Error al obtener productos por nombre:', error);
		  res.status(500).json({ message: 'Error al obtener productos por nombre' });
		}
	  };

	  const deleteAllProducts = async (req, res) => {
		try {
		  await product.deleteMany({}); 
		  res.status(200).json({ message: 'Todos los productos han sido eliminados.' });
		} catch (error) {
		  console.error('Error al eliminar los productos:', error);
		  res.status(500).json({ error: 'Error al eliminar los productos.' });
		}
	  };
	  const fs = require('fs');
	  const updateProductPhoto = async (req, res) => {
		try {

		  const result = await cloudinary.uploader.upload(req.file.path);
	  
		  
		  const imageUrl = result.secure_url;
	  
		  const updatedProduct = await product.findByIdAndUpdate(
			req.params.id, 
			{ foto: imageUrl }, 
			{ new: true } 
		  );

		  fs.unlink(req.file.path, (err) => {
			if (err) {
			  console.error('Error al eliminar el archivo temporal:', err);
			} else {
			  console.log('Archivo temporal eliminado:', req.file.path);
			}
		  });
	  
		  if (!updatedProduct) {
			return res.status(404).json({ message: 'Producto no encontrado' });
		  }
	  
		  
		  return res.json(updatedProduct);
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ message: 'Error al actualizar la foto del producto' });
		}
	  };
	  

module.exports = { createProduct, getProducts , softDeleteProduct, getProductById, softDeleteProduct, updateProduct, getProductsByCategoryName, getProductsByProveedorName, getProductsByName,deleteAllProducts,updateProductPhoto };

