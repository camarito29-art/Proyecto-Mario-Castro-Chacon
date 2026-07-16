/* Seleccionar los elementos del DOM */

const inputCodigo       = document.getElementById("codigo-carrera");
const inputNombre       = document.getElementById("nombre-carrera");
const inputDescripcion  = document.getElementById("descripcion-carrera");
const inputDuracion     = document.getElementById("duracion-carrera");
const inputModalidad    = document.getElementById("modalidad-carrera");
const inputActiva       = document.getElementById("activa-carrera");

const btnRegistrarCarrera = document.querySelector(".guardar-formulario");

/* Para mostrar los mensajes de error de cada campo */

const errorCodigo      = document.getElementById("error-codigo-carrera");
const errorNombre      = document.getElementById("error-nombre-carrera");
const errorDescripcion = document.getElementById("error-descripcion-carrera");
const errorDuracion    = document.getElementById("error-duracion-carrera");
const errorModalidad   = document.getElementById("error-modalidad-carrera");


//Regex

// Código de carrera:

const regexCodigo = /^[A-Za-z]{2,4}-\d{2,3}$/;

// Nombre de carrera:

const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,}$/;

// Duración:

const regexDuracion = /^\d{1,2}\s?(año|años|semestre|semestres)$/i;

//Validaciones Regex

function validarCodigo(codigo) {
    return regexCodigo.test(codigo);
}


function validarNombre(nombre) {
    return nombre.length >= 5 && regexNombre.test(nombre);
}


function validarDescripcion(descripcion) {
    return descripcion.length >= 10;
}


function validarDuracion(duracion) {
    return regexDuracion.test(duracion.trim());
}


function validarModalidad(modalidad) {
    return modalidad !== "";
}


// Mostrar / limpiar mensajes de error

function mostrarError(input, elementoError, mensaje) {
    input.classList.add("input-error");
    elementoError.textContent = mensaje;
}

function limpiarError(input, elementoError) {
    input.classList.remove("input-error");
    elementoError.textContent = "";
}

// Resaltar campos con error y mostrar el mensaje correspondiente

function resaltarCamposVacios() {
    let error = false;

    // Código
    const codigo = inputCodigo.value.trim();
    if (!validarCodigo(codigo)) {
        mostrarError(inputCodigo, errorCodigo, "El código debe tener el formato AA-00 (ej. IS-01).");
        error = true;
    } else {
        limpiarError(inputCodigo, errorCodigo);
    }

    // Nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombre(nombre)) {
        mostrarError(inputNombre, errorNombre, "El nombre debe tener mínimo 5 letras y no contener números.");
        error = true;
    } else {
        limpiarError(inputNombre, errorNombre);
    }


    // Descripción
    const descripcion = inputDescripcion.value.trim();
    if (!validarDescripcion(descripcion)) {
        mostrarError(inputDescripcion, errorDescripcion, "La descripción debe tener mínimo 10 caracteres.");
        error = true;
    } else {
        limpiarError(inputDescripcion, errorDescripcion);
    }

    // Duración
    const duracion = inputDuracion.value.trim();
    if (!validarDuracion(duracion)) {
        mostrarError(inputDuracion, errorDuracion, "La duración debe tener formato número + año(s)/semestre(s) (ej. 4 años).");
        error = true;
    } else {
        limpiarError(inputDuracion, errorDuracion);
    }

    // Modalidad
    const modalidad = inputModalidad.value;
    if (!validarModalidad(modalidad)) {
        mostrarError(inputModalidad, errorModalidad, "Debe seleccionar una modalidad.");
        error = true;
    } else {
        limpiarError(inputModalidad, errorModalidad);
    }

    return error;
}


// Guardar carrera


function guardarCarrera() {
    const error = resaltarCamposVacios();
    if (error) {
        Swal.fire({
            title: "No se puede registrar la carrera",
            text: "Complete correctamente los campos resaltados.",
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
        cargarCarreras();
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