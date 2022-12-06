const express = require('express');

const app = new express();
const ProductManager = require('./ProductManager');
const productManager = new ProductManager('./file/products.txt');

app.get('/products',async (req, res) => {
    const {limit} = req.query;
    let products = await productManager.getProducts();

    if (limit)
        products = products.slice(0,limit);

    res.send(products);
});

app.get('/products/:pid',async (req, res) => {
    const {pid} = req.params;
    console.log(pid);
    let product = await productManager.getProductById(+pid);

    res.send(product);
});

app.listen(8080, () => {
    console.log("Ejecutando en el puerto 8080");
})