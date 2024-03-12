const db = require('../config/db');

const Product = {
  findAll: function(callback) {
    return db.query("SELECT * FROM Produto", callback);
  },
  findById: function(id, callback) {
    return db.query("SELECT * FROM Produto WHERE id=?", [id], callback);
  },
  create: function(product, callback) {
    return db.query(
      "INSERT INTO Produto (nome, preco, estoque) VALUES (?, ?, ?)",
      [product.nome, product.preco, product.estoque],
      callback
    );
  },
  delete: function(id, callback) {
    return db.query(
      "DELETE FROM Produto WHERE id=?",
      [id],
      callback
    );
  },
  // Aqui também pode adicionar mais funções caso necessário
};

module.exports = Product;
