const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const app = express();

// Middlewares
const verifyToken = require('./middleware/auth');

// Body parser para ler JSON no corpo da requisição
app.use(express.json());

// Serve os arquivos estáticos localizados no diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Importação das rotas
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes'); 

// Configuração das rotas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', verifyToken, cartRoutes); // A rota do carrinho está protegida pelo verifyToken

// Rota protegida de perfil do usuário
app.get('/api/profile', verifyToken, (req, res) => {
    // Este endpoint agora é protegido, o token JWT deve ser enviado no cabeçalho da requisição
    res.json({ message: 'Perfil do usuário', user: req.user });
});

// Diretório 'public' na raiz do projeto
app.use(express.static(path.join(__dirname, '..', 'public')));

// Seguindo pela rota...
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Middleware para lidar com erros 404 - Página Não Encontrada
app.use((req, res, next) => {
    res.status(404).send("Desculpe, não conseguimos encontrar isso!");
});

// Middleware para lidar com outros erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo quebrou!');
});

// Define a porta e inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
