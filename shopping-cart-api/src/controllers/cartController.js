const Cart = require('../models/Cart');

// Aqui adiciona item ao carrinho
exports.addItem = async (req, res) => {
  try {
    const userId = req.userId; // Aqui o ID do usuário autenticado será atribuído pelo middleware de autenticação
    const { produtoId, quantidade } = req.body;

    // Aqui verifica se o item já está no carrinho
    Cart.findCartItem(userId, produtoId, (err, cartItem) => {
      if (err) {
        return res.status(500).send("Erro ao verificar o carrinho.");
      }

      if (cartItem) {
        // Se o item já estiver no carrinho, vai atualizar a quantidade
        const newQuantity = cartItem.quantidade + quantidade;
        Cart.updateQuantity(cartItem.id, newQuantity, (err, result) => {
          if (err) {
            return res.status(500).send("Erro ao atualizar a quantidade do item.");
          }
          res.status(200).send("Quantidade do item atualizada no carrinho.");
        });
      } else {
        // Se o item não estiver no carrinho, vai adicionar
        Cart.addItem({ userId, produtoId, quantidade }, (err, result) => {
          if (err) {
            return res.status(500).send("Erro ao adicionar o item ao carrinho.");
          }
          res.status(200).send("Item adicionado ao carrinho.");
        });
      }
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao adicionar o item ao carrinho.");
  }
};

// Aqui atualiza a quantidade de um item
exports.updateQuantity = async (req, res) => {
  try {
    const { cartId, quantidade } = req.body; // Aqui estou baseando que o ID do item no carrinho e a nova quantidade são enviados no corpo da requisição.
    Cart.updateQuantity(cartId, quantidade, (error, results) => {
      if (error) {
        res.status(500).send("Houve um problema ao atualizar a quantidade do item no carrinho.");
      } else {
        res.status(200).send("Quantidade do item atualizada com sucesso.");
      }
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao atualizar a quantidade do item no carrinho.");
  }
};

// Aqui remove o item do carrinho
exports.removeItem = async (req, res) => {
  try {
    const { cartItemId } = req.params; // Aqui estou baseando que o ID do item no carrinho vem nos parâmetros da URL.
    Cart.removeItem(cartItemId, (error, results) => {
      if (error) {
        res.status(500).send("Houve um problema ao remover o item do carrinho.");
      } else {
        res.status(200).send("Item removido do carrinho com sucesso.");
      }
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao remover o item do carrinho.");
  }
};

// Aqui lista itens do carrinho
exports.listCartItems = async (req, res) => {
  try {
    const userId = req.userId; // Aqui o ID do usuário autenticado deverá ser obtido através do middleware de autenticação
    Cart.listItems(userId, (error, items) => {
      if (error) {
        res.status(500).send("Houve um problema ao listar os itens do carrinho.");
      } else {
        res.status(200).json(items);
      }
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao listar os itens do carrinho.");
  }
};

// Aqui limpa o carrinho
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId; // ID do usuário autenticado.
    Cart.clearCart(userId, (error, results) => {
      if (error) {
        res.status(500).send("Houve um problema ao limpar o carrinho.");
      } else {
        res.status(200).send("Carrinho limpo com sucesso.");
      }
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao limpar o carrinho.");
  }
};
