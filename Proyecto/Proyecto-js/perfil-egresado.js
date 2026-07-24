function obtenerParametroCedula() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("cedula");
}

function buscarEgresadoPorCedula(cedula) {
    const egresados = JSON.parse(localStorage.getItem("egresados")) || [];
    for (let i = 0; i < egresados.length; i++) {
        if (egresados[i].cedula === cedula) {
            return egresados[i];
        }
    }
    return null;
}

function formatearFecha(fechaISO) {
    if (!fechaISO) return "No especificada";
    const [anio, mes, dia] = fechaISO.split("-");
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    return `${parseInt(dia, 10)} de ${meses[parseInt(mes, 10) - 1]}, ${anio}`;
}

function mostrarPerfil() {
    try {
        const cedula = obtenerParametroCedula();

        if (!cedula) {
            mostrarMensajeSinSeleccion();
            return;
        }

        const egresado = buscarEgresadoPorCedula(cedula);

        if (!egresado) {
            mostrarMensajeSinSeleccion(
                "No se encontró información para la cédula " + cedula + "."
            );
            return;
        }

        document.getElementById("perfil-identificacion").textContent = egresado.cedula;
        document.getElementById("perfil-nombre").textContent = egresado.nombre;
        document.getElementById("perfil-correo").textContent = egresado.correo;
        document.getElementById("perfil-telefono").textContent = egresado.telefono;
        document.getElementById("perfil-fecha").textContent = formatearFecha(egresado.fecha);
        document.getElementById("perfil-carrera").textContent = egresado.carrera;

        const contenedorHistorial = document.getElementById("perfil-historial");
        contenedorHistorial.innerHTML = "";

        if (egresado.lugares && egresado.lugares.length > 0) {
            for (let i = 0; i < egresado.lugares.length; i++) {
                const parrafo = document.createElement("p");
                parrafo.textContent = egresado.lugares[i];
                contenedorHistorial.appendChild(parrafo);
            }
        } else {
            contenedorHistorial.innerHTML = "<p>Sin lugares de trabajo registrados.</p>";
        }
    } catch (error) {
        console.error("Error al mostrar el perfil del egresado:", error);
        Swal.fire({
            title: "Error al mostrar perfil",
            text: "Ocurrió un error al cargar el perfil del egresado.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}

mostrarPerfil();