let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const messages = [
    "¡Producto añadido!",
    "¡No olvides de ver nuestras nuevas ofertas!",
    "Tienes productos en tu carrito esperándote.",
    "¡No te vas a arrepentir de tus compras!",
    "¡Descuentos especiales que pueden ser tuyos!"
];

// Función para agregar al carrito
function addToCart(product, price) {
    const existingProduct = carrito.find(item => item.product === product);

    existingProduct 
        ? existingProduct.quantity += 1 
        : carrito.push({ product, price, quantity: 1 });

    updateStorage();
    displayCart();
    showMessage(messages[Math.floor(Math.random() * messages.length)]);
    logPurchase(product, price);
}

// Función para mostrar el carrito
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    
    let totalPrice = carrito.reduce((sum, { product, price, quantity }, index) => {
        cartItems.innerHTML += `
            <li>
                ${product} - $${price.toFixed(2)} x ${quantity}
                <button class="remove-one-btn" data-index="${index}">Quitar uno</button>
                <button class="remove-all-btn" data-index="${index}">Quitar todos</button>
            </li>`;
        return sum + price * quantity;
    }, 0);

    total.innerText = totalPrice.toFixed(2);

    // Añadir event listeners a los botones de "Quitar uno" y "Quitar todos"
    document.querySelectorAll('.remove-one-btn').forEach(button => {
        button.addEventListener('click', ({ target }) => removeOneFromCart(target.dataset.index));
    });
    document.querySelectorAll('.remove-all-btn').forEach(button => {
        button.addEventListener('click', ({ target }) => removeAllFromCart(target.dataset.index));
    });
}

// Función para quitar una unidad del carrito
function removeOneFromCart(index) {
    carrito[index].quantity > 1 
        ? carrito[index].quantity -= 1 
        : carrito.splice(index, 1);

    updateStorage();
    displayCart();
}

// Función para quitar todos los productos de un tipo del carrito
function removeAllFromCart(index) {
    carrito.splice(index, 1);
    updateStorage();
    displayCart();
}

// Función para mostrar mensajes al usuario
function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `<p>${message}</p>`;
    setTimeout(() => messagesDiv.innerHTML = '', 9000);
}

// Función para registrar las compras en la consola
function logPurchase(product, price) {
    console.log(`Producto añadido: ${product} - $${price.toFixed(2)}`);
    console.log('Carrito actual:', carrito);
}

// Función para realizar la compra del carrito
function purchaseCart() {
    if (!carrito.length) {
        return Swal.fire({
            title: "Carrito vacío",
            text: "Añade productos al carrito.",
            icon: "warning"
          });
    }

    const paymentMethod = prompt("¿Cómo te gustaría pagarlo, con tarjeta o efectivo?").toLowerCase();
    let total = carrito.reduce((sum, { price, quantity }) => sum + price * quantity, 0);

    if (paymentMethod === "tarjeta") {
        total *= 0.90; // 10% de descuento
    } else if (paymentMethod !== "efectivo") {
        Swal.fire({
            icon: "error",
            title: "Método de pago no reconocido.",
            text: "Por favor, elige 'tarjeta' o 'efectivo'",
          });
        return;
    }

    alert(`Total a pagar: $${total.toFixed(2)}`);
    alert('¡Gracias por su compra!');
    console.log('Compra completa:', carrito);

    carrito = [];
    updateStorage();
    displayCart();
}


// Función para actualizar el almacenamiento local
function updateStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', displayCart);

// Event listener para desplegar y esconder el carrito
document.getElementById('cartButton').addEventListener('click', () => {
    document.getElementById('cart').classList.toggle('cart-open');
    document.getElementById('cart').classList.toggle('cart-closed');
});

// Event listener para el botón de comprar
document.getElementById('purchaseButton').addEventListener('click', purchaseCart);
