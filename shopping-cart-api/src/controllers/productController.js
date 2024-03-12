const Product = require('../models/Product');

exports.listAll = (req, res) => {
  Product.findAll(function(err, products) {
    if (err) {
      res.json({status: "error", message: err});
    } else {
      res.json({status: "success", message: "Produtos listados com sucesso", data: products});
    }
  });
};

exports.findProductById = (req, res) => {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      res.json({status: "error", message: err});
    } else {
      res.json({status: "success", message: "Produto encontrado", data: product});
    }
  });
};

exports.createProduct = (req, res) => {
  const newProduct = {
    nome: req.body.nome,
    preco: req.body.preco,
    estoque: req.body.estoque
  };

  Product.create(newProduct, (error, results) => {
    if (error) {
      res.status(500).send({ message: "Erro ao adicionar produto", error });
    } else {
      res.status(201).send({ message: "Produto adicionado com sucesso", id: results.insertId });
    }
  });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  Product.delete(id, (error, results) => {
    if (error) {
      res.status(500).send({ message: "Erro ao deletar produto", error });
    } else {
      res.status(200).send({ message: "Produto deletado com sucesso" });
    }
  });
};