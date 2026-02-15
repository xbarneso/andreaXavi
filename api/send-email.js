// API Route para Vercel - Enviar email de confirmación
export default async function handler(req, res) {
  // CORS headers para permitir requests desde el frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Manejar preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    // Formatear el email
    let emailBody = `NUEVA CONFIRMACIÓN DE ASISTENCIA\n\n`;
    emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    emailBody += `👤 NOMBRE: ${formData.nombre || 'No especificado'}\n`;
    emailBody += `✅ ASISTENCIA: ${formData.asistencia === 'si' ? 'Sí, no me lo perdería' : 'No podré asistir'}\n`;
    emailBody += `👥 ACOMPAÑANTES: ${formData.acompanantes || '0'}\n`;
    emailBody += `🍽️ RESTRICCIÓN ALIMENTARIA: ${formData.restriccion || 'Ninguna'}\n`;
    emailBody += `🍴 PLATO PRINCIPAL: ${formData['plato-principal'] === 'pescado' ? 'Pescado' : formData['plato-principal'] === 'carne' ? 'Carne' : 'No especificado'}\n`;
    emailBody += `🚌 AUTOBÚS: ${formData.autobus === 'si' ? 'Sí' : 'No'}\n`;

    // Información de acompañantes
    if (formData.acompanantes && parseInt(formData.acompanantes) > 0) {
      emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      emailBody += `ACOMPAÑANTES:\n`;
      emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

      for (let i = 1; i <= parseInt(formData.acompanantes); i++) {
        emailBody += `Acompañante ${i}:\n`;
        emailBody += `  • Nombre: ${formData[`acompanante-nombre-${i}`] || 'No especificado'}\n`;
        emailBody += `  • Restricción: ${formData[`acompanante-restriccion-${i}`] || 'Ninguna'}\n`;
        const plato = formData[`acompanante-plato-${i}`];
        emailBody += `  • Plato: ${plato === 'pescado' ? 'Pescado' : plato === 'carne' ? 'Carne' : 'No especificado'}\n`;
        emailBody += `  • Autobús: ${formData[`acompanante-autobus-${i}`] === 'si' ? 'Sí' : 'No'}\n`;
        if (i < parseInt(formData.acompanantes)) emailBody += `\n`;
      }
    }

    // Mensaje opcional
    if (formData.mensaje && formData.mensaje.trim()) {
      emailBody += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      emailBody += `💌 MENSAJE PARA LOS NOVIOS:\n`;
      emailBody += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      emailBody += `${formData.mensaje}\n`;
    }

    // Enviar email usando Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurada');
      return res.status(500).json({ error: 'Configuración de email no disponible' });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Boda Andrea & Xavi <onboarding@resend.dev>',
        to: ['xbarnesortega@gmail.com'],
        subject: `Confirmación de Asistencia - ${formData.nombre || 'Invitado'}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Error desconocido de Resend' }));
      console.error('Error al enviar email:', error);
      return res.status(500).json({ 
        error: `Error al enviar el email: ${error.message || JSON.stringify(error)}` 
      });
    }

    const data = await response.json();
    return res.status(200).json({ success: true, message: 'Email enviado correctamente' });

  } catch (error) {
    console.error('Error en send-email:', error);
    return res.status(500).json({ 
      error: `Error interno: ${error.message || error.toString()}` 
    });
  }
}

