const express = require('express');
const router = express.Router();
const { createEmpresa, getEmpresas, getEmpresaByName, updateEmpresa, deleteEmpresa } = require('../controller/empresa.controller');

router.post('/', createEmpresa);
router.get('/', getEmpresas);
router.get('/:nombre', getEmpresaByName); 
router.put('/:id', updateEmpresa);
router.delete('/:id', deleteEmpresa);

module.exports = router;
