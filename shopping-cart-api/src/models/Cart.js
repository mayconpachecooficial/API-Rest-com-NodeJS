const db = require('../config/db');

const Cart = {
  findCartItem: function(userId, produtoId, callback) {
    return db.query(
      'SELECT * FROM Carrinho WHERE usuario_id=? AND produto_id=?',
      [userId, produtoId],
      callback
    );
  },
  
  addItem: function(userId, produtoId, quantidade, callback) {
    return db.query(
      'INSERT INTO Carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)',
      [userId, produtoId, quantidade],
      callback
    );
  },
  
  updateQuantity: function(cartId, quantity, callback) {
    return db.query(
      'UPDATE Carrinho SET quantidade=? WHERE id=?',
      [quantity, cartId],
      callback
    );
  },
  
  removeItem: function(cartItemId, callback) {
    return db.query(
      'DELETE FROM Carrinho WHERE id=?',
      [cartItemId],
      callback
    );
  },
  
  listItems: function(userId, callback) {
    return db.query(
      'SELECT * FROM Carrinho WHERE usuario_id=?',
      [userId],
      callback
    );
  },
  
  clearCart: function(userId, callback) {
    return db.query(
      'DELETE FROM Carrinho WHERE usuario_id=?',
      [userId],
      callback
    );
  }
};

module.exports = Cart;
