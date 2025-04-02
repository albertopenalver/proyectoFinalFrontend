const Movimiento = require("../models/movimientos.model");
const product = require ("../models/product.model");
const Proveedor = require("../models/proveedor.model");
const sendEmail = require("../utils/sendEmail");
const GuardarMovimientos = require("../models/guardarmovimientos.model");
const jwt = require('jsonwebtoken');

  const registrarMovimientos = async (req, res) => {
    try {
        const { empresa } = req.body;
        const productosMovimientos = req.body.productos;
        if (!productosMovimientos || !Array.isArray(productosMovimientos) || productosMovimientos.length === 0) {
            return res.status(400).json({ mensaje: "Debe proporcionar al menos un producto para el movimiento" });
        }
        const movimientosRegistrados = [];
      
        for (const item of productosMovimientos) {
            const { producto, cantidadmov, tipo, proveedor } = item;
            const productoEncontrado = await product.findById(producto);
            if (!productoEncontrado) {
                return res.status(404).json({ mensaje: `Producto con ID ${producto} no encontrado` });
            }

            const movimiento = new Movimiento({
                producto,
                cantidadmov,
                tipo,
                proveedor: proveedor || null,
            });
            await movimiento.save();
            movimientosRegistrados.push(movimiento);
        }

        const conjuntoMovimientos = new GuardarMovimientos({
            movimiento: movimientosRegistrados.map((mov) => mov._id),
            empresa: empresa,
        });
        await conjuntoMovimientos.save();
        res.status(201).json({
            mensaje: "Movimientos registrados y agrupados correctamente",
            conjunto: conjuntoMovimientos,
            movimientos: movimientosRegistrados
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
    }
};
const actualizarInventario = async (req, res) => {
  try {
      const productosMovimientos = req.body.productos;
      if (!productosMovimientos || !Array.isArray(productosMovimientos) || productosMovimientos.length === 0) {
          return res.status(400).json({ mensaje: "Debe proporcionar al menos un producto para actualizar el inventario" });
      }
      for (const item of productosMovimientos) {
          const { producto, cantidadmov, tipo } = item;
          const productoEncontrado = await product.findById(producto);
          if (!productoEncontrado) {
              return res.status(404).json({ mensaje: `Producto con ID ${producto} no encontrado` });
          }
          let nuevaCantidad;
          if (tipo === "entrada") {
              nuevaCantidad = productoEncontrado.cantidad + cantidadmov;
          } else if (tipo === "salida") {
              nuevaCantidad = productoEncontrado.cantidad - cantidadmov;
              if (nuevaCantidad < 0) {
                  return res.status(400).json({ mensaje: `Stock insuficiente para el producto con ID ${producto}` });
              }
          } else {
              return res.status(400).json({ mensaje: `Tipo de movimiento inválido para el producto con ID ${producto}` });
          }

          productoEncontrado.cantidad = nuevaCantidad;
          await productoEncontrado.save();
      }
      res.status(200).json({ mensaje: "Inventario actualizado correctamente" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
  }
};
const obtenerMovimientosGuardados = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {

    return res.status(401).send({ message: 'No se proporcionó un token válido.' });

  }
  try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const empresaId = decoded.empresa; 
        const conjuntosMovimientos = await GuardarMovimientos.find({ empresa: empresaId})
      .populate({
        path: 'movimiento',
        populate: {
          path: 'producto',
          select: 'nombre',
        },
      })
      .sort({ createdAt: -1 });
    if (!conjuntosMovimientos || conjuntosMovimientos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron conjuntos de movimientos" });
    }

    res.status(200).json(
      conjuntosMovimientos.map(conjunto => ({
        id: conjunto._id,
        movimientos: conjunto.movimiento.map(mov => ({
          id: mov._id,
          producto: mov.producto?.nombre || "N/A",
          cantidad: mov.cantidadmov,
          fecha: mov.createdAt,
          tipo: mov.tipo,
          estado: mov.estado, 
        })),
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los conjuntos de movimientos", error: error.message });
  }
};

const obtenerMovimientosEntrada = async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send({ message: 'No se proporcionó un token válido.' });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const empresaId = decoded.empresa;
    const conjuntosMovimientos = await GuardarMovimientos.find({ empresa: empresaId })
      .populate({
        path: 'movimiento',
        match: { tipo: 'entrada' }, 
        populate: {
          path: 'producto',
          select: 'nombre', 
        },
      })
      .sort({ createdAt: -1 });

    if (!conjuntosMovimientos || conjuntosMovimientos.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron movimientos de entrada." });
    }

    const respuesta = conjuntosMovimientos.map((conjunto) => ({
      id: conjunto._id,
      movimientos: conjunto.movimiento.map((mov) => ({
        id: mov._id,
        producto: mov.producto?.nombre || "N/A",
        cantidad: mov.cantidadmov,
        fecha: mov.createdAt,
        estado: mov.estado,
      })),
    }));

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al obtener movimientos de entrada:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener los movimientos de entrada.",
      error: error.message,
    });
  }
};

  const enviarMailProveedor = async (req, res) => {
    const { proveedorEmail, cuerpoCorreo } = req.body;
    if (!proveedorEmail) {
      return res.status(200).json({ mensaje: 'Movimientos registrados. No se envió correo porque no se proporcionó dirección de email.' });
    }
    const emailContent = `
      <h1>Solicitud de compra</h1>
      <p>Estimado proveedor,</p>
      <p>Se ha registrado una solicitud de compra. Los detalles son los siguientes:</p>
      ${cuerpoCorreo}
      <p>Saludos,</p>
      <p>Equipo Amarillo</p>
    `;
    try {
      await sendEmail({
        to: proveedorEmail,
        subject: 'Solicitud de Compra',
        html: emailContent,
      });
      res.status(200).json({ mensaje: 'Correo enviado correctamente.' });
    } catch (error) {
      console.error("Error al enviar correo:", error.message);
      res.status(500).json({ mensaje: 'Error al enviar correo', error: error.message });
    }
  };
  const cambiarEstadoMovimiento = async (req, res) => {
    try {
        const { idMovimiento, nuevoEstado } = req.body;
        if (!["aprobado", "rechazado"].includes(nuevoEstado)) {
            return res.status(400).json({ mensaje: "Estado inválido. Debe ser 'aprobado' o 'rechazado'." });
        }
        const movimiento = await Movimiento.findById(idMovimiento);
        if (!movimiento) {
            return res.status(404).json({ mensaje: "Movimiento no encontrado." });
        }
        movimiento.estado = nuevoEstado;
        // Si se aprueba, actualizar el inventario
        if (nuevoEstado === "aprobado") {
            const producto = await product.findById(movimiento.producto);
            if (!producto) {
                return res.status(404).json({ mensaje: "Producto no encontrado." });
            }
            if (movimiento.tipo === "entrada") {
                producto.cantidad += movimiento.cantidadmov;
            } else if (movimiento.tipo === "salida") {
                if (producto.cantidad < movimiento.cantidadmov) {
                    return res.status(400).json({ mensaje: "Stock insuficiente para aprobar el movimiento." });
                }
                producto.cantidad -= movimiento.cantidadmov;
            }
            await producto.save();
        }
        await movimiento.save();
        res.status(200).json({ mensaje: "Estado del movimiento actualizado correctamente.", movimiento });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al cambiar el estado del movimiento.", error: error.message });
    }
};
module.exports = { registrarMovimientos, enviarMailProveedor, actualizarInventario, obtenerMovimientosGuardados, cambiarEstadoMovimiento, obtenerMovimientosEntrada };