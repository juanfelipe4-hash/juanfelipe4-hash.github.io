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

/* ==================== UN ÚNICO DOMCONTENTLOADED ==================== */

document.addEventListener("DOMContentLoaded", function () {
  // ===== MENÚ HAMBURGUESA =====
  const menuToggle = document.getElementById("menuToggle");
  const navContainer = document.getElementById("navContainer");

  if (menuToggle && navContainer) {
    menuToggle.addEventListener("click", function () {
      menuToggle.classList.toggle("active");
      navContainer.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", function () {
        menuToggle.classList.remove("active");
        navContainer.classList.remove("active");
      });
    });
  }

  // ===== BÚSQUEDA DE COLEGIOS =====
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

  // ===== INSCRIPCIÓN DESDE BOTONES =====
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

  // ===== CAMBIAR FOTO =====
  const inputFoto = document.getElementById("fotoEstudiante");
  const nombreFoto = document.getElementById("fotoNombre");

  if (inputFoto && nombreFoto) {
    inputFoto.addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        nombreFoto.textContent = "✓ Archivo: " + e.target.files[0].name;
      } else {
        nombreFoto.textContent = "";
      }
    });
  }

  // ===== FORMULARIO DE REGISTRO =====
  const formRegistro = document.getElementById("formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombreRegistro").value.trim();
      const email = document.getElementById("emailRegistro").value.trim();
      const password = document.getElementById("passwordRegistro").value;
      const rol = document.getElementById("rolRegistro").value;

      let valido = true;

      if (!nombre || nombre.length < 3) {
        document.getElementById("errorNombre").textContent =
          "El nombre debe tener al menos 3 caracteres";
        valido = false;
      } else {
        document.getElementById("errorNombre").textContent = "";
      }

      if (!validarEmail(email)) {
        document.getElementById("errorEmailReg").textContent = "Email inválido";
        valido = false;
      } else {
        document.getElementById("errorEmailReg").textContent = "";
      }

      if (!validarPassword(password)) {
        document.getElementById("errorPassReg").textContent =
          "La contraseña debe tener al menos 6 caracteres";
        valido = false;
      } else {
        document.getElementById("errorPassReg").textContent = "";
      }

      if (!rol) {
        document.getElementById("errorRol").textContent = "Selecciona un rol";
        valido = false;
      } else {
        document.getElementById("errorRol").textContent = "";
      }

      if (valido) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];
        registros.push({
          nombre: nombre,
          email: email,
          password: password,
          rol: rol,
          fecha: new Date().toLocaleDateString(),
        });
        localStorage.setItem("registros", JSON.stringify(registros));

        mostrarToast("Registro exitoso ✅", "success");
        formRegistro.reset();

        setTimeout(() => {
          window.location.hash = "#login";
        }, 1500);
      }
    });
  }

  // ===== FORMULARIO DE LOGIN =====
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("emailLogin").value.trim();
      const password = document.getElementById("passwordLogin").value;

      let valido = true;

      if (!validarEmail(email)) {
        document.getElementById("errorEmailLogin").textContent =
          "Email inválido";
        valido = false;
      } else {
        document.getElementById("errorEmailLogin").textContent = "";
      }

      if (!password) {
        document.getElementById("errorPassLogin").textContent =
          "Ingresa tu contraseña";
        valido = false;
      } else {
        document.getElementById("errorPassLogin").textContent = "";
      }

      if (valido) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];

        let usuarioValido = registros.find(
          (r) => r.email === email && r.password === password,
        );

        if (usuarioValido) {
          localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));

          actualizarVisiblidad(); // Mostrar elementos protegidos
          mostrarToast("Ingreso exitoso ✅", "success");
          formLogin.reset();
          setTimeout(() => {
            document
              .getElementById("dashboard")
              .scrollIntoView({ behavior: "smooth" });
          }, 500);
        } else {
          mostrarToast("Email o contraseña incorrectos ❌", "error");
        }
      }
    });
  } else {
    console.error("❌ formLogin NO encontrado!");
  }

  // ===== FORMULARIO DE INSCRIPCIÓN =====
  const formInscripcion = document.getElementById("formInscripcion");
  if (formInscripcion) {
    formInscripcion.addEventListener("submit", function (e) {
      e.preventDefault();

      const colegio = document
        .getElementById("colegioSeleccionado")
        .value.trim();
      const nombreEst = document
        .getElementById("nombreEstudiante")
        .value.trim();
      const cedulaEst = document
        .getElementById("cedulaEstudiante")
        .value.trim();
      const fechaNac = document.getElementById("fechaNacimiento").value;
      const lugarNac = document.getElementById("lugarNacimiento").value.trim();
      const grado = document.getElementById("grado").value;
      const genero = document.getElementById("genero").value;
      const emailEst = document.getElementById("emailEstudiante").value.trim();

      const nombreAcud = document
        .getElementById("nombreAcudiente")
        .value.trim();
      const cedulaAcud = document
        .getElementById("cedulaAcudiente")
        .value.trim();
      const telefonoAcud = document
        .getElementById("telefonoAcudiente")
        .value.trim();
      const emailAcud = document.getElementById("emailAcudiente").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const ciudad = document.getElementById("ciudad").value.trim();
      const pais = document.getElementById("pais").value.trim();

      let valido = true;

      if (!colegio) {
        mostrarToast("Selecciona un colegio", "error");
        valido = false;
      }

      if (!nombreEst || nombreEst.length < 3) {
        mostrarToast("Nombre del estudiante inválido", "error");
        valido = false;
      }

      if (!cedulaEst || cedulaEst.length < 8) {
        mostrarToast("Cédula del estudiante inválida", "error");
        valido = false;
      }

      if (!fechaNac) {
        mostrarToast("Fecha de nacimiento requerida", "error");
        valido = false;
      }

      if (!validarEmail(emailEst)) {
        mostrarToast("Email del estudiante inválido", "error");
        valido = false;
      }

      if (!nombreAcud || nombreAcud.length < 3) {
        mostrarToast("Nombre del acudiente inválido", "error");
        valido = false;
      }

      if (!validarTelefono(telefonoAcud)) {
        mostrarToast("Teléfono inválido", "error");
        valido = false;
      }

      if (!validarEmail(emailAcud)) {
        mostrarToast("Email del acudiente inválido", "error");
        valido = false;
      }

      if (valido) {
        let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

        solicitudes.push({
          id: Date.now(),
          colegio: colegio,
          estudiante: {
            nombre: nombreEst,
            cedula: cedulaEst,
            fechaNacimiento: fechaNac,
            lugarNacimiento: lugarNac,
            grado: grado,
            genero: genero,
            email: emailEst,
          },
          acudiente: {
            nombre: nombreAcud,
            cedula: cedulaAcud,
            telefono: telefonoAcud,
            email: emailAcud,
            direccion: direccion,
            ciudad: ciudad,
            pais: pais,
          },
          estado: "Pendiente",
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
        });

        localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

        mostrarToast("Inscripción registrada correctamente ✅", "success");
        formInscripcion.reset();

        actualizarDashboard();
      }
    });
  }

  // ===== CONSULTAR ESTADO =====
  const formConsultaEstado = document.getElementById("formConsultaEstado");
  if (formConsultaEstado) {
    formConsultaEstado.addEventListener("submit", function (e) {
      e.preventDefault();

      const correo = document.getElementById("correoConsulta").value.trim();
      const resultadoDiv = document.getElementById("resultadoEstado");

      if (!validarEmail(correo)) {
        mostrarToast("Email inválido", "error");
        return;
      }

      let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
      let encontrados = solicitudes.filter(
        (s) => s.estudiante.email === correo || s.acudiente.email === correo,
      );

      resultadoDiv.innerHTML = "";

      if (encontrados.length > 0) {
        encontrados.forEach((s) => {
          resultadoDiv.innerHTML += `
                      <div class="card">
                          <h3>Solicitud de Inscripción</h3>
                          <p><strong>Estudiante:</strong> ${s.estudiante.nombre}</p>
                          <p><strong>Colegio:</strong> ${s.colegio}</p>
                          <p><strong>Grado:</strong> ${s.estudiante.grado}</p>
                          <p><strong>Estado:</strong> <span style="color: #0252a1; font-weight: bold;">${s.estado}</span></p>
                          <p><strong>Fecha de Solicitud:</strong> ${s.fecha} a las ${s.hora}</p>
                      </div>
                  `;
        });
        mostrarToast("Solicitudes encontradas", "success");
      } else {
        resultadoDiv.innerHTML =
          '<div class="card"><p>No se encontraron solicitudes con ese email ❌</p></div>';
        mostrarToast("No hay solicitudes", "warning");
      }
    });
  }

  // ===== ACTUALIZAR DASHBOARD AL CARGAR =====
  actualizarDashboard();

  // ===== MENSAJE DE BIENVENIDA =====
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
  if (usuarioActivo) {
    mostrarToast("¡Bienvenido " + usuarioActivo.nombre + "!", "success", 2000);
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

/* ==================== MAPA LEAFLET ==================== */

if (typeof L !== "undefined" && document.getElementById("mapa")) {
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

/* ==================== ACTUALIZAR DASHBOARD ==================== */

function actualizarDashboard() {
  let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  const misSolicitudes = document.getElementById("misSolicitudes");
  if (misSolicitudes && usuarioActivo) {
    const misSolicitudesFiltr = solicitudes.filter(
      (s) => s.acudiente.email === usuarioActivo.email,
    );

    if (misSolicitudesFiltr.length > 0) {
      misSolicitudes.innerHTML = "";
      misSolicitudesFiltr.forEach((s) => {
        misSolicitudes.innerHTML += `
                    <p>📚 <strong>${s.colegio}</strong> - ${s.estado}</p>
                `;
      });
    }
  }

  const totalEl = document.getElementById("totalSolicitudes");
  const pendientesEl = document.getElementById("solicitudesPendientes");
  const aprobadasEl = document.getElementById("solicitudesAprobadas");

  if (totalEl) totalEl.textContent = solicitudes.length;
  if (pendientesEl)
    pendientesEl.textContent = solicitudes.filter(
      (s) => s.estado === "Pendiente",
    ).length;
  if (aprobadasEl)
    aprobadasEl.textContent = solicitudes.filter(
      (s) => s.estado === "Aprobada",
    ).length;
}

/* ==================== MAPA LEAFLET ==================== */

if (typeof L !== "undefined" && document.getElementById("mapa")) {
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

/* ==================== FORMULARIO DE REGISTRO ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const formRegistro = document.getElementById("formRegistro");
  if (formRegistro) {
    formRegistro.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombreRegistro").value.trim();
      const email = document.getElementById("emailRegistro").value.trim();
      const password = document.getElementById("passwordRegistro").value;
      const rol = document.getElementById("rolRegistro").value;

      let valido = true;

      if (!nombre || nombre.length < 3) {
        document.getElementById("errorNombre").textContent =
          "El nombre debe tener al menos 3 caracteres";
        valido = false;
      } else {
        document.getElementById("errorNombre").textContent = "";
      }

      if (!validarEmail(email)) {
        document.getElementById("errorEmailReg").textContent = "Email inválido";
        valido = false;
      } else {
        document.getElementById("errorEmailReg").textContent = "";
      }

      if (!validarPassword(password)) {
        document.getElementById("errorPassReg").textContent =
          "La contraseña debe tener al menos 6 caracteres";
        valido = false;
      } else {
        document.getElementById("errorPassReg").textContent = "";
      }

      if (!rol) {
        document.getElementById("errorRol").textContent = "Selecciona un rol";
        valido = false;
      } else {
        document.getElementById("errorRol").textContent = "";
      }

      if (valido) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];
        registros.push({
          nombre: nombre,
          email: email,
          password: password,
          rol: rol,
          fecha: new Date().toLocaleDateString(),
        });
        localStorage.setItem("registros", JSON.stringify(registros));

        mostrarToast("Registro exitoso ✅", "success");
        formRegistro.reset();

        // Ir a login automáticamente
        setTimeout(() => {
          window.location.hash = "#login";
        }, 1500);
      }
    });
  }
});

/* ==================== FORMULARIO DE LOGIN ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const formLogin = document.getElementById("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("emailLogin").value.trim();
      const password = document.getElementById("passwordLogin").value;

      let valido = true;

      if (!validarEmail(email)) {
        document.getElementById("errorEmailLogin").textContent =
          "Email inválido";
        valido = false;
      } else {
        document.getElementById("errorEmailLogin").textContent = "";
      }

      if (!password) {
        document.getElementById("errorPassLogin").textContent =
          "Ingresa tu contraseña";
        valido = false;
      } else {
        document.getElementById("errorPassLogin").textContent = "";
      }

      if (valido) {
        let registros = JSON.parse(localStorage.getItem("registros")) || [];

        let usuarioValido = registros.find(
          (r) => r.email === email && r.password === password,
        );

        if (usuarioValido) {
          localStorage.setItem("usuarioActivo", JSON.stringify(usuarioValido));

          actualizarVisiblidad(); // Mostrar elementos protegidos
          mostrarToast("Ingreso exitoso ✅", "success");
          formLogin.reset();
          setTimeout(() => {
            document
              .getElementById("dashboard")
              .scrollIntoView({ behavior: "smooth" });
          }, 500);
        } else {
          mostrarToast("Email o contraseña incorrectos ❌", "error");
        }
      }
    });
  }
});

/* ==================== FORMULARIO DE INSCRIPCIÓN ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const formInscripcion = document.getElementById("formInscripcion");
  if (formInscripcion) {
    formInscripcion.addEventListener("submit", function (e) {
      e.preventDefault();

      const colegio = document
        .getElementById("colegioSeleccionado")
        .value.trim();
      const nombreEst = document
        .getElementById("nombreEstudiante")
        .value.trim();
      const cedulaEst = document
        .getElementById("cedulaEstudiante")
        .value.trim();
      const fechaNac = document.getElementById("fechaNacimiento").value;
      const lugarNac = document.getElementById("lugarNacimiento").value.trim();
      const grado = document.getElementById("grado").value;
      const genero = document.getElementById("genero").value;
      const emailEst = document.getElementById("emailEstudiante").value.trim();

      const nombreAcud = document
        .getElementById("nombreAcudiente")
        .value.trim();
      const cedulaAcud = document
        .getElementById("cedulaAcudiente")
        .value.trim();
      const telefonoAcud = document
        .getElementById("telefonoAcudiente")
        .value.trim();
      const emailAcud = document.getElementById("emailAcudiente").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const ciudad = document.getElementById("ciudad").value.trim();
      const pais = document.getElementById("pais").value.trim();

      let valido = true;

      if (!colegio) {
        mostrarToast("Selecciona un colegio", "error");
        valido = false;
      }

      if (!nombreEst || nombreEst.length < 3) {
        mostrarToast("Nombre del estudiante inválido", "error");
        valido = false;
      }

      if (!cedulaEst || cedulaEst.length < 8) {
        mostrarToast("Cédula del estudiante inválida", "error");
        valido = false;
      }

      if (!fechaNac) {
        mostrarToast("Fecha de nacimiento requerida", "error");
        valido = false;
      }

      if (!validarEmail(emailEst)) {
        mostrarToast("Email del estudiante inválido", "error");
        valido = false;
      }

      if (!nombreAcud || nombreAcud.length < 3) {
        mostrarToast("Nombre del acudiente inválido", "error");
        valido = false;
      }

      if (!validarTelefono(telefonoAcud)) {
        mostrarToast("Teléfono inválido", "error");
        valido = false;
      }

      if (!validarEmail(emailAcud)) {
        mostrarToast("Email del acudiente inválido", "error");
        valido = false;
      }

      if (valido) {
        let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];

        solicitudes.push({
          id: Date.now(),
          colegio: colegio,
          estudiante: {
            nombre: nombreEst,
            cedula: cedulaEst,
            fechaNacimiento: fechaNac,
            lugarNacimiento: lugarNac,
            grado: grado,
            genero: genero,
            email: emailEst,
          },
          acudiente: {
            nombre: nombreAcud,
            cedula: cedulaAcud,
            telefono: telefonoAcud,
            email: emailAcud,
            direccion: direccion,
            ciudad: ciudad,
            pais: pais,
          },
          estado: "Pendiente",
          fecha: new Date().toLocaleDateString(),
          hora: new Date().toLocaleTimeString(),
        });

        localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

        mostrarToast("Inscripción registrada correctamente ✅", "success");
        formInscripcion.reset();

        actualizarDashboard();
      }
    });
  }
});

/* ==================== CAMBIAR FOTO ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const inputFoto = document.getElementById("fotoEstudiante");
  const nombreFoto = document.getElementById("fotoNombre");

  if (inputFoto && nombreFoto) {
    inputFoto.addEventListener("change", function (e) {
      if (e.target.files.length > 0) {
        nombreFoto.textContent = "✓ Archivo: " + e.target.files[0].name;
      } else {
        nombreFoto.textContent = "";
      }
    });
  }
});

/* ==================== CONSULTAR ESTADO ==================== */

document.addEventListener("DOMContentLoaded", function () {
  const formConsultaEstado = document.getElementById("formConsultaEstado");
  if (formConsultaEstado) {
    formConsultaEstado.addEventListener("submit", function (e) {
      e.preventDefault();

      const correo = document.getElementById("correoConsulta").value.trim();
      const resultadoDiv = document.getElementById("resultadoEstado");

      if (!validarEmail(correo)) {
        mostrarToast("Email inválido", "error");
        return;
      }

      let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
      let encontrados = solicitudes.filter(
        (s) => s.estudiante.email === correo || s.acudiente.email === correo,
      );

      resultadoDiv.innerHTML = "";

      if (encontrados.length > 0) {
        encontrados.forEach((s) => {
          resultadoDiv.innerHTML += `
                      <div class="card">
                          <h3>Solicitud de Inscripción</h3>
                          <p><strong>Estudiante:</strong> ${s.estudiante.nombre}</p>
                          <p><strong>Colegio:</strong> ${s.colegio}</p>
                          <p><strong>Grado:</strong> ${s.estudiante.grado}</p>
                          <p><strong>Estado:</strong> <span style="color: #0252a1; font-weight: bold;">${s.estado}</span></p>
                          <p><strong>Fecha de Solicitud:</strong> ${s.fecha} a las ${s.hora}</p>
                      </div>
                  `;
        });
        mostrarToast("Solicitudes encontradas", "success");
      } else {
        resultadoDiv.innerHTML =
          '<div class="card"><p>No se encontraron solicitudes con ese email ❌</p></div>';
        mostrarToast("No hay solicitudes", "warning");
      }
    });
  }
});

/* ==================== ACTUALIZAR DASHBOARD ==================== */

function actualizarDashboard() {
  let solicitudes = JSON.parse(localStorage.getItem("solicitudes")) || [];
  let usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

  const misSolicitudes = document.getElementById("misSolicitudes");
  if (misSolicitudes && usuarioActivo) {
    const misSolicitudesFiltr = solicitudes.filter(
      (s) => s.acudiente.email === usuarioActivo.email,
    );

    if (misSolicitudesFiltr.length > 0) {
      misSolicitudes.innerHTML = "";
      misSolicitudesFiltr.forEach((s) => {
        misSolicitudes.innerHTML += `
                    <p>📚 <strong>${s.colegio}</strong> - ${s.estado}</p>
                `;
      });
    }
  }

  const totalEl = document.getElementById("totalSolicitudes");
  const pendientesEl = document.getElementById("solicitudesPendientes");
  const aprobadasEl = document.getElementById("solicitudesAprobadas");

  if (totalEl) totalEl.textContent = solicitudes.length;
  if (pendientesEl)
    pendientesEl.textContent = solicitudes.filter(
      (s) => s.estado === "Pendiente",
    ).length;
  if (aprobadasEl)
    aprobadasEl.textContent = solicitudes.filter(
      (s) => s.estado === "Aprobada",
    ).length;
}
