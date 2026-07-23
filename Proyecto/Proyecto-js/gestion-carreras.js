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


function obtenerCarreras() {
    let carreras = JSON.parse(localStorage.getItem("carreras"));

    if (carreras === null) {
        carreras = [
            {
                codigo: "IS-01",
                nombre: "Ingeniería en Sistemas de Información",
                descripcion: "Carrera enfocada en el diseño y desarrollo de sistemas de información empresariales.",
                duracion: "4 años",
                modalidad: "presencial",
                activa: true
            },
            {
                codigo: "SW-01",
                nombre: "Ingeniería en Software",
                descripcion: "Carrera orientada al desarrollo y gestión de proyectos de software.",
                duracion: "4 años",
                modalidad: "presencial",
                activa: true
            },
            {
                codigo: "RT-01",
                nombre: "Ingeniería en Redes y Telecomunicaciones",
                descripcion: "Carrera especializada en infraestructura de redes y telecomunicaciones.",
                duracion: "4 años",
                modalidad: "presencial",
                activa: true
            }
        ];
        localStorage.setItem("carreras", JSON.stringify(carreras));
    }

    return carreras;
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

    let carreras = obtenerCarreras();

    // Crear el objeto con la información de la carrera
    const carreraFormulario = {
        codigo:      inputCodigo.value.trim(),
        nombre:      inputNombre.value.trim(),
        descripcion: inputDescripcion.value.trim(),
        duracion:    inputDuracion.value.trim(),
        modalidad:   inputModalidad.value,
        activa:      inputActiva.checked
    };

    let mensajeExito = "Los datos han sido guardados correctamente.";

    if (carreraEditando !== null) {
        carreras[carreraEditando] = carreraFormulario;
        mensajeExito = "La carrera fue actualizada correctamente.";
    } else {
        carreras.push(carreraFormulario);
    }

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
        title: carreraEditando !== null ? "Carrera actualizada" : "Carrera registrada correctamente",
        text: mensajeExito,
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(function () {
        // Limpiar
        document.querySelector("form").reset();
        cancelarEdicionCarrera(); 
        cargarCarreras();
    });
}

// Botón registrar
btnRegistrarCarrera.addEventListener("click", function (e) {
    e.preventDefault();
    try {
        guardarCarrera();
    } catch (error) {
        console.error("Error en guardarCarrera():", error);
        alert("Ocurrió un error al guardar/actualizar la carrera. Revisa la consola (F12) y copia el mensaje en rojo. Detalle: " + error.message);
    }
});


function editarCarrera(indice) {
    const carreras = obtenerCarreras();
    const carrera = carreras[indice];

    if (!carrera) return;

    inputCodigo.value = carrera.codigo;
    inputNombre.value = carrera.nombre;
    inputDescripcion.value = carrera.descripcion;
    inputDuracion.value = carrera.duracion;
    inputModalidad.value = carrera.modalidad;
    inputActiva.checked = carrera.activa;

    // Limpiar errores previos si los había
    limpiarError(inputCodigo, errorCodigo);
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputDescripcion, errorDescripcion);
    limpiarError(inputDuracion, errorDuracion);
    limpiarError(inputModalidad, errorModalidad);

    carreraEditando = indice;
    btnRegistrarCarrera.textContent = "Actualizar carrera";

    // Llevar al usuario al formulario
    document.querySelector("form").scrollIntoView({ behavior: "smooth" });
}


function cancelarEdicionCarrera() {
    carreraEditando = null;
    btnRegistrarCarrera.textContent = "Registrar carrera";
}


function eliminarCarrera(indice) {
    const carreras = obtenerCarreras();
    const carrera = carreras[indice];

    if (!carrera) return;

    Swal.fire({
        title: "¿Eliminar carrera?",
        text: `Se eliminará "${carrera.nombre}". Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            carreras.splice(indice, 1);
            localStorage.setItem("carreras", JSON.stringify(carreras));

            // Cancelar edición
            if (carreraEditando === indice) {
                document.querySelector("form").reset();
                cancelarEdicionCarrera();
            }

            cargarCarreras();

            Swal.fire({
                title: "Carrera eliminada",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
        }
    });
}


function cargarCarreras() {
    let carreras = obtenerCarreras();
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; 

    for (let i = 0; i < carreras.length; i++) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${carreras[i].codigo}</td>
            <td>${carreras[i].nombre}</td>
            <td>${carreras[i].descripcion}</td>
            <td>${carreras[i].duracion}</td>
            <td>
                <button type="button" class="btn-editar-carrera" data-indice="${i}">Editar</button>
                <button type="button" class="btn-eliminar-carrera" data-indice="${i}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    }
}


document.querySelector(".table tbody").addEventListener("click", function (e) {
    try {
        const btnEditar = e.target.closest(".btn-editar-carrera");
        const btnEliminar = e.target.closest(".btn-eliminar-carrera");

        if (btnEditar) {
            const indice = parseInt(btnEditar.dataset.indice, 10);
            console.log("Click en Editar, indice:", indice); 
            editarCarrera(indice);
        }

        if (btnEliminar) {
            const indice = parseInt(btnEliminar.dataset.indice, 10);
            eliminarCarrera(indice);
        }
    } catch (error) {
        console.error("Error al editar/eliminar carrera:", error);
        alert("Ocurrió un error al editar/eliminar. Revisa la consola (F12). Detalle: " + error.message);
    }
});


document.querySelector(".limpiar-formulario").addEventListener("click", function () {
    cancelarEdicionCarrera();
    limpiarError(inputCodigo, errorCodigo);
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputDescripcion, errorDescripcion);
    limpiarError(inputDuracion, errorDuracion);
    limpiarError(inputModalidad, errorModalidad);
});


cargarCarreras();