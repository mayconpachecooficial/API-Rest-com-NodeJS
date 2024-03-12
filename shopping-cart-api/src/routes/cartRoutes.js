const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/auth');

// Rota para adicionar um item ao carrinho
router.post('/add', verifyToken, cartController.addItem);

// Rota para atualizar a quantidade de um item no carrinho
router.put('/update/:id', verifyToken, cartController.updateQuantity);

// Rota para remover um item do carrinho
router.delete('/remove/:id', verifyToken, cartController.removeItem);

// Rota para limpar o carrinho
router.delete('/clear', verifyToken, cartController.clearCart);

// Rota para listar todos os itens no carrinho
router.get('/', verifyToken, cartController.listCartItems);

module.exports = router;
