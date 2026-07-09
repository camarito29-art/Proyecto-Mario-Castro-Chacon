const correo              = document.getElementById("correo");
const nombreUsuario       = document.getElementById("nombre-usuario");
const contrasennia        = document.getElementById("contrasenna");
const iconoContrasenna    = document.getElementById("iconoContrasenna");
const btnMostrarContrasenna = document.getElementById("btnMostrarContrasenna");
const btnGuardarUsuario   = document.getElementById("guardar-usuario-ls");
const formulario          = document.getElementById("formRegistro") || document.querySelector("form");

// Mostrar / ocultar contraseña

function mostrarContrasenna() {
    if (contrasennia.type === "password") {
        contrasennia.type = "text";
        iconoContrasenna.classList.remove("fa-eye");
        iconoContrasenna.classList.add("fa-eye-slash");
        btnMostrarContrasenna.setAttribute("aria-label", "Ocultar contraseña");
        btnMostrarContrasenna.setAttribute("aria-pressed", "true");
    } else {
        contrasennia.type = "password";
        iconoContrasenna.classList.remove("fa-eye-slash");
        iconoContrasenna.classList.add("fa-eye");
        btnMostrarContrasenna.setAttribute("aria-label", "Mostrar contraseña");
        btnMostrarContrasenna.setAttribute("aria-pressed", "false");
    }
}

// Validaciones 

function validarNombre(nombre) {
    return nombre.length >= 2;
}

function validarCorreo(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
}

function validarContrasenna(valor) {
    return valor.trim() !== "";
}

// Resaltar campos con error

function resaltarCampos() {
    let error = false;

    const nombre = nombreUsuario.value.trim();
    if (!validarNombre(nombre)) {
        nombreUsuario.classList.add("input-error");
        error = true;
    } else {
        nombreUsuario.classList.remove("input-error");
    }

    const valorCorreo = correo.value.trim();
    if (!validarCorreo(valorCorreo)) {
        correo.classList.add("input-error");
        error = true;
    } else {
        correo.classList.remove("input-error");
    }

    const contrasenniaValor = contrasennia.value;
    if (!validarContrasenna(contrasenniaValor)) {
        contrasennia.classList.add("input-error");
        error = true;
    } else {
        contrasennia.classList.remove("input-error");
    }

    return error;
}

// Guardar usuario en Local Storage

function guardarUsuarioListaLS() {
    const error = resaltarCampos();

    if (error) {
        Swal.fire({
            title: "No se puede crear la cuenta",
            text: "Complete los campos resaltados.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Recuperar la lista de usuarios
    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (usuarios === null) {
        usuarios = [];
    }

    // Verificar si el correo ya está registrado
    let existe = false;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].correo === correo.value.trim()) {
            existe = true;
            break;
        }
    }

    if (existe) {
        Swal.fire({
            title: "Correo ya registrado",
            text: "Ya existe una cuenta con ese correo electrónico.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Crear el nuevo usuario
    const nuevoUsuario = {
        nombre: nombreUsuario.value.trim(),
        correo: correo.value.trim(),
        contrasenna: contrasennia.value
    };

    // Agregar al arreglo y guardar en LS
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostrar en consola
    console.log("Lista de usuarios:");
    for (let i = 0; i < usuarios.length; i++) {
        console.log("Usuario " + (i + 1));
        console.log("Nombre: " + usuarios[i].nombre);
        console.log("Correo: " + usuarios[i].correo);
        console.log("-------------------------");
    }

    Swal.fire({
        title: "Cuenta creada correctamente",
        text: "Ya podés iniciar sesión con tu correo.",
        icon: "success",
        confirmButtonText: "Aceptar"
    }).then(function () {
        formulario.reset();
        // Redirigir al inicio de sesión
        window.location.href = "Inicio-Sesion.html";
    });
}

// Eventos

btnMostrarContrasenna.addEventListener("click", mostrarContrasenna);

btnGuardarUsuario.addEventListener("click", function (e) {
    e.preventDefault();
    guardarUsuarioListaLS();
});