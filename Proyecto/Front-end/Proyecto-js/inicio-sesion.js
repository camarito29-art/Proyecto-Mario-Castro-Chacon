const correo      = document.getElementById("correo");
const contrasennia = document.getElementById("contrasenna");

const btnIniciarSesion = document.getElementById("btnIniciarSesion");

// Validaciones

function validarCorreo(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarContrasenna(valor) {
    return valor.trim() !== "";
}

// Resaltar campos

function resaltarCampos() {
    let error = false;

    if (!validarCorreo(correo.value.trim())) {
        correo.classList.add("input-error");
        error = true;
    } else {
        correo.classList.remove("input-error");
    }

    if (!validarContrasenna(contrasennia.value)) {
        contrasennia.classList.add("input-error");
        error = true;
    } else {
        contrasennia.classList.remove("input-error");
    }

    return error;
}

// Iniciar sesión

function iniciarSesion() {
    const error = resaltarCampos();

    if (error) {
        Swal.fire({
            title: "Campos incompletos",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Buscar el usuario en la lista guardada en LS
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo.value.trim()) {
            usuarioEncontrado = usuarios[i];
            break;
        }
    }

    if (usuarioEncontrado !== null) {
        Swal.fire({
            title: "Bienvenido (a)",
            text: usuarioEncontrado.nombre,
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(function () {
            // Redirigir a la página de inicio después de aceptar
            window.location.href = "Pagina-Inicio.html";
        });
    } else {
        Swal.fire({
            title: "Error al iniciar sesión",
            text: "Datos de inicio de sesión incorrectos.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
    }
}

// Evento

btnIniciarSesion.addEventListener("click", function (e) {
    e.preventDefault();
    iniciarSesion();
});