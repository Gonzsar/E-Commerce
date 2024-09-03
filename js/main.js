let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const messages = [
    "¡Producto añadido!",
    "¡No olvides de ver nuestras nuevas ofertas!",
    "Tienes productos en tu carrito esperándote.",
    "¡No te vas a arrepentir de tus compras!",
    "¡Descuentos especiales que pueden ser tuyos!"
];

function addToCart(product, price) {
    const existingProduct = carrito.find(item => item.product === product);
    existingProduct ? existingProduct.quantity += 1 : carrito.push({ product, price, quantity: 1 });

    updateStorage();
    displayCart();
    showMessage(messages[Math.floor(Math.random() * messages.length)]);
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
    if (carrito[index]) {
        carrito.splice(index, 1);
        updateStorage();
        displayCart();
    }
}

function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.textContent = message;
    setTimeout(() => messagesDiv.textContent = '', 9000);
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
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire('¡Gracias por su compra!', '', 'success');
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

document.addEventListener('DOMContentLoaded', displayCart);

document.getElementById('cartButton').addEventListener('click', () => {
    document.getElementById('cart').classList.toggle('cart-open');
    document.getElementById('cart').classList.toggle('cart-closed');
});

document.getElementById('purchaseButton').addEventListener('click', purchaseCart);
