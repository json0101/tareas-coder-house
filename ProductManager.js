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

const main = async () => {
    const productManager = new ProductManager('./file/products.txt');
    await productManager.addProduct('Silla', 'Silla de bebe', 200, 'silla.png', '001', 1);
    await productManager.addProduct('Mesa', 'Mesa de bebe', 300, 'mesa.png', '002', 2);
    await productManager.addProduct('PS5', 'PS5 version digital', 100, 'ps5.png', '003', 3);
    // console.log((await productManager.getProductById(3)));
    await productManager.deleteProduct(3);
    // console.log((await productManager.getProductById(3)));

    await productManager.updateProduct(1, { title: 'cambio', description: 'Cambio prueba', price: 20000, thumbnail: 'prueba.png', code: '009', stock: 9});
}

main();