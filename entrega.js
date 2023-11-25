const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = 8080;

app.use(bodyParser.json());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const productManager = new ProductManager('products.json');
const cartManager = new CartManager('carts.json', productManager);


const productsRouter = express.Router();



app.use('/api/products', productsRouter);


const cartsRouter = express.Router();



app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});


io.on('connection', (socket) => {
  console.log('Usuario conectado');

 
  socket.emit('updateProducts', productManager.getProducts());
});


server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
