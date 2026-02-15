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
        
        // Deshabilitar el botón mientras se envía
        const submitBtn = this.querySelector('.btn-submit');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
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
        
        // Formatear los datos para el email
        let emailBody = `NUEVA CONFIRMACIÓN DE ASISTENCIA\n\n`;
        emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        emailBody += `👤 NOMBRE: ${data.nombre || 'No especificado'}\n`;
        emailBody += `✅ ASISTENCIA: ${data.asistencia === 'si' ? 'Sí, no me lo perdería' : 'No podré asistir'}\n`;
        emailBody += `👥 ACOMPAÑANTES: ${data.acompanantes || '0'}\n`;
        emailBody += `🍽️ RESTRICCIÓN ALIMENTARIA: ${data.restriccion || 'Ninguna'}\n`;
        emailBody += `🍴 PLATO PRINCIPAL: ${data['plato-principal'] === 'pescado' ? 'Pescado' : data['plato-principal'] === 'carne' ? 'Carne' : 'No especificado'}\n`;
        emailBody += `🚌 AUTOBÚS: ${data.autobus === 'si' ? 'Sí' : 'No'}\n`;
        
        // Información de acompañantes
        if (data.acompanantes && parseInt(data.acompanantes) > 0) {
            emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            emailBody += `ACOMPAÑANTES:\n`;
            emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            
            for (let i = 1; i <= parseInt(data.acompanantes); i++) {
                const nombreKey = `acompanante-nombre-${i}`;
                const restriccionKey = `acompanante-restriccion-${i}`;
                const platoKey = `acompanante-plato-${i}`;
                const autobusKey = `acompanante-autobus-${i}`;
                
                emailBody += `Acompañante ${i}:\n`;
                emailBody += `  • Nombre: ${data[nombreKey] || 'No especificado'}\n`;
                emailBody += `  • Restricción: ${data[restriccionKey] || 'Ninguna'}\n`;
                const plato = data[platoKey];
                emailBody += `  • Plato: ${plato === 'pescado' ? 'Pescado' : plato === 'carne' ? 'Carne' : 'No especificado'}\n`;
                emailBody += `  • Autobús: ${data[autobusKey] === 'si' ? 'Sí' : 'No'}\n`;
                if (i < parseInt(data.acompanantes)) emailBody += `\n`;
            }
        }
        
        // Mensaje opcional
        if (data.mensaje && data.mensaje.trim()) {
            emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
            emailBody += `💌 MENSAJE PARA LOS NOVIOS:\n`;
            emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
            emailBody += `${data.mensaje}\n`;
        }
        
        // Enviar email usando la API de Vercel
        fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ formData: data })
        })
        .then(function(response) {
            if (!response.ok) {
                // Si la respuesta no es OK, intentar leer el error
                return response.json().then(function(err) {
                    throw new Error(err.error || `Error HTTP: ${response.status}`);
                }).catch(function() {
                    throw new Error(`Error HTTP: ${response.status}. La API no está disponible. ¿Estás en local? Necesitas desplegar en Vercel.`);
                });
            }
            return response.json();
        })
        .then(function(result) {
            if (result.success) {
                // Mostrar mensaje de éxito
                formMessage.className = 'form-message success';
                formMessage.textContent = '¡Gracias! Tu confirmación ha sido enviada. Te esperamos en nuestro gran día.';
                
                // Limpiar formulario
                rsvpForm.reset();
                acompanantesContainer.innerHTML = '';
                
                // Scroll suave al mensaje
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
        })
        .catch(function(error) {
            console.error('Error al enviar email:', error);
            formMessage.className = 'form-message error';
            
            // Mostrar mensaje más específico
            let errorMessage = 'Hubo un error al enviar tu confirmación. ';
            if (error.message && error.message.includes('local')) {
                errorMessage += 'Estás probando en local. Por favor, despliega en Vercel o contacta directamente a xbarnesortega@gmail.com';
            } else {
                errorMessage += 'Por favor, inténtalo de nuevo o contáctanos directamente en xbarnesortega@gmail.com';
            }
            
            formMessage.textContent = errorMessage;
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        })
        .finally(function() {
            // Rehabilitar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
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

