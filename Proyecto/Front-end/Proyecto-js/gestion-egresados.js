/* Seleccionar los elementos del DOM */
const inputCedula      = document.getElementById("identificacion");
const inputNombre      = document.getElementById("nombre-completo");
const inputCorreo      = document.getElementById("correo");
const inputTelefono    = document.getElementById("telefono");
const inputCarrera     = document.getElementById("carrera");
const inputFecha       = document.getElementById("fecha-registro");
 
const btnRegistrar     = document.querySelector(".guardar-formulario");
 
const errorCedula   = document.getElementById("error-identificacion");
const errorNombre   = document.getElementById("error-nombre-completo");
const errorCorreo   = document.getElementById("error-correo");
const errorTelefono = document.getElementById("error-telefono");
const errorCarrera  = document.getElementById("error-carrera");
 
// Lugares de trabajo
const lugaresContainer = document.getElementById("lugares-container");
const btnAgregarLugar  = document.getElementById("agregar-lugar-btn");
 
let contadorLugares = 0;
 
let egresadoEditando = null;
 
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
 
 
function mostrarError(input, elementoError, mensaje) {
    input.classList.add("input-error");
    if (elementoError) elementoError.textContent = mensaje;
}
 
function limpiarError(input, elementoError) {
    input.classList.remove("input-error");
    if (elementoError) elementoError.textContent = "";
}
 
 
// Resaltar campos con error
 
function resaltarCamposVacios() {
    let error = false;
 
    // Identificación
    const cedula = inputCedula.value.trim();
    if (!validarCedula(cedula)) {
        mostrarError(inputCedula, errorCedula, "La identificación debe tener 9 dígitos numéricos.");
        error = true;
    } else {
        limpiarError(inputCedula, errorCedula);
    }
 
    // Nombre
    const nombre = inputNombre.value.trim();
    if (!validarNombreCompleto(nombre)) {
        mostrarError(inputNombre, errorNombre, "El nombre debe tener mínimo 3 caracteres.");
        error = true;
    } else {
        limpiarError(inputNombre, errorNombre);
    }
 
    // Correo
    const correo = inputCorreo.value.trim();
    if (!validarCorreo(correo)) {
        mostrarError(inputCorreo, errorCorreo, "Ingrese un correo electrónico válido.");
        error = true;
    } else {
        limpiarError(inputCorreo, errorCorreo);
    }
 
    // Teléfono
    const telefono = inputTelefono.value.trim();
    if (!validarTelefono(telefono)) {
        mostrarError(inputTelefono, errorTelefono, "El teléfono debe tener entre 8 y 12 dígitos numéricos.");
        error = true;
    } else {
        limpiarError(inputTelefono, errorTelefono);
    }
 
    // Carrera
    const carrera = inputCarrera.value;
    if (!validarCarrera(carrera)) {
        mostrarError(inputCarrera, errorCarrera, "Debe seleccionar una carrera.");
        error = true;
    } else {
        limpiarError(inputCarrera, errorCarrera);
    }
 
    return error;
}
 
// Lugares de trabajo
 
