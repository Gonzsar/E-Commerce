let carrito = [];
let messages = [
    "¡Producto añadido!",
    "¡No olvides de ver nuestras nuevas ofertas!",
    "Tienes productos en tu carrito esperándote.",
    "¡No te vas a arrepentir de tus compras!",
    "¡Descuentos especiales que pueden ser tuyos!"
];

function addToCart(product, price) {
    carrito.push({product, price});
    displayCart();
    showMessage(messages[Math.floor(Math.random() * messages.length)]);
    logPurchase(product, price);
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const total = document.getElementById('total');
    cartItems.innerHTML = '';
    let totalPrice = 0;
    carrito.forEach(item => {
        cartItems.innerHTML += `<li>${item.product} - $${item.price.toFixed(2)}</li>`;
        totalPrice += item.price;
    });
    total.innerText = totalPrice.toFixed(2);
}

function showMessage(message) {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `<p>${message}</p>`;
    setTimeout(() => {
        messagesDiv.innerHTML = '';
    }, 9000);
}

function logPurchase(product, price) {
    console.log(`Producto añadido: ${product} - $${price.toFixed(2)}`);
    console.log('Carrito actual:', carrito);
}

function purchaseCart() {
    if (carrito.length > 0) {
        let paymentMethod = prompt("¿Cómo te gustaría pagarlo, con tarjeta o efectivo?");
        let total = carrito.reduce((sum, item) => sum + item.price, 0);
        
        if (paymentMethod.toLowerCase() === "tarjeta") {
            total *= 0.90; // 10% de descuento
            alert(`Total con 10% de descuento: $${total.toFixed(2)}`);
        } else if (paymentMethod.toLowerCase() === "efectivo") {
            alert(`Total a pagar: $${total.toFixed(2)}`);
        } else {
            alert("Método de pago no reconocido. Por favor, elige 'tarjeta' o 'efectivo'.");
            return; // Sale del function sin resetear el carrito
        }

        console.log('Compra completa:', carrito);
        alert('¡Gracias por su compra!');
        carrito = [];
        displayCart();
    } else {
        alert('El carrito está vacío');
    }
}