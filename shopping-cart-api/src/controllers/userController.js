const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registrar usuário
exports.register = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 8);

    // Criação do usuário
    User.create({
      nome: req.body.nome,
      email: req.body.email,
      senha: hashedPassword,
    }, (err, user) => {
      if (err) return res.status(500).send("Houve um problema ao registrar o usuário.");

      // Criação do token
      const token = jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 86400 // expira em 24 horas
      });

      res.status(200).send({ auth: true, token: token });
    });
  } catch (error) {
    res.status(500).send("Houve um problema ao registrar o usuário.");
  }
};

// Login do usuário
exports.login = async (req, res) => {
  User.findByEmail(req.body.email, async (err, user) => {
    if (err) return res.status(500).send('Erro no servidor.');
    if (!user) return res.status(404).send('Usuário não encontrado.');

    const passwordIsValid = await bcrypt.compare(req.body.senha, user.senha);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400 // expira em 24 horas
    });

    res.status(200).send({ auth: true, token: token });
  });
};
