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

function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarTelefono(telefono) {
  const valor = String(telefono || "").replace(/\D/g, "");
  return valor.length >= 7;
}

function validarPassword(password) {
  return String(password || "").length >= 6;
}

function actualizarVisibilidad() {
  const usuarioActivo = JSON.parse(
    localStorage.getItem("usuarioActivo") || "null",
  );
  const protegidos = document.querySelectorAll(".auth-required");

  protegidos.forEach((elemento) => {
    elemento.classList.toggle("visible", Boolean(usuarioActivo));
  });

  const authButtons = document.querySelectorAll(".open-auth, .btn-login");
  authButtons.forEach((boton) => {
    boton.style.display = usuarioActivo ? "none" : "inline-flex";
  });

  const logoutButton = document.getElementById("btnLogout");
  const logoutContainer = logoutButton?.closest(".auth-only");
  if (logoutContainer) {
    logoutContainer.style.display = usuarioActivo ? "block" : "none";
  }
}

function actualizarHora() {
  const now = new Date();
  const hora = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((valor) => String(valor).padStart(2, "0"))
    .join(":");

  const reloj = document.getElementById("horaActual");
  if (reloj) {
    reloj.textContent = hora;
  }
}

function abrirModalAuth(mode = "login") {
  const modal = document.getElementById("authModal");
  if (!modal) return;

  if (window.mapaCupos && typeof window.mapaCupos.closePopup === "function") {
    window.mapaCupos.closePopup();
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

  const tabs = document.querySelectorAll(".auth-tab");
  const forms = document.querySelectorAll(".auth-form");

  tabs.forEach((tab) => {
    const activo = tab.dataset.authTab === mode;
    tab.classList.toggle("active", activo);
  });

  forms.forEach((form) => {
    const activo =
      form.id === (mode === "login" ? "formLoginModal" : "formRegistroModal");
    form.classList.toggle("active", activo);
  });
}

function cerrarModalAuth() {
  const modal = document.getElementById("authModal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function guardarColegioSeleccionado(colegio) {
  localStorage.setItem("colegioSeleccionado", colegio || "");
  const campo = document.getElementById("colegioSeleccionado");
  if (campo) {
    campo.value = colegio || "";
  }
  const confirmColegio = document.getElementById("confirmColegio");
  if (confirmColegio) {
    confirmColegio.textContent = colegio || "-";
  }
}

function actualizarConfirmacion() {
  const nombre =
    document.getElementById("nombreEstudiante")?.value?.trim() || "-";
  const acudiente =
    document.getElementById("nombreAcudiente")?.value?.trim() || "-";
  const confirmEstudiante = document.getElementById("confirmEstudiante");
  const confirmAcudiente = document.getElementById("confirmAcudiente");

  if (confirmEstudiante) confirmEstudiante.textContent = nombre;
  if (confirmAcudiente) confirmAcudiente.textContent = acudiente;
}

function bindSchoolButtons() {
  const botones = document.querySelectorAll(".inscribirse-btn");
  botones.forEach((boton) => {
    boton.addEventListener("click", function () {
      const colegio = this.dataset.colegio;
      const usuario = JSON.parse(
        localStorage.getItem("usuarioActivo") || "null",
      );

      guardarColegioSeleccionado(colegio);

      if (!usuario) {
        abrirModalAuth("login");
        mostrarToast("Primero debes iniciar sesión para continuar.", "warning");
        return;
      }

      document
        .getElementById("inscripcion")
        ?.scrollIntoView({ behavior: "smooth" });
      mostrarToast(`Colegio seleccionado: ${colegio}`, "success");
    });
  });
}

function bindThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("themePreference") === "dark";
  document.body.classList.toggle("dark-mode", saved);
  toggle && (toggle.textContent = saved ? "☀️" : "🌙");

  toggle?.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("themePreference", isDark ? "dark" : "light");
    toggle.textContent = isDark ? "☀️" : "🌙";
  });
}

function bindMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navContainer");

  menuToggle?.addEventListener("click", () => {
    const active = nav.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(active));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function bindSearchFilters() {
  const buscador = document.getElementById("buscadorColegios");
  const cityFilter = document.getElementById("cityFilter");
  const gradeFilter = document.getElementById("gradeFilter");
  const levelFilter = document.getElementById("levelFilter");
  const availableOnly = document.getElementById("availableOnly");

  const applyFilters = () => {
    const texto = (buscador?.value || "").trim().toLowerCase();
    const city = cityFilter?.value || "";
    const grade = gradeFilter?.value || "";
    const level = levelFilter?.value || "";
    const onlyAvailable = availableOnly?.checked || false;

    document.querySelectorAll(".colegio-card").forEach((card) => {
      const nombre = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const dataCity = card.dataset.city || "";
      const dataGrade = card.dataset.grade || "";
      const dataLevel = card.dataset.level || "";
      const disponibilidad = Number(card.dataset.availability || 0);

      const matchesText =
        !texto ||
        nombre.includes(texto) ||
        dataCity.toLowerCase().includes(texto);
      const matchesCity = !city || dataCity === city;
      const matchesGrade = !grade || dataGrade === grade;
      const matchesLevel = !level || dataLevel === level;
      const matchesAvailability = !onlyAvailable || disponibilidad > 0;

      const visible =
        matchesText &&
        matchesCity &&
        matchesGrade &&
        matchesLevel &&
        matchesAvailability;
      card.style.display = visible ? "flex" : "none";
    });
  };

  [buscador, cityFilter, gradeFilter, levelFilter, availableOnly].forEach(
    (input) => {
      input?.addEventListener("input", applyFilters);
      input?.addEventListener("change", applyFilters);
    },
  );
}

function bindAuthForms() {
  const formLoginModal = document.getElementById("formLoginModal");
  const formRegistroModal = document.getElementById("formRegistroModal");

  formLoginModal?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("emailLoginModal")?.value.trim();
    const password = document.getElementById("passwordLoginModal")?.value;

    if (!validarEmail(email)) {
      document.getElementById("errorEmailLogin").textContent =
        "Correo inválido";
      return;
    }
    document.getElementById("errorEmailLogin").textContent = "";

    if (!validarPassword(password)) {
      document.getElementById("errorPassLogin").textContent =
        "La contraseña debe tener al menos 6 caracteres";
      return;
    }
    document.getElementById("errorPassLogin").textContent = "";

    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    const usuario = registros.find(
      (item) => item.email === email && item.password === password,
    );

    if (!usuario) {
      mostrarToast("Email o contraseña incorrectos.", "error");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    actualizarVisibilidad();
    cerrarModalAuth();
    mostrarToast("Inicio de sesión exitoso ✅", "success");

    const colegioSeleccionado = localStorage.getItem("colegioSeleccionado");
    if (colegioSeleccionado) {
      document
        .getElementById("inscripcion")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  });

  formRegistroModal?.addEventListener("submit", function (event) {
    event.preventDefault();

    const nombre = document.getElementById("nombreRegistroModal")?.value.trim();
    const email = document.getElementById("emailRegistroModal")?.value.trim();
    const password = document.getElementById("passwordRegistroModal")?.value;
    const rol = document.getElementById("rolRegistroModal")?.value;

    if (!nombre || nombre.length < 3) {
      document.getElementById("errorNombre").textContent =
        "Escribe un nombre válido";
      return;
    }
    document.getElementById("errorNombre").textContent = "";

    if (!validarEmail(email)) {
      document.getElementById("errorEmailReg").textContent = "Correo inválido";
      return;
    }
    document.getElementById("errorEmailReg").textContent = "";

    if (!validarPassword(password)) {
      document.getElementById("errorPassReg").textContent =
        "La contraseña debe tener al menos 6 caracteres";
      return;
    }
    document.getElementById("errorPassReg").textContent = "";

    if (!rol) {
      document.getElementById("errorRol").textContent = "Selecciona un rol";
      return;
    }
    document.getElementById("errorRol").textContent = "";

    const registros = JSON.parse(localStorage.getItem("registros") || "[]");
    registros.push({ nombre, email, password, rol });
    localStorage.setItem("registros", JSON.stringify(registros));

    localStorage.setItem(
      "usuarioActivo",
      JSON.stringify({ nombre, email, password, rol }),
    );
    actualizarVisibilidad();
    cerrarModalAuth();
    mostrarToast("Cuenta creada exitosamente ✅", "success");
  });

  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => abrirModalAuth(tab.dataset.authTab));
  });

  document.querySelectorAll(".switch-auth").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      abrirModalAuth(link.dataset.authTarget || "register");
    });
  });

  document
    .getElementById("closeAuthModal")
    ?.addEventListener("click", cerrarModalAuth);
  document.getElementById("authModal")?.addEventListener("click", (event) => {
    if (event.target.id === "authModal") cerrarModalAuth();
  });

  document.querySelectorAll(".open-auth, .btn-login").forEach((boton) => {
    boton.addEventListener("click", () =>
      abrirModalAuth(boton.dataset.authTarget || "login"),
    );
  });
}

function bindLogout() {
  const logoutButton = document.getElementById("btnLogout");
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    actualizarVisibilidad();
    mostrarToast("Sesión cerrada ✅", "success");
    window.location.hash = "#inicio";
  });
}

