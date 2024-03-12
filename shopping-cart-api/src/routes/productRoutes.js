const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Listar todos os produtos
router.get('/', productController.listAll);

// Buscar um produto por ID
router.get('/:id', productController.findProductById);

// Criar um novo produto
router.post('/', productController.createProduct);

// Deletar um produto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
