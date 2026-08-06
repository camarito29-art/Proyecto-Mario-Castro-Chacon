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

let carreraEditando = null;
const API_URL = "http://localhost:3000/carreras"; // Endpoint del servidor

// Expresiones Regulares
const regexCodigo = /^[A-Za-z]{2,4}-\d{2,3}$/;
const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{5,}$/;
const regexDuracion = /^\d{1,2}\s?(año|años|semestre|semestres)$/i;

// Funciones de validación
function validarCodigo(codigo) { return regexCodigo.test(codigo); }
function validarNombre(nombre) { return nombre.length >= 5 && regexNombre.test(nombre); }
function validarDescripcion(descripcion) { return descripcion.length >= 10; }
function validarDuracion(duracion) { return regexDuracion.test(duracion.trim()); }
function validarModalidad(modalidad) { return modalidad !== ""; }

// Mostrar / limpiar mensajes de error
function mostrarError(input, elementoError, mensaje) {
    input.classList.add("input-error");
    elementoError.textContent = mensaje;
}

function limpiarError(input, elementoError) {
    input.classList.remove("input-error");
    elementoError.textContent = "";
}

// Resaltar campos con error
function resaltarCamposVacios() {
    let error = false;

    if (!validarCodigo(inputCodigo.value.trim())) {
        mostrarError(inputCodigo, errorCodigo, "El código debe tener el formato AA-00 (ej. IS-01).");
        error = true;
    } else { limpiarError(inputCodigo, errorCodigo); }

    if (!validarNombre(inputNombre.value.trim())) {
        mostrarError(inputNombre, errorNombre, "El nombre debe tener mínimo 5 letras y no contener números.");
        error = true;
    } else { limpiarError(inputNombre, errorNombre); }

    if (!validarDescripcion(inputDescripcion.value.trim())) {
        mostrarError(inputDescripcion, errorDescripcion, "La descripción debe tener mínimo 10 caracteres.");
        error = true;
    } else { limpiarError(inputDescripcion, errorDescripcion); }

    if (!validarDuracion(inputDuracion.value.trim())) {
        mostrarError(inputDuracion, errorDuracion, "La duración debe tener formato número + año(s)/semestre(s).");
        error = true;
    } else { limpiarError(inputDuracion, errorDuracion); }

    if (!validarModalidad(inputModalidad.value)) {
        mostrarError(inputModalidad, errorModalidad, "Debe seleccionar una modalidad.");
        error = true;
    } else { limpiarError(inputModalidad, errorModalidad); }

    return error;
}

// Consultar (GET)
async function obtenerCarreras() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const carreras = await respuesta.json();
        return carreras;
    } catch (error) {
        console.error("Error al obtener las carreras:", error);
        Swal.fire("Error de conexión", "No se pudieron cargar las carreras desde el servidor.", "error");
        return [];
    }
}

async function cargarCarreras() {
    const carreras = await obtenerCarreras();
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; 

    carreras.forEach((carrera, i) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${carrera.id || carrera._id}</td>
            <td>${carrera.nombre}</td>
            <td>${carrera.descripcion}</td>
            <td>N/A</td>
            <td>N/A</td>
            <td>Sí</td>
            <td>
                <button type="button" class="btn-editar-carrera" disabled title="Funcionalidad no requerida en esta entrega">Editar</button>
                <button type="button" class="btn-eliminar-carrera" disabled title="Funcionalidad no requerida en esta entrega">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Enviar datos al servidor (POST)
async function guardarCarrera() {
    const error = resaltarCamposVacios();
    if (error) {
        Swal.fire({
            title: "No se puede registrar la carrera",
            text: "Complete correctamente los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return; 
    }

    const carreraFormulario = {
        nombre: inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim()
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(carreraFormulario)
        });

        if (respuesta.ok) {
            Swal.fire({
                title: "Carrera registrada",
                text: "Los datos han sido guardados en el servidor exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar"
            }).then(() => {
                document.querySelector("form").reset(); 
                cancelarEdicionCarrera(); 
                cargarCarreras(); 
            });
        } else {
            throw new Error(`Error al guardar: ${respuesta.status}`);
        }
    } catch (error) {
        console.error("Error en POST /carreras:", error);
        Swal.fire("Error", "No se pudo comunicar con el servidor de base de datos.", "error");
    }
}

// Evento del botón de registro
btnRegistrarCarrera.addEventListener("click", function (e) {
    e.preventDefault();
    guardarCarrera();
});

// Cancelar edición
function cancelarEdicionCarrera() {
    carreraEditando = null;
    btnRegistrarCarrera.textContent = "Registrar carrera";
}

// Limpiar formulario manual
document.querySelector(".limpiar-formulario").addEventListener("click", function () {
    cancelarEdicionCarrera();
    limpiarError(inputCodigo, errorCodigo);
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputDescripcion, errorDescripcion);
    limpiarError(inputDuracion, errorDuracion);
    limpiarError(inputModalidad, errorModalidad);
});

// Cargar registros automáticamente
cargarCarreras();