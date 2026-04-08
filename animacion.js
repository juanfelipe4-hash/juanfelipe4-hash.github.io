function actualizarHora() {
  const ahora = new Date();
  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const segundos = ahora.getSeconds();

  // Texto de la hora en formato HH:MM:SS
  const horaTexto =
    horas.toString().padStart(2,'0') + ":" +
    minutos.toString().padStart(2,'0') + ":" +
    segundos.toString().padStart(2,'0');

  document.getElementById("horaActual").innerText =
    "Hora actual: " + horaTexto;

  const hero = document.querySelector(".hero");
  const mensaje = document.getElementById("mensajeHora");

  // Limpiar clases previas
  hero.classList.remove("mañana","tarde","noche");

  // Cambiar estilo y mensaje según hora militar
  if (horas >= 6 && horas < 12) {
    hero.classList.add("mañana");
    mensaje.innerText = "Buenos días ☀️";
  } else if (horas >= 12 && horas < 18) {
    hero.classList.add("tarde");
    mensaje.innerText = "Buenas tardes 🌤️";
  } else {
    hero.classList.add("noche");
    mensaje.innerText = "Buenas noches 🌙";
  }
}

// Actualizar cada segundo
setInterval(actualizarHora, 1000);
actualizarHora();

document.addEventListener("DOMContentLoaded", function () {

    const botones = document.querySelectorAll(".inscribirse-btn");

    botones.forEach(boton => {
        boton.addEventListener("click", function () {

            const colegio = this.getAttribute("data-colegio");

            // Guardar en localStorage
            localStorage.setItem("colegioSeleccionado", colegio);

            // Redirigir al formulario
            window.location.href = "#inscripcion";
        });
    });

    // Cuando cargue la página, llenar el campo
    const campoColegio = document.getElementById("colegioSeleccionado");

    if (campoColegio) {
        const colegioGuardado = localStorage.getItem("colegioSeleccionado");
        if (colegioGuardado) {
            campoColegio.value = colegioGuardado;
        }
    }

});

// Inicializar mapa en el Valle del Cauca
var mapa = L.map('mapa').setView([3.4516, -76.5320], 8); // Cali como centro

// Cargar mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

// Lista de colegios del Valle del Cauca
const colegios = [
    {
        nombre: "Institución Educativa Santa Librada",
        ciudad: "Cali",
        coords: [3.4516, -76.5320]
    },
    {
        nombre: "Institución Educativa Técnico Industrial",
        ciudad: "Cali",
        coords: [3.4372, -76.5225]
    },
    {
        nombre: "Institución Educativa Jorge Isaacs",
        ciudad: "Cali",
        coords: [3.4600, -76.5000]
    },
    {
        nombre: "Institución Educativa Ciudad de Cartago",
        ciudad: "Cartago",
        coords: [4.7464, -75.9117]
    },
    {
        nombre: "Institución Educativa Tulio Enrique Tascón",
        ciudad: "Buga",
        coords: [3.9000, -76.3000]
    },
    {
        nombre: "Institución Educativa Francisco José de Caldas",
        ciudad: "Palmira",
        coords: [3.5394, -76.3036]
    }
];

// Crear marcadores
colegios.forEach(colegio => {

    let marcador = L.marker(colegio.coords).addTo(mapa);

    marcador.bindPopup(`
        <b>${colegio.nombre}</b><br>
        ${colegio.ciudad}<br><br>
        <button onclick="inscribirseDesdeMapa('${colegio.nombre}')">
            Inscribirse
        </button>
    `);
});

// Función para enviar al formulario
function inscribirseDesdeMapa(nombreColegio) {
    localStorage.setItem("colegioSeleccionado", nombreColegio);
    window.location.href = "#inscripcion";
}

// REGISTRO
document.querySelector("#registro form").addEventListener("submit", function(e){
    e.preventDefault();

    const inputs = this.querySelectorAll("input");
    let valido = true;

    inputs.forEach(input => {
        if(input.value.trim() === ""){
            valido = false;
        }
    });

    if(valido){
        alert("Registro exitoso ✅");
    } else {
        alert("Complete todos los campos ❌");
    }
});


// LOGIN
document.querySelector("#login form").addEventListener("submit", function(e){
    e.preventDefault();

    const email = this.querySelector("input[type='email']").value;
    const pass = this.querySelector("input[type='password']").value;

    if(email && pass){
        alert("Ingreso exitoso ✅");
    } else {
        alert("Datos incorrectos ❌");
    }
});


// BOTONES INSCRIBIRSE
document.querySelectorAll(".inscribirse-btn").forEach(btn => {
    btn.addEventListener("click", function(){
        const colegio = this.getAttribute("data-colegio");

        document.getElementById("colegioSeleccionado").value = colegio;

        // Baja automático al formulario
        document.getElementById("inscripcion").scrollIntoView({
            behavior: "smooth"
        });
    });
});

// GUARDAR INSCRIPCIÓN
document.querySelector("#inscripcion .btn").addEventListener("click", function(){

    const nombre = document.getElementById("nombreEstudiante").value;
    const email = document.getElementById("emailEstudiante").value;
    const colegio = document.getElementById("colegioSeleccionado").value;

    if(nombre && colegio && email){

        let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

        solicitudes.push({
            nombre: nombre,
            colegio: colegio,
            email: email,
            estado: "Pendiente"
        });

        localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

        alert("Inscripción guardada correctamente ✅");

    } else {
        alert("Completa todos los campos ❌");
    }
});


// CONSULTAR ESTADO
document.querySelector("#estado form").addEventListener("submit", function(e){
    e.preventDefault();

    const correo = document.getElementById("correoConsulta").value;

    let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

    let resultado = document.getElementById("resultadoEstado");

    resultado.innerHTML = "";

    let encontrados = solicitudes.filter(s => s.email === correo);

    if(encontrados.length > 0){

        encontrados.forEach(s => {
            resultado.innerHTML += `
                <div class="card">
                    <h3>Resultado de la solicitud</h3>
                    <p><strong>Nombre:</strong> ${s.nombre}</p>
                    <p><strong>Colegio:</strong> ${s.colegio}</p>
                    <p><strong>Estado:</strong> ${s.estado}</p>
                </div>
            `;
        });

    } else {
        resultado.innerHTML = "<p>No se encontraron solicitudes ❌</p>";
    }
});
