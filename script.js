const DOM = {
  authModal: document.getElementById("authModal"),
  loginErrorModal: document.getElementById("loginErrorModal"),
  loginErrorMessage: document.getElementById("loginErrorMessage"),
  loginForm: document.getElementById("formLoginModal"),
  loginRole: document.getElementById("loginRole"),
  roleViews: document.querySelectorAll(
    "#campos-acudiente, #campos-institucion, #campos-administrador",
  ),
  clock: document.getElementById("horaActual"),
  inscription: document.getElementById("inscripcion"),
  schoolField: document.getElementById("colegioSeleccionado"),
  studentName: document.getElementById("nombreEstudiante"),
  guardianName: document.getElementById("nombreAcudiente"),
  confirmSchool: document.getElementById("confirmColegio"),
  confirmStudent: document.getElementById("confirmEstudiante"),
  confirmGuardian: document.getElementById("confirmAcudiente"),
  photoName: document.getElementById("fotoNombre"),
  dashboard: document.getElementById("dashboard"),
  closeAuth: document.getElementById("closeAuthModal"),
  authTabs: document.querySelectorAll(".auth-tab"),
  authForms: document.querySelectorAll(".auth-form"),
  authButtons: document.querySelectorAll(".open-auth, .btn-login"),
  authRequired: document.querySelectorAll(".auth-required"),
  colegioCards: document.querySelectorAll(".colegio-card"),
  schoolButtons: document.querySelectorAll(".inscribirse-btn"),
  navLinks: document.querySelectorAll(".nav-links a"),
};

