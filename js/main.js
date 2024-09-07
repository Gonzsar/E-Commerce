
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let loggedIn = false;  // Controla si el usuario está autenticado

document.addEventListener('DOMContentLoaded', () => {
    if (!loggedIn) {
        disableCartFeatures();
    }
    displayCart();
    fetchProducts();
});

// Función para deshabilitar las funcionalidades del carrito
function disableCartFeatures() {
    const cartBtn = document.getElementById('cartButton');
    cartBtn.style.pointerEvents = 'none'; 
    cartBtn.style.opacity = '0.5';

    const productButtons = document.querySelectorAll('.add-to-cart-btn');
    productButtons.forEach(button => {
        button.disabled = true; 
        button.style.opacity = '0.5';
    });
}

// Función para habilitar las funcionalidades del carrito después del inicio de sesión
function enableCartFeatures() {
    const cartBtn = document.getElementById('cartButton');
    cartBtn.style.pointerEvents = 'auto';
    cartBtn.style.opacity = '1';

    const productButtons = document.querySelectorAll('.add-to-cart-btn');
    productButtons.forEach(button => {
        button.disabled = false; 
        button.style.opacity = '1';
    });
}

document.getElementById('loginBtn').addEventListener('click', () => {
    Swal.fire({
        title: 'Iniciar Sesión',
        text: 'Por favor, ingresa tu nombre:',
        input: 'text',
        inputPlaceholder: 'Tu nombre',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingresa un nombre';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let userName = result.value;
            document.getElementById('welcomeMessage').textContent = `Bienvenido, ${userName}!`;
            document.getElementById('welcomeMessage').style.display = 'inline';
            document.getElementById('loginBtn').style.display = 'none'; 

            // Cambia el estado de sesión
            loggedIn = true;

            Swal.fire({
                title: '¡Perfecto!',
                text: 'Ya puedes añadir productos a tu carrito',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            enableCartFeatures();
        }
    });
});

async function fetchProducts() {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    if (!productList) {
        console.error('El elemento con ID productList no está en el DOM');
        return;
    }
    productList.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-item';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>Precio: $${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-product="${product.name}" data-price="${product.price}">Añadir al carrito</button>
        `;
        productList.appendChild(div);
    });

    addAddToCartListeners(); 
}

function addAddToCartListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            if (!loggedIn) {
                Swal.fire({
                    title: 'Inicia Sesión',
                    text: 'Debes iniciar sesión para añadir productos al carrito.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
                return;  // No añadir el producto si no está autenticado
            }

            const product = event.target.dataset.product;
            const price = parseFloat(event.target.dataset.price);
            if (!product || isNaN(price)) {
                console.error('Error al agregar el producto. Datos inválidos.');
                return;
            }
            addToCart(product, price);
        });
    });
}

function addToCart(product, price) {
    const existingProduct = carrito.find(item => item.product === product);
    existingProduct ? existingProduct.quantity += 1 : carrito.push({ product, price, quantity: 1 });

    updateStorage();
    displayCart();

    Toastify({
        text: `${product} se añadió al carrito`,
        duration: 2000,
        close: true,
        gravity: "top",
        position: "left",
        backgroundColor: "#28a745",
        stopOnFocus: true,
        style: {
            borderRadius: "8px",
            color: "white",
            padding: "15px"
        },
        onClick: function(){}
    }).showToast();

    logPurchase(product, price);
}


function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    
    let totalPrice = carrito.reduce((sum, { product, price, quantity }, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${product} - $${price.toFixed(2)} x ${quantity}
            <button class="remove-one-btn" data-index="${index}">Quitar uno</button>
            <button class="remove-all-btn" data-index="${index}">Quitar todos</button>
        `;
        cartItems.appendChild(li);
        return sum + price * quantity;
    }, 0);

    total.innerText = totalPrice.toFixed(2);
    addRemoveEventListeners();
}

function addRemoveEventListeners() {
    document.querySelectorAll('.remove-one-btn').forEach(button => {
        button.addEventListener('click', ({ target }) => removeOneFromCart(target.dataset.index));
    });
    document.querySelectorAll('.remove-all-btn').forEach(button => {
        button.addEventListener('click', ({ target }) => removeAllFromCart(target.dataset.index));
    });
}

function removeOneFromCart(index) {
    if (carrito[index]) {
        carrito[index].quantity > 1 ? carrito[index].quantity -= 1 : carrito.splice(index, 1);
        updateStorage();
        displayCart();
    }
}

function removeAllFromCart(index) {
    if (!carrito[index]) {
        console.error(`El producto en el índice ${index} no existe en el carrito.`);
        return;
    }
    carrito.splice(index, 1);
    updateStorage();
    displayCart();
}

function logPurchase(product, price) {
    console.log(`Producto añadido: ${product} - $${price.toFixed(2)}`);
    console.log('Carrito actual:', carrito);
}

function purchaseCart() {
    if (!carrito.length) {
        return Swal.fire({
            title: "Carrito vacío",
            text: "Añade productos al carrito.",
            icon: "warning"
        });
    }

    Swal.fire({
        title: "Selecciona tu método de pago",
        input: 'radio',
        inputOptions: {
            tarjeta: 'Tarjeta (10% de descuento)',
            efectivo: 'Efectivo'
        },
        inputValidator: (value) => {
            if (!value) {
                return 'Debes seleccionar una opción';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            let total = calculateTotal(result.value);
            Swal.fire({
                title: "Confirmación de compra",
                text: `Total a pagar: $${total.toFixed(2)}`,
                icon: "success",
                showCancelButton: true,
                confirmButtonText: 'Pagar',
                cancelButtonText: 'Cancelar'
            }).then((result2) => {
                if (result2.isConfirmed) {
                    let message = result.value === 'efectivo' 
                        ? '¡Lo esperamos en nuestro local más cercano!'
                        : '¡Gracias por su compra!';

                    Swal.fire(message, '', 'success');
                    console.log('Compra completa:', carrito);

                    carrito = [];
                    updateStorage();
                    displayCart();
                }
            });
        }
    });
}

function calculateTotal(paymentMethod) {
    let total = carrito.reduce((sum, { price, quantity }) => sum + price * quantity, 0);
    if (paymentMethod === 'tarjeta') {
        total *= 0.90; // 10% de descuento
    }
    return total;
}

function updateStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

document.getElementById('cartButton').addEventListener('click', () => {
    document.getElementById('cart').classList.toggle('cart-open');
    document.getElementById('cart').classList.toggle('cart-closed');
});

document.getElementById('purchaseBtn').addEventListener('click', purchaseCart);
