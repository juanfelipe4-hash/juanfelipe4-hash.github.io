/* ==================== SISTEMA DE AUTENTICACIÓN ==================== */

// Función para mostrar/ocultar elementos protegidos
function actualizarVisiblidad() {
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  const elementosProtegidos = document.querySelectorAll(".auth-required");
  const elementosLoginOnly = document.querySelectorAll(".login-only");

  if (usuarioActivo) {
    // Usuario logueado - mostrar elementos protegidos y ocultar login/registro
    elementosProtegidos.forEach((el) => {
      el.classList.add("visible");
    });

    elementosLoginOnly.forEach((el) => {
      el.classList.add("hidden");
    });
  } else {
    // Usuario no logueado - ocultar elementos protegidos y mostrar login/registro
    elementosProtegidos.forEach((el) => {
      el.classList.remove("visible");
    });

    elementosLoginOnly.forEach((el) => {
      el.classList.remove("hidden");
    });
  }
}

// Verificar autenticación al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  actualizarVisiblidad();

  // Botón de logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("usuarioActivo");
      mostrarToast("Sesión cerrada ✅", "success");
      actualizarVisiblidad();
      window.location.hash = "#login";
    });
  }
});

/* ==================== UTILIDADES ==================== */

// Sistema de notificaciones Toast
function mostrarToast(mensaje, tipo = "success", duracion = 3000) {
  const toast = document.createElement("div");
  toast.className = `toast ${tipo}`;
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideInRight 0.4s ease";
  }, 10);

  setTimeout(() => {
    toast.remove();
  }, duracion);
}

// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar teléfono
function validarTelefono(telefono) {
  const regex = /^\d{7,}$/;
  return regex.test(telefono.replace(/\D/g, ""));
}

// Validar contraseña
function validarPassword(password) {
  return password.length >= 6;
}

/* ==================== MENÚ HAMBURGUESA ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const navContainer = document.getElementById("navContainer");

  if (menuToggle && navContainer) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      navContainer.classList.toggle("active");
    });

    // Cerrar menú al hacer click en un link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", function () {
        menuToggle.classList.remove("active");
        navContainer.classList.remove("active");
      });
    });
  }
});

/* ==================== RELOJ Y HORA ==================== */

function actualizarHora() {
  const ahora = new Date();
  const horas = ahora.getHours();
  const minutos = ahora.getMinutes();
  const segundos = ahora.getSeconds();

  const horaTexto =
    horas.toString().padStart(2, "0") +
    ":" +
    minutos.toString().padStart(2, "0") +
    ":" +
    segundos.toString().padStart(2, "0");

  const horaActualEl = document.getElementById("horaActual");
  if (horaActualEl) {
    horaActualEl.innerText = "Hora actual: " + horaTexto;
  }

  const hero = document.querySelector(".hero");
  const mensaje = document.getElementById("mensajeHora");

  if (hero && mensaje) {
    hero.classList.remove("mañana", "tarde", "noche");

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
}

setInterval(actualizarHora, 1000);
actualizarHora();

/* ==================== BÚSQUEDA DE COLEGIOS ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const buscador = document.getElementById("buscadorColegios");

  if (buscador) {
    buscador.addEventListener("input", function (e) {
      const termino = e.target.value.toLowerCase();
      const tarjetas = document.querySelectorAll(".colegio-card");

      tarjetas.forEach((tarjeta) => {
        const texto = tarjeta.textContent.toLowerCase();
        if (texto.includes(termino)) {
          tarjeta.style.display = "flex";
        } else {
          tarjeta.style.display = "none";
        }
      });
    });
  }
});

/* ==================== INSCRIPCIÓN DESDE BOTONES ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const botones = document.querySelectorAll(".inscribirse-btn");

  botones.forEach((boton) => {
    boton.addEventListener("click", function () {
      const colegio = this.getAttribute("data-colegio");
      localStorage.setItem("colegioSeleccionado", colegio);

      const campoColegio = document.getElementById("colegioSeleccionado");
      if (campoColegio) {
        campoColegio.value = colegio;
      }

      document.getElementById("inscripcion").scrollIntoView({
        behavior: "smooth",
      });
      mostrarToast("Colegio seleccionado: " + colegio, "success");
    });
  });

  // Llenar campo si hay colegio guardado
  const campoColegio = document.getElementById("colegioSeleccionado");
  if (campoColegio) {
    const colegioGuardado = localStorage.getItem("colegioSeleccionado");
    if (colegioGuardado) {
      campoColegio.value = colegioGuardado;
    }
  }
});

/* ==================== MAPA LEAFLET ==================== */

if (typeof L !== "undefined") {
  const mapa = L.map("mapa").setView([3.4516, -76.532], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapa);

  const colegios = [
    {
      nombre: "Institución Educativa Santa Librada",
      ciudad: "Cali",
      coords: [3.4516, -76.532],
    },
    {
      nombre: "Institución Educativa Técnico Industrial",
      ciudad: "Cali",
      coords: [3.4372, -76.5225],
    },
    {
      nombre: "Institución Educativa Jorge Isaacs",
      ciudad: "Cali",
      coords: [3.46, -76.5],
    },
    {
      nombre: "Institución Educativa Ciudad de Cartago",
      ciudad: "Cartago",
      coords: [4.7464, -75.9117],
    },
    {
      nombre: "Institución Educativa Tulio Enrique Tascón",
      ciudad: "Buga",
      coords: [3.9, -76.3],
    },
    {
      nombre: "Institución Educativa Francisco José de Caldas",
      ciudad: "Palmira",
      coords: [3.5394, -76.3036],
    },
  ];

  colegios.forEach((colegio) => {
    const marcador = L.marker(colegio.coords).addTo(mapa);
    marcador.bindPopup(`
            <b>${colegio.nombre}</b><br>
            ${colegio.ciudad}<br><br>
            <button onclick="inscribirseDesdeMapa('${colegio.nombre}')" style="
                padding: 8px 12px;
                background: #0252a1;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            ">
                Inscribirse
            </button>
        `);
  });
}

function inscribirseDesdeMapa(nombreColegio) {
  localStorage.setItem("colegioSeleccionado", nombreColegio);
  const campoColegio = document.getElementById("colegioSeleccionado");
  if (campoColegio) {
    campoColegio.value = nombreColegio;
  }
  document.getElementById("inscripcion").scrollIntoView({ behavior: "smooth" });
  mostrarToast("Colegio: " + nombreColegio, "success");
}
