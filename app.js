const API_URL = "https://inventario-backend-ihdl.onrender.com/productos";

// Función para consultar los datos guardados en MongoDB Atlas
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = "";

    datos.forEach(prod => {
      tabla.innerHTML += `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${prod.precio}</td>
          <td>${prod.existencia} pzas</td>
          <td class="acciones">
            <button class="btn-editar" onclick='editar("${prod._id}", "${prod.nombre}", ${prod.precio}, ${prod.existencia})'>Editar</button>
            <button class="btn-eliminar" onclick='eliminar("${prod._id}")'>Eliminar</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

// Función para enviar (CREATE) o actualizar (UPDATE) según corresponda
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("productoId").value;
  const nuevoObj = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    let res;
    if (id) {
      // UPDATE
      res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoObj)
      });
    } else {
      // CREATE
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoObj)
      });
    }

    if (res.ok) {
      alert(id ? "¡Producto actualizado!" : "¡Guardado con éxito en MongoDB Atlas!");
      cancelarEdicion();
      obtenerProductos();
    }
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

// Llenar el formulario con los datos del producto a editar
function editar(id, nombre, precio, existencia) {
  document.getElementById("productoId").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("existencia").value = existencia;
  document.getElementById("tituloForm").textContent = "Editar Producto";
  document.getElementById("btnSubmit").textContent = "Actualizar";
}

// Regresar el formulario a modo de registro normal
function cancelarEdicion() {
  document.getElementById("formProducto").reset();
  document.getElementById("productoId").value = "";
  document.getElementById("tituloForm").textContent = "Registrar Producto";
  document.getElementById("btnSubmit").textContent = "Enviar a la Nube";
}

// Eliminar un producto
async function eliminar(id) {
  if (!confirm("¿Seguro que quieres eliminar este producto?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Producto eliminado!");
      obtenerProductos();
    }
  } catch (err) {
    console.error("Error al eliminar:", err);
  }
}

// Cargar la base de datos inmediatamente al abrir la página
obtenerProductos();