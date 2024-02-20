const express = require('express');
const ProductManager = require('./ProductManager');

class ServerBase {
    constructor(port, filePath) {
        this.port = port;
        this.filePath = filePath;
        this.app = express();
        this.productManager = new ProductManager(filePath);
        this.setupRoutes();
    }

    setupRoutes() {
        const app = this.app;
        const productManager = this.productManager;

        app.use(express.json());

        app.get('/productos.json', (req, res) => {
            try {
                const products = productManager.getProducts();
                res.json(products);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        

        app.get('/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                const product = productManager.getProductById(productId);
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Product not found' });
                }
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        app.post('/products', (req, res) => {
            try {
                const { title, description, price, thumbnail, code, stock } = req.body;
                const newProduct = productManager.addProduct({ title, description, price, thumbnail, code, stock });
                res.status(201).json(newProduct);
            } catch (error) {
                res.status(400).json({ error: error.message });
            }
        });

        app.delete('/products/:pid', (req, res) => {
            try {
                const productId = req.params.pid;
                productManager.deleteProduct(productId);
                res.json({ message: 'Product deleted successfully' });
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        

        app.use((req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is listening at http://localhost:${this.port}`);
        });
    }
}

module.exports = ServerBase;