const getStored = (key, fallback = null) =>
  JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));

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
  const usuarioActivo = getStored("usuarioActivo");

  DOM.authRequired.forEach((elemento) => {
    elemento.classList.toggle("visible", Boolean(usuarioActivo));
  });

  DOM.authButtons.forEach((boton) => {
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

  if (DOM.clock) DOM.clock.textContent = hora;
}

function abrirModalAuth(mode = "login") {
  const { authModal: modal, authTabs: tabs, authForms: forms } = DOM;
  if (!modal) return;

  if (window.mapaCupos && typeof window.mapaCupos.closePopup === "function") {
    window.mapaCupos.closePopup();
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");

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

function limpiarLogin() {
  DOM.loginForm?.reset();
  DOM.loginRole?.classList.remove("is-invalid");
  DOM.roleViews.forEach((view) => {
    view.classList.add("hidden");
    view.setAttribute("aria-hidden", "true");
  });
  DOM.modal
    ?.querySelector(".auth-panel")
    ?.classList.remove(
      "role-acudiente",
      "role-institucion",
      "role-administrador",
    );
  ["errorRoleLogin", "errorEmailLogin", "errorPassLogin"].forEach((id) => {
    const error = document.getElementById(id);
    if (error) error.textContent = "";
  });
  cerrarErrorLogin();
}

function cerrarModalAuth() {
  const { authModal: modal } = DOM;
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  limpiarLogin();
}

function mostrarErrorLogin(mensaje) {
  DOM.loginErrorMessage.textContent = mensaje;
  DOM.loginErrorModal.classList.add("is-open");
  DOM.loginErrorModal.setAttribute("aria-hidden", "false");
}

function cerrarErrorLogin() {
  DOM.loginErrorModal.classList.remove("is-open");
  DOM.loginErrorModal.setAttribute("aria-hidden", "true");
}

function guardarColegioSeleccionado(colegio) {
  localStorage.setItem("colegioSeleccionado", colegio || "");
  DOM.schoolField && (DOM.schoolField.value = colegio || "");
  DOM.confirmSchool && (DOM.confirmSchool.textContent = colegio || "-");
}

function actualizarConfirmacion() {
  const nombre = DOM.studentName?.value.trim() || "-";
  const acudiente = DOM.guardianName?.value.trim() || "-";
  DOM.confirmStudent && (DOM.confirmStudent.textContent = nombre);
  DOM.confirmGuardian && (DOM.confirmGuardian.textContent = acudiente);
}

function obtenerInfoColegio(nombre) {
  const tarjeta = [...DOM.colegioCards].find(
    (card) => card.querySelector("h3")?.textContent.trim() === nombre,
  );
  if (!tarjeta) return {};
  const { city, grade, level, availability } = tarjeta.dataset;
  return { ciudad: city, grado: grade, nivel: level, cupos: availability };
}

function bindSchoolButtons() {
  DOM.schoolButtons.forEach((boton) => {
    boton.addEventListener("click", function () {
      const colegio = this.dataset.colegio;
      const usuario = getStored("usuarioActivo");

      guardarColegioSeleccionado(colegio);

      if (!usuario) {
        abrirModalAuth("login");
        mostrarToast("Primero debes iniciar sesión para continuar.", "warning");
        return;
      }

      DOM.inscription?.scrollIntoView({ behavior: "smooth" });
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

  DOM.navLinks.forEach((link) => {
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

    DOM.colegioCards.forEach((card) => {
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
  const roleFields = {
    acudiente: ["emailLoginAcudiente", "passwordLoginAcudiente"],
    institucion: ["emailLoginInstitucion", "passwordLoginInstitucion"],
    administrador: ["emailLoginAdministrador", "passwordLoginAdministrador"],
  };
  const roleThemes = [
    "role-acudiente",
    "role-institucion",
    "role-administrador",
  ];

  DOM.loginRole?.addEventListener("change", ({ target }) => {
    const role = target.value;
    const panel = DOM.modal?.querySelector(".auth-panel");
    panel?.classList.remove(...roleThemes);
    role && panel?.classList.add(`role-${role}`);
    DOM.roleViews.forEach((view) => {
      view.classList.add("hidden");
      view.setAttribute("aria-hidden", "true");
    });
    const activeView = document.getElementById(`campos-${role}`);
    activeView?.classList.remove("hidden");
    activeView?.setAttribute("aria-hidden", "false");
  });

  formLoginModal?.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = DOM.loginRole?.value;
    const [emailId, passwordId] = roleFields[role] || [];
    const email = document.getElementById(emailId)?.value.trim();
    const password = document.getElementById(passwordId)?.value;
    const activeView = document.getElementById(`campos-${role}`);

    if (!role) {
      document.getElementById("errorRoleLogin").textContent =
        "Selecciona un rol";
      mostrarErrorLogin("Selecciona el tipo de acceso antes de continuar.");
      return;
    }
    document.getElementById("errorRoleLogin").textContent = "";

    const emptyField = [...activeView.querySelectorAll("input, select")].find(
      (field) => !field.value.trim(),
    );
    if (emptyField) {
      emptyField.focus();
      mostrarErrorLogin(
        `Completa el campo: ${emptyField.labels?.[0]?.textContent || "dato requerido"}.`,
      );
      return;
    }

    if (!validarEmail(email)) {
      document.getElementById("errorEmailLogin").textContent =
        "Correo inválido";
      mostrarErrorLogin("Ingresa un correo electrónico válido.");
      return;
    }
    document.getElementById("errorEmailLogin").textContent = "";

    if (!validarPassword(password)) {
      document.getElementById("errorPassLogin").textContent =
        "La contraseña debe tener al menos 6 caracteres";
      mostrarErrorLogin("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    document.getElementById("errorPassLogin").textContent = "";

    const registros = getStored("registros", []);
    const usuario = registros.find(
      (item) =>
        item.email === email &&
        item.password === password &&
        (item.rol === role || (role === "acudiente" && item.rol === "padre")),
    );

    if (!usuario) {
      mostrarErrorLogin("El correo, la contraseña o el rol son incorrectos.");
      return;
    }

    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    actualizarVisibilidad();
    cerrarModalAuth();
    mostrarToast("Inicio de sesión exitoso ✅", "success");

    const colegioSeleccionado = localStorage.getItem("colegioSeleccionado");
    if (colegioSeleccionado) {
      DOM.inscription?.scrollIntoView({ behavior: "smooth" });
    }
  });

  ["closeLoginError", "acceptLoginError"].forEach((id) =>
    document.getElementById(id)?.addEventListener("click", cerrarErrorLogin),
  );
  DOM.loginErrorModal?.addEventListener("click", (event) => {
    if (event.target === DOM.loginErrorModal) cerrarErrorLogin();
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

    const registros = getStored("registros", []);
    registros.push({ nombre, email, password, rol });
    localStorage.setItem("registros", JSON.stringify(registros));

    formRegistroModal.reset();
    cerrarModalAuth();
    mostrarToast("Cuenta creada. Inicia sesión para continuar ✅", "success");
  });

  DOM.authTabs.forEach((tab) => {
    tab.addEventListener("click", () => abrirModalAuth(tab.dataset.authTab));
  });

  document.querySelectorAll(".switch-auth").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      abrirModalAuth(link.dataset.authTarget || "register");
    });
  });

  DOM.closeAuth?.addEventListener("click", cerrarModalAuth);
  DOM.authModal?.addEventListener("click", (event) => {
    if (event.target.id === "authModal") cerrarModalAuth();
  });

  DOM.authButtons.forEach((boton) => {
    boton.addEventListener("click", () =>
      abrirModalAuth(boton.dataset.authTarget || "login"),
    );
  });
}

function bindLogout() {
  const logoutButton = document.getElementById("btnLogout");
  logoutButton?.addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    limpiarLogin();
    actualizarVisibilidad();
    mostrarToast("Sesión cerrada ✅", "success");
    window.location.hash = "#inicio";
  });
}

function bindPhotoInput() {
  const input = document.getElementById("fotoEstudiante");
  const { photoName: nombre } = DOM;
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

    const colegio = DOM.schoolField?.value || "-";
    const nombre = DOM.studentName?.value || "-";
    const acudiente = DOM.guardianName?.value || "-";
    DOM.confirmSchool && (DOM.confirmSchool.textContent = colegio);
    DOM.confirmStudent && (DOM.confirmStudent.textContent = nombre);
    DOM.confirmGuardian && (DOM.confirmGuardian.textContent = acudiente);
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
    const colegio = DOM.schoolField?.value || "Sin colegio";
    const estudiante = DOM.studentName?.value || "";
    const infoColegio = obtenerInfoColegio(colegio);

    const solicitudes = JSON.parse(localStorage.getItem("solicitudes") || "[]");
    solicitudes.push({
      colegio,
      estudiante,
      ...infoColegio,
      fecha: new Date().toLocaleDateString(),
      estado: "En revisión",
    });
    localStorage.setItem("solicitudes", JSON.stringify(solicitudes));

    mostrarToast("Solicitud enviada correctamente ✅", "success");
    initDashboard();
    formInscripcion.reset();
    DOM.photoName.textContent = "";
    DOM.confirmSchool.textContent =
      DOM.confirmStudent.textContent =
      DOM.confirmGuardian.textContent =
        "-";
    currentStep = 0;
    updateView();
    DOM.dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  DOM.studentName?.addEventListener("input", actualizarConfirmacion);
  DOM.guardianName?.addEventListener("input", actualizarConfirmacion);

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
      const infoColegio = {
        ...obtenerInfoColegio(solicitud.colegio),
        ...solicitud,
      };

      resultado.innerHTML = `
      <div class="card">
        <h3>Estado de la solicitud</h3>
        <p><strong>Estado:</strong> ${infoColegio.estado}</p>
        <p><strong>Colegio:</strong> ${infoColegio.colegio}</p>
        <p><strong>Ciudad:</strong> ${infoColegio.ciudad || "No disponible"}</p>
        <p><strong>Nivel:</strong> ${infoColegio.nivel || "No disponible"}</p>
        <p><strong>Grado:</strong> ${infoColegio.grado || "No disponible"}</p>
        <p><strong>Cupos disponibles:</strong> ${infoColegio.cupos || "No disponible"}</p>
        <p><strong>Estudiante:</strong> ${infoColegio.estudiante || "No disponible"}</p>
        <p><strong>Fecha:</strong> ${infoColegio.fecha}</p>
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

function lazyInitMap() {
  const mapElement = document.getElementById("mapa");
  if (!mapElement) return;
  let observer;
  const load = () => {
    observer?.disconnect();
    initMap();
  };
  observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => entry.isIntersecting && load(), {
          rootMargin: "300px",
        })
      : null;
  observer ? observer.observe(mapElement) : load();
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
    DOM.authRequired.forEach((el) => el.classList.add("visible"));
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
  lazyInitMap();
  initDashboard();

  const colegioGuardado = localStorage.getItem("colegioSeleccionado");
  if (colegioGuardado) {
    guardarColegioSeleccionado(colegioGuardado);
  }
});