function bindPhotoInput() {
  const input = document.getElementById("fotoEstudiante");
  const nombre = document.getElementById("fotoNombre");
  input?.addEventListener("change", function () {
    const fileName = this.files?.[0]?.name || "";
    nombre.textContent = fileName ? `Archivo seleccionado: ${fileName}` : "";
  });
}

function bindStepperForm() {
  const steps = [...document.querySelectorAll(".step")];
  const panels = [...document.querySelectorAll(".form-step")];
  const nextButton = document.getElementById("nextStep");
  const prevButton = document.getElementById("prevStep");
  const submitButton = document.getElementById("submitInscripcion");
  let currentStep = 0;

  const updateView = () => {
    steps.forEach((step, index) =>
      step.classList.toggle("active", index === currentStep),
    );
    panels.forEach((panel, index) =>
      panel.classList.toggle("active", index === currentStep),
    );

    prevButton.style.display = currentStep === 0 ? "none" : "inline-flex";
    nextButton.classList.toggle("hidden", currentStep === panels.length - 1);
    submitButton.classList.toggle("hidden", currentStep !== panels.length - 1);

    const colegio =
      document.getElementById("colegioSeleccionado")?.value || "-";
    const nombre = document.getElementById("nombreEstudiante")?.value || "-";
    const acudiente = document.getElementById("nombreAcudiente")?.value || "-";
    document.getElementById("confirmColegio") &&
      (document.getElementById("confirmColegio").textContent = colegio);
    document.getElementById("confirmEstudiante") &&
      (document.getElementById("confirmEstudiante").textContent = nombre);
    document.getElementById("confirmAcudiente") &&
      (document.getElementById("confirmAcudiente").textContent = acudiente);
  };

  prevButton?.addEventListener("click", () => {
    if (currentStep > 0) currentStep -= 1;
    updateView();
  });

  nextButton?.addEventListener("click", () => {
    const actualPanel = panels[currentStep];
    const requiredFields = actualPanel.querySelectorAll(
      "input[required], select[required]",
    );
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.focus();
      }
    });

    if (!isValid) {
      mostrarToast("Completa todos los campos obligatorios.", "error");
      return;
    }

    if (currentStep < panels.length - 1) currentStep += 1;
    updateView();
  });

  const formInscripcion = document.getElementById("formInscripcion");
  formInscripcion?.addEventListener("submit", (event) => {
    event.preventDefault();
    const colegio =
      document.getElementById("colegioSeleccionado")?.value || "Sin colegio";
    const estudiante = document.getElementById("nombreEstudiante")?.value || "";

    const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    solicitudes.push({
      colegio,
      estudiante,
      fecha: new Date().toLocaleDateString(),
      estado: "En revisión",
    });
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

    mostrarToast("Solicitud enviada correctamente ✅", "success");
    formInscripcion.reset();
    document.getElementById("fotoNombre").textContent = "";
    document.getElementById("confirmColegio").textContent = "-";
    document.getElementById("confirmEstudiante").textContent = "-";
    document.getElementById("confirmAcudiente").textContent = "-";
    currentStep = 0;
    updateView();
  });

  document
    .getElementById("nombreEstudiante")
    ?.addEventListener("input", actualizarConfirmacion);
  document
    .getElementById("nombreAcudiente")
    ?.addEventListener("input", actualizarConfirmacion);

  updateView();
}

function bindConsultaEstado() {
  document
    .getElementById("formConsultaEstado")
    ?.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("correoConsulta")?.value.trim();
      const resultado = document.getElementById("resultadoEstado");

      if (!validarEmail(email)) {
        resultado.innerHTML =
          '<div class="card"><h3>Correo no válido</h3><p>Ingresa un correo electrónico correcto.</p></div>';
        return;
      }

      const solicitudes = JSON.parse(
        localStorage.getItem("solicitudes") || "[]",
      );
      const solicitud = solicitudes[0] || {
        estado: "En revisión",
        colegio: "Institución Educativa Santa Librada",
        fecha: "09/08/2026",
      };

      resultado.innerHTML = `
      <div class="card">
        <h3>Estado de la solicitud</h3>
        <p><strong>Estado:</strong> ${solicitud.estado}</p>
        <p><strong>Colegio:</strong> ${solicitud.colegio}</p>
        <p><strong>Fecha:</strong> ${solicitud.fecha}</p>
      </div>
    `;
    });
}

