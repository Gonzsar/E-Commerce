
alert("Ingrese la opcion del producto que desea llevar, para salir ingrese 0")
let seleccionarProductos = Number(prompt("1-Control Universal A/C $340, 2-Placa Universal A/C $1200, 3-Garrafa MAPP $590, 4-Manifold $2900, 5-Garrafa Gas R32 $3595"))
let seleccionarCantidad;
let total = 0;


const cantidad = (cant, precio) => {
  return cant * precio
}


while (seleccionarProductos != 0) {
  switch (seleccionarProductos) {
    case 1:
      seleccionarCantidad= Number(prompt("El producto seleccionado es Control Universal A/C, indique la cantidad"))
      total += cantidad(seleccionarCantidad, 340)
      console.log(total);
    break;
    case 2:
      seleccionarCantidad = Number(prompt("El producto seleccionado es Placa Universal A/C, indique la cantidad"))
      total += cantidad(seleccionarCantidad, 1200)
      console.log(total);
    break;
    case 3:
      seleccionarCantidad = Number(prompt("El producto seleccionado es Garrafa MAPP, indique la cantidad"))
      total += cantidad(seleccionarCantidad, 590)
      console.log(total);
    break;
    case 4:
      seleccionarCantidad = Number(prompt("El producto seleccionado es Manifold, indique la cantidad"))
      total += cantidad(seleccionarCantidad, 2900)
      console.log(total);
    break;
    case 5:
      seleccionarCantidad = Number(prompt("El producto seleccionado es Garrafa Gas R32, indique la cantidad"))
      total += cantidad(seleccionarCantidad, 3595)
      console.log(total);
    break;

    default:
      break;
  }
  seleccionarProductos = Number(prompt("1-Control Universal A/C $340, 2-Placa Universal A/C $6800, 3-Garrafa MAPP $850, 4-Manifold $2900, 5-Garrafa Gas R32 $3595, 0 Finalizar compra"))
}

alert(`El total de la compra es de: ${total}`)


const envio = () => {
    if (total >= 5000) {
      alert("El envio es gratuito")
    }else{
      total += 400
      alert(`El costo de envio es de $400, el total es: ${total}`)
    }
}

envio()

const metodoDePago = () => {
  let metodo = prompt("¿Desea pagar con tarjeta o efectivo?" )
  if (metodo == "tarjeta") {
    total *= 0.9
    console.log(total);
    alert(`Tenés un descuento del 10% por pagar con tarjeta, el total es de: ${total}`)
  }else if ( metodo == "efectivo") {
    total *= 1
    console.log(total);
    alert(`El total es de: ${total}`)
  }
  alert("¡Gracias por su compra!")
}

metodoDePago()


