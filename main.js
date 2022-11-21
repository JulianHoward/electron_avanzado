
const { BrowserWindow, Notification } = require('electron')
const { getConnection } = require('./database')

async function createProduct(product) {
    try {
        const conn = await getConnection();
        product.price = parseFloat(product.price)
        const resultado = await conn.query('INSERT INTO productos SET ?', product)

        new Notification({
            title: 'Electron-MySQL',
            body: 'Nuevo Producto Guardado Exitosamente'
        }).show();

        product.id = resultado.insertId;
        return product;

    } catch (error) {
        console.log(error)
    }
}

async function getProducts(){
    const conn = await getConnection();
    const resultados = await conn.query('SELECT * FROM productos ORDER BY id DESC');
    console.log(resultados);
    return resultados;
}

async function deleteProduct(id){
    const conn = await getConnection();
    const resultados = await conn.query('DELETE FROM productos WHERE id = ?', id);
    console.log(resultados)
    return resultados;
}


async function getProductById(id){
    const conn = await getConnection();
    const resultados = await conn.query('SELECT * FROM productos WHERE id = ?', id);
    return resultados[0];
}

async function updateProduct(id, product){
    const conn = await getConnection();
    const resultados = await conn.query('UPDATE productos SET ? WHERE id = ?', [product, id]);
    console.log(resultados);
}

let window

function createWindow(){
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    window.loadFile('src/ui/index.html')
}

module.exports = {
    createWindow,
    createProduct,
    getProducts,
    deleteProduct,
    getProductById,
    updateProduct
}