function initMap() {
  if (typeof L === "undefined") return;

  const map = L.map("mapa").setView([3.9, -76.2], 8);
  window.mapaCupos = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  const colegios = [
    {
      nombre: "Institución Educativa Santa Librada",
      ciudad: "Cali",
      cupos: 70,
      coords: [3.4516, -76.532],
    },
    {
      nombre: "Institución Educativa Las Flores",
      ciudad: "Palmira",
      cupos: 45,
      coords: [3.5394, -76.3036],
    },
    {
      nombre: "Institución Educativa Tulio Enrique Tascón",
      ciudad: "Buga",
      cupos: 40,
      coords: [3.9009, -76.2988],
    },
    {
      nombre: "Institución Educativa Ciudad de Cartago",
      ciudad: "Cartago",
      cupos: 35,
      coords: [4.7464, -75.9117],
    },
    {
      nombre: "Institución Educativa Jorge Robledo",
      ciudad: "Tuluá",
      cupos: 50,
      coords: [4.0845, -76.1951],
    },
    {
      nombre: "Institución Educativa Simón Bolívar",
      ciudad: "Yumbo",
      cupos: 42,
      coords: [3.5882, -76.5331],
    },
    {
      nombre: "Institución Educativa San José",
      ciudad: "Jamundí",
      cupos: 36,
      coords: [3.2592, -76.5612],
    },
    {
      nombre: "Institución Educativa La Unión",
      ciudad: "La Unión",
      cupos: 32,
      coords: [4.5333, -76.0947],
    },
    {
      nombre: "Institución Educativa Ciudad de Zarzal",
      ciudad: "Zarzal",
      cupos: 28,
      coords: [4.3895, -76.0705],
    },
    {
      nombre: "Institución Educativa Ginebra",
      ciudad: "Ginebra",
      cupos: 30,
      coords: [3.7263, -76.2682],
    },
    {
      nombre: "Institución Educativa de Sevilla",
      ciudad: "Sevilla",
      cupos: 26,
      coords: [3.9466, -76.2925],
    },
    {
      nombre: "Institución Educativa de Dagua",
      ciudad: "Dagua",
      cupos: 66,
      coords: [3.6568, -76.6992],
    },
  ];

  colegios.forEach((colegio) => {
    const marker = L.marker(colegio.coords).addTo(map);
    marker.bindPopup(
      `
      <div class="map-popup">
        <div class="map-popup-header">
          <span class="map-popup-badge">Disponible</span>
        </div>
        <h4>${colegio.nombre}</h4>
        <p>📍 ${colegio.ciudad}</p>
        <p>📚 ${colegio.cupos} cupos disponibles</p>
        <button type="button" class="btn btn-primary inscribirse-btn popup-inscribirse-btn" data-colegio="${colegio.nombre}">Solicitar cupo</button>
      </div>
    `,
      {
        className: "custom-map-popup",
        autoPan: true,
        closeButton: true,
        closeOnClick: true,
        maxWidth: 320,
      },
    );
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".inscribirse-btn")) {
      const colegio = event.target.dataset.colegio;
      guardarColegioSeleccionado(colegio);
      if (!JSON.parse(localStorage.getItem("usuarioActivo") || "null")) {
        abrirModalAuth("login");
        return;
      }
      document
        .getElementById("inscripcion")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function initDashboard() {
  const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
  const totalSolicitudes = document.getElementById("totalSolicitudes");
  const solicitudesPendientes = document.getElementById(
    "solicitudesPendientes",
  );
  const solicitudesAprobadas = document.getElementById("solicitudesAprobadas");
  const misSolicitudes = document.getElementById("misSolicitudes");

  if (totalSolicitudes)
    totalSolicitudes.textContent = String(solicitudes.length || 0);
  if (solicitudesPendientes)
    solicitudesPendientes.textContent = String(
      solicitudes.filter((item) => item.estado === "En revisión").length || 0,
    );
  if (solicitudesAprobadas)
    solicitudesAprobadas.textContent = String(
      solicitudes.filter((item) => item.estado === "Aprobada").length || 0,
    );

  if (misSolicitudes && solicitudes.length) {
    misSolicitudes.innerHTML = solicitudes
      .slice(0, 3)
      .map((item) => `<p>${item.colegio} — <strong>${item.estado}</strong></p>`)
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = JSON.parse(
    localStorage.getItem("usuarioActivo") || "null",
  );
  if (usuarioActivo) {
    document
      .querySelectorAll(".auth-required")
      .forEach((el) => el.classList.add("visible"));
  }

  actualizarVisibilidad();
  actualizarHora();
  setInterval(actualizarHora, 1000);

  bindThemeToggle();
  bindMenu();
  bindSchoolButtons();
  bindSearchFilters();
  bindAuthForms();
  bindLogout();
  bindPhotoInput();
  bindStepperForm();
  bindConsultaEstado();
  initMap();
  initDashboard();

  const colegioGuardado = localStorage.getItem("colegioSeleccionado");
  if (colegioGuardado) {
    guardarColegioSeleccionado(colegioGuardado);
  }
});
