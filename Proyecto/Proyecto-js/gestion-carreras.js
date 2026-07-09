/* Seleccionar los elementos del DOM */
const inputCodigo       = document.getElementById("codigo-carrera");
const inputNombre       = document.getElementById("nombre-carrera");
const inputDescripcion  = document.getElementById("descripcion-carrera");
const inputDuracion     = document.getElementById("duracion-carrera");
const inputModalidad    = document.getElementById("modalidad-carrera");
const inputActiva       = document.getElementById("activa-carrera");

const btnRegistrarCarrera = document.querySelector(".guardar-formulario");

/* ── Funciones de validación ── */

function validarCodigo(codigo) {
    return codigo.length >= 2;
}

function validarNombre(nombre) {
    return nombre.length >= 5;
}

function validarDescripcion(descripcion) {
    return descripcion.length >= 10;
}

function validarDuracion(duracion) {
    return duracion.trim() !== "";
}

function validarModalidad(modalidad) {
    return modalidad !== "";
}

// Resaltar campos con error 

function resaltarCamposVacios() {
    let error = false;

    // Código
    const codigo = inputCodigo.value.trim();
    if (!validarCodigo(codigo)) {
        inputCodigo.classList.add("input-error");
        error = true;
    } else {
        inputCodigo.classList.remove("input-error");
    }

    // Nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombre(nombre)) {
        inputNombre.classList.add("input-error");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
    }

    // Descripción
    const descripcion = inputDescripcion.value.trim();
    if (!validarDescripcion(descripcion)) {
        inputDescripcion.classList.add("input-error");
        error = true;
    } else {
        inputDescripcion.classList.remove("input-error");
    }

    // Duración
    const duracion = inputDuracion.value.trim();
    if (!validarDuracion(duracion)) {
        inputDuracion.classList.add("input-error");
        error = true;
    } else {
        inputDuracion.classList.remove("input-error");
    }

    // Modalidad
    const modalidad = inputModalidad.value;
    if (!validarModalidad(modalidad)) {
        inputModalidad.classList.add("input-error");
        error = true;
    } else {
        inputModalidad.classList.remove("input-error");
    }

    return error;
}

// Guardar carrera

function guardarCarrera() {
    const error = resaltarCamposVacios();

    if (error) {
        Swal.fire({
            title: "No se puede registrar la carrera",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return; // Detener si errores
    }

    // Recuperar la lista
    let carreras = JSON.parse(localStorage.getItem("carreras"));
    if (carreras === null) {
        carreras = [];
    }

    // Crear el objeto con la información de la carrera
    const nuevaCarrera = {
        codigo:      inputCodigo.value.trim(),
        nombre:      inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        duracion:    inputDuracion.value.trim(),
        modalidad:   inputModalidad.value,
        activa:      inputActiva.checked
    };

    // Agregar la nueva carrera
    carreras.push(nuevaCarrera);

    // Guardar en Local Storage
    localStorage.setItem("carreras", JSON.stringify(carreras));

    // Mostrar en consola carreras guardadas
    console.log("Lista de carreras:");
    for (let i = 0; i < carreras.length; i++) {
        console.log("Carrera " + (i + 1));
        console.log("Código: "      + carreras[i].codigo);
        console.log("Nombre: "      + carreras[i].nombre);
        console.log("Descripción: " + carreras[i].descripcion);
        console.log("Duración: "    + carreras[i].duracion);
        console.log("Modalidad: "   + carreras[i].modalidad);
        console.log("Activa: "      + carreras[i].activa);
        console.log("-------------------------");
    }

    Swal.fire({
        title: "Carrera registrada correctamente",
        text: "Los datos han sido guardados correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(function () {
        // Limpiar
        document.querySelector("form").reset();
    });
}

// Botón registrar
btnRegistrarCarrera.addEventListener("click", function (e) {
    e.preventDefault();
    guardarCarrera();
});

function cargarCarreras() {
    let carreras = JSON.parse(localStorage.getItem("carreras")) || [];
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; // Limpiar filas por defecto

    for (let i = 0; i < carreras.length; i++) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${carreras[i].codigo}</td>
            <td>${carreras[i].nombre}</td>
            <td>${carreras[i].descripcion}</td>
            <td>${carreras[i].duracion}</td>
        `;
        tbody.appendChild(fila);
    }
}

cargarCarreras();