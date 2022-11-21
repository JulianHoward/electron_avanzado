
const productForm = document.getElementById('productForm');

const { remote } = require('electron')
const main = remote.require('./main')



const productName = document.getElementById('name');
const productPrice = document.getElementById('price');
const productDescription = document.getElementById('description');
const productsList = document.getElementById('products')

let products = []
let editStatus = false;
let editProductId = '';


productForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    
    const newProduct = {
        name: productName.value,
        price: productPrice.value,
        description: productDescription.value
    }

    if(!editStatus){
        const result = await main.createProduct(newProduct)
        console.log(result)
    }else{
        await main.updateProduct(editProductId, newProduct);
        editStatus = false;
        editProductId = '';
    }
    
    

    productForm.reset();
    productName.focus();

    getProducts();
})

async function deleteProduct(id){
    const responde = confirm('Seguro de eliminar?');
    if(responde){
        await main.deleteProduct(id);
        await getProducts();
    }
    return;
}

async function editProduct(id){
    const producto = await main.getProductById(id);
    productName.value = producto.name;
    productPrice.value = producto.price;
    productDescription.value = producto.description;

    editStatus = true;
    editProductId = producto.id;
}

function renderProductos(products){
    productsList.innerHTML = '';
    products.forEach(product =>{
        productsList.innerHTML += `
            <div class="card card-body my-2">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <h3>${product.price}</h3>
                <p>
                    <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
                        DELETE
                    </button>
                    <button class="btn btn-secondary" onclick="editProduct('${product.id}')">
                        EDIT
                    </button>
                </p>
            </div>
        `;
    })
}

const getProducts = async() =>{
    products = await main.getProducts();
    renderProductos(products);
}

async function init(){
    await getProducts();
}

init();