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

// Inicializar mapa cuando cargue el DOM
document.addEventListener("DOMContentLoaded",function(){
  var map = L.map('mapa').setView([4.6097,-74.0817],13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19,
    attribution:'© OpenStreetMap'
  }).addTo(map);

  L.marker([4.6097,-74.0817])
    .addTo(map)
    .bindPopup("Institución Educativa Central - Cupos: 25");

  L.marker([4.6150,-74.0750])
    .addTo(map)
    .bindPopup("Colegio Técnico Industrial - Cupos: 12");
});

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