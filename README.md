# Refrigeshop - Proyecto E-Commerce

**Refrigeshop** es un sitio de ventas web destinado a ofrecer productos refrigerantes, generalmente ofrecemos más productos relacionados con aires acondicionados.

## Funcionalidades Agregadas

### 1. Carrito de Compras
Un carrito de compras ubicado en el lado superior derecho de la pantalla. Este carrito permite a los usuarios agregar productos, actualizar cantidades y eliminar productos. Los productos se mantienen almacenados en el **LocalStorage**, lo que permite que los datos persistan incluso cuando se recarga la página.

### 2. Manejo de Estado con LocalStorage
El carrito de compras utiliza **LocalStorage** para guardar los productos seleccionados. Esto asegura que los productos en el carrito se mantengan guardados hasta que el usuario decida finalizar la compra o vaciar el carrito.

### 3. Selector de método de pago
Al querer comprar los productos en el carrito se puede apreciar la validación para Tarjeta o Efectivo con alertas de **SweetAlert** para confirmar compras. No se permite que se complete la compra si el carrito está vacío.

### 4. Toastify y SweetAlert para Notificaciones
Se utilizan librerías como **Toastify** para mostrar notificaciones al agregar productos al carrito, y **SweetAlert** para mostrar alertas y mensajes de éxito al usuario.

### 5. Asincronía
Se utilizan operaciones asincrónicas con `fetch()`.

### 6. Hosting
Servidor alojado en **Netlify** para una mayor comodidad y estética en el enlace.

## Tecnologías Utilizadas

- **HTML**: Estructura del sitio.
- **CSS**: Estilos y diseño responsive.
- **JavaScript**: Manejo del DOM, lógica del carrito y operaciones asincrónicas.
- **LocalStorage**: Persistencia de datos del carrito.
- **Toastify y SweetAlert**: Notificaciones para el usuario.
- **Git, GitHub y Netlify**: Control de versiones y alojamiento.
