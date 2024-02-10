const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.error('Error al cargar los productos:', error.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar los productos:', error.message);
        }
    }

    addProduct({ title, description, price, thumbnail, code, stock }) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Error: Todos los campos son obligatorios.");
        }

        const id = this.generateUniqueId();
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(productId) {
        const product = this.products.find(product => product.id === productId);

        if (!product) {
            console.error("Error: Producto no encontrado.");
            return null;
        }

        return product;
    }

    updateProduct(productId, updatedFields) {
        const index = this.products.findIndex(product => product.id === productId);

        if (index === -1) {
            throw new Error("Error: Producto no encontrado.");
        }

        this.products[index] = { ...this.products[index], ...updatedFields };
        this.saveProducts();
    }

    deleteProduct(productId) {
        this.products = this.products.filter(product => product.id !== productId);
        this.saveProducts();
    }

    generateUniqueId() {
        return this.products.length + 1;
    }
}

const productManager = new ProductManager('productos.json');

try {
    const iphone12 = productManager.addProduct({
        title: "iPhone 12",
        description: "El último modelo de iPhone con pantalla Super Retina XDR y chip A14 Bionic.",
        price: 999,
        thumbnail: "/images/iphone12.jpg",
        code: "IP12",
        stock: 20,
    });

    const samsungGalaxyS21 = productManager.addProduct({
        title: "Samsung Galaxy S21",
        description: "Potente teléfono Android con pantalla Dynamic AMOLED 2X y cámara triple.",
        price: 899,
        thumbnail: "/images/samsungS21.jpg",
        code: "S21",
        stock: 15,
    });

    const allProducts = productManager.getProducts();
    console.log("Todos los teléfonos disponibles:", allProducts);

    const foundProduct = productManager.getProductById(iphone12.id);
    console.log("Teléfono encontrado por ID:", foundProduct);

    productManager.updateProduct(iphone12.id, { price: 1099 });
    console.log("Precio actualizado del iPhone 12");

    productManager.deleteProduct(samsungGalaxyS21.id);
    console.log("Producto Samsung Galaxy S21 eliminado");

} catch (error) {
    console.error(error.message);
}
