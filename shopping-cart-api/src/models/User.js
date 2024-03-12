const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = {
  // Criar um novo usuário
  create: function(user, callback) {
    db.query(
      'INSERT INTO Usuario(nome, email, senha) VALUES(?, ?, ?)',
      [user.nome, user.email, user.senha],
      callback
    );
  },

  // Encontrar um usuário pelo e-mail
  findByEmail: function(email, callback) {
    db.query(
      'SELECT * FROM Usuario WHERE email = ?',
      [email],
      callback
    );
  },

  // Encontrar um usuário pelo ID
  findById: function(id, callback) {
    db.query(
      'SELECT * FROM Usuario WHERE id = ?',
      [id],
      callback
    );
  }
};

exports.register = async (req, res) => {
  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(req.body.senha, 8);

    // Criar um novo usuário
    const newUser = {
      nome: req.body.nome,
      email: req.body.email,
      senha: hashedPassword
    };

    // Salvar o usuário no banco de dados
    User.create(newUser, (err, user) => {
      if (err) {
        return res.status(500).send({ message: err });
      }
      // Gere um token com o ID do usuário
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 86400 // 24 horas
      });
      res.status(200).send({ auth: true, token });
    });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao registrar o usuário' });
  }
};

exports.login = (req, res) => {
  // Encontre o usuário pelo e-mail
  User.findByEmail(req.body.email, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
    }

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado' });
    }

    // Verifique se a senha está correta
    const passwordIsValid = await bcrypt.compare(req.body.senha, user.senha);

    if (!passwordIsValid) {
      return res.status(401).send({ auth: false, token: null });
    }

    // Se a senha estiver correta, crie um token
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400 // 24 horas
    });

    res.status(200).send({ auth: true, token });
  });
};

exports.userProfile = (req, res) => {
  // Obtenha o ID do usuário do token
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send({ auth: false, message: 'Nenhum token fornecido.' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Falha ao autenticar token.' });
    }

    // Se o token for válido, encontre o usuário pelo ID
    User.findById(decoded.id, (err, user) => {
      if (err) {
        return res.status(500).send({ message: 'Houve um problema em encontrar o usuário.' });
      }
      if (!user) {
        return res.status(404).send({ message: 'Usuário não encontrado.' });
      }
      res.status(200).send(user);
    });
  });
};

module.exports = User;