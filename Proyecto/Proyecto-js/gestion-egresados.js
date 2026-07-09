/* Seleccionar los elementos del DOM */
const inputCedula      = document.getElementById("identificacion");
const inputNombre      = document.getElementById("nombre-completo");
const inputCorreo      = document.getElementById("correo");
const inputTelefono    = document.getElementById("telefono");
const inputCarrera     = document.getElementById("carrera");
const inputFecha       = document.getElementById("fecha-registro");

const btnRegistrar     = document.querySelector(".guardar-formulario");

// Lugares de trabajo
const lugaresContainer = document.getElementById("lugares-container");
const btnAgregarLugar  = document.getElementById("agregar-lugar-btn");

let contadorLugares = 0;

// Funciones de validación

function validarCedula(cedula) {
    return /^[0-9]{9}$/.test(cedula);
}

function validarNombreCompleto(nombre) {
    return nombre.length >= 2;
}

function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarTelefono(telefono) {
    return /^[0-9]{8,12}$/.test(telefono);
}

function validarCarrera(carrera) {
    return carrera !== "";
}

//Fecha actual 

function establecerFechaActual() {
    const hoy  = new Date();
    const anio = hoy.getFullYear();
    const mes  = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia  = String(hoy.getDate()).padStart(2, "0");
    inputFecha.value = `${anio}-${mes}-${dia}`;
}

// Resaltar campos con error

function resaltarCamposVacios() {
    let error = false;

    // Identificación
    const cedula = inputCedula.value.trim();
    if (!validarCedula(cedula)) {
        inputCedula.classList.add("input-error");
        error = true;
    } else {
        inputCedula.classList.remove("input-error");
    }

    // Nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombreCompleto(nombre)) {
        inputNombre.classList.add("input-error");
        error = true;
    } else {
        inputNombre.classList.remove("input-error");
    }

    // Correo
    const correo = inputCorreo.value.trim();
    if (!validarCorreo(correo)) {
        inputCorreo.classList.add("input-error");
        error = true;
    } else {
        inputCorreo.classList.remove("input-error");
    }

    // Teléfono
    const telefono = inputTelefono.value.trim();
    if (!validarTelefono(telefono)) {
        inputTelefono.classList.add("input-error");
        error = true;
    } else {
        inputTelefono.classList.remove("input-error");
    }

    // Carrera
    const carrera = inputCarrera.value;
    if (!validarCarrera(carrera)) {
        inputCarrera.classList.add("input-error");
        error = true;
    } else {
        inputCarrera.classList.remove("input-error");
    }

    return error;
}

// Lugares de trabajo

function crearBloqueLugar() {
    const bloque = document.createElement("div");
    bloque.dataset.index = contadorLugares;

    bloque.innerHTML = `
        <input type="text" id="lugar-${contadorLugares}" placeholder="ej. Empresa XYZ" aria-label="Lugar de trabajo ${contadorLugares + 1}">
        <button type="button" class="eliminar-lugar">Eliminar</button>
    `;

    // Evento para eliminar el bloque
    bloque.querySelector(".eliminar-lugar").addEventListener("click", function (e) {
        e.preventDefault();
        bloque.remove();
    });

    contadorLugares++;
    return bloque;
}

// Guardar egresado en Local Storage

function guardarEgresado() {
    const error = resaltarCamposVacios();

    if (error) {
        Swal.fire({
            title: "No se puede registrar el egresado",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Recuperar la lista de egresados existentes
    let egresados = JSON.parse(localStorage.getItem("egresados"));
    if (egresados === null) {
        egresados = [];
    }

    // Traer lugares de trabajo agregados
    const lugaresInputs = lugaresContainer.querySelectorAll("input[type='text']");
    const lugares = [];
    for (let i = 0; i < lugaresInputs.length; i++) {
        if (lugaresInputs[i].value.trim() !== "") {
            lugares.push(lugaresInputs[i].value.trim());
        }
    }

    // Crear el objeto con la información del egresado
    const nuevoEgresado = {
        cedula:    inputCedula.value.trim(),
        nombre:    inputNombre.value.trim(),
        correo:    inputCorreo.value.trim(),
        telefono:  inputTelefono.value.trim(),
        carrera:   inputCarrera.value,
        fecha:     inputFecha.value,
        lugares:   lugares
    };

    // Agregar al arreglo y guardar en LS
    egresados.push(nuevoEgresado);
    localStorage.setItem("egresados", JSON.stringify(egresados));

    // Mostrar en consola todos los egresados
    console.log("Lista de egresados:");
    for (let i = 0; i < egresados.length; i++) {
        console.log("Egresado " + (i + 1));
        console.log("Cédula: "   + egresados[i].cedula);
        console.log("Nombre: "   + egresados[i].nombre);
        console.log("Correo: "   + egresados[i].correo);
        console.log("Teléfono: " + egresados[i].telefono);
        console.log("Carrera: "  + egresados[i].carrera);
        console.log("Fecha: "    + egresados[i].fecha);
        console.log("Lugares: "  + egresados[i].lugares.join(", "));
        console.log("-------------------------");
    }

    Swal.fire({
        title: "Egresado registrado correctamente",
        text: "Los datos han sido guardados correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(function () {
        document.querySelector("form").reset();
        lugaresContainer.innerHTML = ""; // Limpiar lugares dinámicos
        establecerFechaActual();         // Restaurar fecha actual
    });
}

// Eventos

establecerFechaActual();

btnRegistrar.addEventListener("click", function (e) {
    e.preventDefault();
    guardarEgresado();
});

btnAgregarLugar.addEventListener("click", function (e) {
    e.preventDefault();
    const bloque = crearBloqueLugar();
    lugaresContainer.appendChild(bloque);
});

//Sobrescribir la informacion en tablas

function cargarEgresados() {
    let egresados = JSON.parse(localStorage.getItem("egresados")) || [];
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; // Limpiar filas por defecto

    for (let i = 0; i < egresados.length; i++) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${egresados[i].cedula}</td>
            <td>${egresados[i].nombre}</td>
            <td>${egresados[i].correo}</td>
            <td>${egresados[i].carrera}</td>
            <td><a href="perfil-egresado.html">Ver perfil</a></td>
        `;
        tbody.appendChild(fila);
    }
}

cargarEgresados();