function crearBloqueLugar(valorInicial) {
    const bloque = document.createElement("div");
    bloque.dataset.index = contadorLugares;
 
    bloque.innerHTML = `
        <input type="text" id="lugar-${contadorLugares}" value="${valorInicial ? valorInicial.replace(/"/g, '&quot;') : ''}" placeholder="ej. Empresa XYZ" aria-label="Lugar de trabajo ${contadorLugares + 1}">
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
 
 
function obtenerEgresados() {
    let egresados = JSON.parse(localStorage.getItem("egresados"));
 
    if (egresados === null) {
        egresados = [
            {
                cedula: "304790796",
                nombre: "Mario Castro Chacon",
                correo: "mario@gmail.com",
                telefono: "78569825",
                carrera: "Ingeniería en Desarrollo de Software",
                fecha: "2026-06-26",
                lugares: []
            }
        ];
        localStorage.setItem("egresados", JSON.stringify(egresados));
    }
 
    return egresados;
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
 
    let egresados = obtenerEgresados();
 
    // Traer lugares de trabajo agregados
    const lugaresInputs = lugaresContainer.querySelectorAll("input[type='text']");
    const lugares = [];
    for (let i = 0; i < lugaresInputs.length; i++) {
        if (lugaresInputs[i].value.trim() !== "") {
            lugares.push(lugaresInputs[i].value.trim());
        }
    }
 
    // Crear el objeto con la información del egresado
    const egresadoFormulario = {
        cedula:    inputCedula.value.trim(),
        nombre:    inputNombre.value.trim(),
        correo:    inputCorreo.value.trim(),
        telefono:  inputTelefono.value.trim(),
        carrera:   inputCarrera.value,
        fecha:     inputFecha.value,
        lugares:   lugares
    };
 
    let mensajeExito = "Los datos han sido guardados correctamente.";
 
    if (egresadoEditando !== null) {
        egresados[egresadoEditando] = egresadoFormulario;
        mensajeExito = "El egresado fue actualizado correctamente.";
    } else {
        egresados.push(egresadoFormulario);
    }
 
    // Guardar en Local Storage
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
        title: egresadoEditando !== null ? "Egresado actualizado" : "Egresado registrado correctamente",
        text: mensajeExito,
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(function () {
        document.querySelector("form").reset();
        lugaresContainer.innerHTML = ""; // Limpiar lugares dinámicos
        establecerFechaActual();         // Restaurar fecha actual
        cancelarEdicionEgresado();
        cargarEgresados();
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
 
 
// Editar egresados
function editarEgresado(indice) {
    const egresados = obtenerEgresados();
    const egresado = egresados[indice];
 
    if (!egresado) return;
 
    inputCedula.value = egresado.cedula;
    inputNombre.value = egresado.nombre;
    inputCorreo.value = egresado.correo;
    inputTelefono.value = egresado.telefono;
    inputCarrera.value = egresado.carrera;
    inputFecha.value = egresado.fecha;
 
    // Limpiar errores previos si los había
    limpiarError(inputCedula, errorCedula);
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputCorreo, errorCorreo);
    limpiarError(inputTelefono, errorTelefono);
    limpiarError(inputCarrera, errorCarrera);
 
    // Precargar lugares de trabajo
    lugaresContainer.innerHTML = "";
    contadorLugares = 0;
    if (egresado.lugares && egresado.lugares.length > 0) {
        for (let i = 0; i < egresado.lugares.length; i++) {
            lugaresContainer.appendChild(crearBloqueLugar(egresado.lugares[i]));
        }
    }
 
    egresadoEditando = indice;
    btnRegistrar.textContent = "Actualizar egresado";
 
    document.querySelector("form").scrollIntoView({ behavior: "smooth" });
}
 
 
// Cancelar edicion
function cancelarEdicionEgresado() {
    egresadoEditando = null;
    btnRegistrar.textContent = "Registrar egresado";
}
 
 
// Eliminar egresados
function eliminarEgresado(indice) {
    const egresados = obtenerEgresados();
    const egresado = egresados[indice];
 
    if (!egresado) return;
 
    Swal.fire({
        title: "¿Eliminar egresado?",
        text: `Se eliminará a "${egresado.nombre}". Esta acción no se puede deshacer.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(function (resultado) {
        if (resultado.isConfirmed) {
            egresados.splice(indice, 1);
            localStorage.setItem("egresados", JSON.stringify(egresados));
 
            if (egresadoEditando === indice) {
                document.querySelector("form").reset();
                lugaresContainer.innerHTML = "";
                establecerFechaActual();
                cancelarEdicionEgresado();
            }
 
            cargarEgresados();
 
            Swal.fire({
                title: "Egresado eliminado",
                icon: "success",
                confirmButtonText: "Aceptar"
            });
        }
    });
}
 
 
// Limpiar formulario
document.querySelector(".limpiar-formulario").addEventListener("click", function () {
    cancelarEdicionEgresado();
    lugaresContainer.innerHTML = "";
    limpiarError(inputCedula, errorCedula);
    limpiarError(inputNombre, errorNombre);
    limpiarError(inputCorreo, errorCorreo);
    limpiarError(inputTelefono, errorTelefono);
    limpiarError(inputCarrera, errorCarrera);
});
 
 
//Sobrescribir la informacion en tablas
 
function cargarEgresados() {
    let egresados = obtenerEgresados();
    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = ""; // Limpiar filas por defecto
 
    for (let i = 0; i < egresados.length; i++) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${egresados[i].cedula}</td>
            <td>${egresados[i].nombre}</td>
            <td>${egresados[i].correo}</td>
            <td>${egresados[i].carrera}</td>
            <td>
                <a href="Perfil-Egresado.html?cedula=${encodeURIComponent(egresados[i].cedula)}">Ver perfil</a>
                <button type="button" class="btn-editar-egresado" data-indice="${i}">Editar</button>
                <button type="button" class="btn-eliminar-egresado" data-indice="${i}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(fila);
    }
}
 
 
document.querySelector(".table tbody").addEventListener("click", function (e) {
    const btnEditar = e.target.closest(".btn-editar-egresado");
    const btnEliminar = e.target.closest(".btn-eliminar-egresado");
 
    if (btnEditar) {
        const indice = parseInt(btnEditar.dataset.indice, 10);
        editarEgresado(indice);
    }
 
    if (btnEliminar) {
        const indice = parseInt(btnEliminar.dataset.indice, 10);
        eliminarEgresado(indice);
    }
});
 
 
cargarEgresados();