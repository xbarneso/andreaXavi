// ========================================
// SOBRE DE INVITACIÓN - VIDEO
// ========================================

(function() {
    const overlay = document.getElementById('envelopeOverlay');
    const video = document.getElementById('envelopeVideo');
    const hint = document.getElementById('envelopeTapHint');
    
    if (!overlay || !video) return;
    
    // Verificar si ya se abrió antes (en esta sesión)
    if (sessionStorage.getItem('envelopeOpened')) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
        return;
    }
    
    // Bloquear scroll mientras el sobre está visible
    document.body.style.overflow = 'hidden';
    
    let isPlaying = false;
    
    function playEnvelope() {
        if (isPlaying) return;
        isPlaying = true;
        
        // Ocultar el texto de ayuda
        if (hint) hint.classList.add('hide');
        
        // Reproducir el video
        video.play().catch(function() {
            closeOverlay();
        });
    }
    
    function closeOverlay() {
        // Añadir clase de revelado espectacular
        overlay.classList.add('reveal');
        
        setTimeout(function() {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
            sessionStorage.setItem('envelopeOpened', 'true');
        }, 400);
    }
    
    // Cuando el video termina, cerrar
    video.addEventListener('ended', function() {
        closeOverlay();
    });
    
    // Click en cualquier parte del overlay para reproducir
    overlay.addEventListener('click', playEnvelope);
    
    // Teclado (accesibilidad)
    overlay.setAttribute('tabindex', '0');
    overlay.setAttribute('role', 'button');
    overlay.setAttribute('aria-label', 'Abrir invitación de boda');
    
    overlay.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playEnvelope();
        }
    });
})();

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.remove('active');
        }
    });
});

// Menú hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Cambiar estilo de navbar al hacer scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Active nav link según sección visible
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    let current = '';
    const scrollY = window.pageYOffset;
    const navHeight = navbar.offsetHeight;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);

// Manejo del formulario - Duplicar campos de acompañantes
const acompanantesInput = document.getElementById('acompanantes');
const acompanantesContainer = document.getElementById('acompanantesContainer');

function generarCamposAcompanantes(numero) {
    acompanantesContainer.innerHTML = '';
    
    if (numero > 0) {
        for (let i = 1; i <= numero; i++) {
            const acompananteDiv = document.createElement('div');
            acompananteDiv.className = 'acompanante-group';
            acompananteDiv.innerHTML = `
                <h3 class="acompanante-title">Acompañante ${i}</h3>
                <div class="form-group">
                    <label for="acompanante-nombre-${i}">Nombre Completo *</label>
                    <input type="text" id="acompanante-nombre-${i}" name="acompanante-nombre-${i}" required>
                </div>
                <div class="form-group">
                    <label for="acompanante-restriccion-${i}">¿Tiene alguna restricción alimentaria?</label>
                    <input type="text" id="acompanante-restriccion-${i}" name="acompanante-restriccion-${i}" placeholder="Ej: Vegetariano, sin gluten, alergias...">
                </div>
                <div class="form-group">
                    <label for="acompanante-plato-${i}">Preferencia de plato principal *</label>
                    <select id="acompanante-plato-${i}" name="acompanante-plato-${i}" required>
                        <option value="">Selecciona una opción</option>
                        <option value="pescado">Pescado</option>
                        <option value="carne">Carne</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>¿Necesitará autobús? *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="acompanante-autobus-${i}" value="si" required>
                            <span>Sí</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="acompanante-autobus-${i}" value="no" required>
                            <span>No</span>
                        </label>
                    </div>
                </div>
            `;
            acompanantesContainer.appendChild(acompananteDiv);
        }
    }
}

if (acompanantesInput && acompanantesContainer) {
    acompanantesInput.addEventListener('change', function() {
        const numero = parseInt(this.value) || 0;
        generarCamposAcompanantes(numero);
    });
}

// Manejo del formulario
const rsvpForm = document.getElementById('rsvpForm');
const formMessage = document.getElementById('formMessage');

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Recopilar datos del formulario
        const formData = new FormData(this);
        const data = {};
        
        // Procesar datos del formulario
        for (let [key, value] of formData.entries()) {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        // Simular envío (aquí puedes agregar la lógica para enviar a un servidor)
        console.log('Datos del formulario:', data);
        
        // Mostrar mensaje de éxito
        formMessage.className = 'form-message success';
        formMessage.textContent = '¡Gracias! Tu confirmación ha sido enviada. Te esperamos en nuestro gran día.';
        
        // Limpiar formulario
        this.reset();
        acompanantesContainer.innerHTML = '';
        
        // Scroll suave al mensaje
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// Efecto parallax suave en el video
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.querySelector('.hero-section');
    const videoContainer = document.querySelector('.video-container');
    
    if (heroSection && videoContainer && scrolled < window.innerHeight) {
        videoContainer.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Cerrar menú móvil al hacer clic fuera
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Cuenta atrás hasta la boda (1 de agosto de 2026)
function updateCountdown() {
    var weddingDate = new Date('2026-08-01T00:00:00');
    var now = new Date();
    var difference = weddingDate - now;

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    if (daysEl && hoursEl && minutesEl && secondsEl && difference > 0) {
        var days = Math.floor(difference / (1000 * 60 * 60 * 24));
        var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(3, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }
}

// Observar elementos para animaciones
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.info-card, .contact-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Inicializar cuenta atrás - versión simple sin setTimeout
var countdownInitialized = false;
var lastUpdateTime = 0;

function tickCountdown(timestamp) {
    if (!lastUpdateTime) lastUpdateTime = timestamp;
    
    var elapsed = timestamp - lastUpdateTime;
    if (elapsed >= 1000) {
        updateCountdown();
        lastUpdateTime = timestamp;
    }
    
    window.requestAnimationFrame(tickCountdown);
}

function startCountdown() {
    if (countdownInitialized) return;
    
    var daysEl = document.getElementById('days');
    if (!daysEl) {
        // Si no existe, intentar de nuevo en el siguiente frame
        window.requestAnimationFrame(startCountdown);
        return;
    }
    
    countdownInitialized = true;
    updateCountdown();
    window.requestAnimationFrame(tickCountdown);
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startCountdown);
} else {
    startCountdown();
}

// Backup: intentar en el siguiente frame de animación
window.requestAnimationFrame(startCountdown);

