const fs = require('fs');

class ProductManager {
    #path
    #format
    constructor(path) {
        this.#path = path;
        this.#format = 'utf-8';
    }

    async #getNextId() {
        const products = await this.getProducts();
        const id = products.length === 0? 1 : (+products[products.length-1].id + 1);
        return id;
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        const p = {
            id: await this.#getNextId(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        const products = await this.getProducts();
        products.push(p);
        return fs.promises.writeFile(this.#path, JSON.stringify(products));
    }

    async getProducts() {
        return fs.promises.readFile(this.#path, this.#format)
            .then(content => JSON.parse(content))
            .catch(e => {
                return [];
            })
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(pro => pro.id === id);
    }

    async updateProduct(idToFind, newProduct) {
        const products = await this.getProducts();
        const {id, ...rest} = newProduct;
        const productsNew = products.map(p => {            
            return p.id === idToFind? {id: p.id, ...rest}: p;
        });
        return fs.promises.writeFile(this.#path, JSON.stringify(productsNew));
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productsNew = products.filter(p => p.id !== id);
        return fs.promises.writeFile(this.#path, JSON.stringify(productsNew));
    }
}

// const main = async () => {
//     const productManager = new ProductManager('./file/products.txt');
//     await productManager.addProduct('Lapto', 'Dell', 2000, 'lapto.png', '210', 1);
//     await productManager.addProduct('Teclado', 'HP', 50, 'teclado.png', '211', 2);
//     await productManager.addProduct('Mouse', 'Microsoft', 75, 'mouse.png', '212', 3);
//     await productManager.addProduct('Monitor', 'Monitor marca hp', 400, 'monitor.png', '213', 1);
//     await productManager.addProduct('Legend of Zelda', 'Juego de nintendo', 200, 'zelda.png', '101', 2);
//     await productManager.addProduct('Pokemon Purpura', 'Nuevo juego', 150, 'purpura.png', '102', 3);
//     await productManager.addProduct('Pokemon Escarlata', 'Juego de nintendo', 150, 'escarlata.png', '103', 2);
//     await productManager.addProduct('Mochila', 'mochila de montaña', 125, 'mochila.png', '062', 3);
// }

// main();

module.exports = ProductManager;