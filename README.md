# Invitación de Boda - Andrea & Xavi

Sitio web elegante y moderno para la invitación de boda de Andrea y Xavi.

## 🚀 Despliegue en Vercel

### Opción 1: Desde la interfaz de Vercel (Recomendado)

1. **Sube tu proyecto a GitHub** (opcional pero recomendado):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <tu-repositorio-github>
   git push -u origin main
   ```

2. **Despliega en Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "Import Project"
   - Conecta tu repositorio de GitHub o sube los archivos directamente
   - Vercel detectará automáticamente que es un sitio estático
   - Haz clic en "Deploy"

### Opción 2: Usando Vercel CLI

1. **Instala Vercel CLI** (si no lo tienes):
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión en Vercel**:
   ```bash
   vercel login
   ```

3. **Despliega el proyecto**:
   ```bash
   vercel
   ```

4. **Para producción**:
   ```bash
   vercel --prod
   ```

## 📁 Estructura del Proyecto

```
inv/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript
├── vercel.json         # Configuración de Vercel
├── package.json        # Configuración del proyecto
└── Descargas/
    └── boda.mp4        # Video de fondo (asegúrate de incluir este archivo)
```

## 📝 Notas Importantes

- **Video**: Asegúrate de incluir el archivo `Descargas/boda.mp4` en tu proyecto antes de desplegar.
- **Formulario**: Actualmente el formulario muestra un mensaje de confirmación. Para guardar los datos realmente, necesitarás configurar un backend (por ejemplo, Vercel Serverless Functions, Formspree, o similar).

## 🎨 Características

- ✅ Diseño responsive (móvil, tablet, escritorio)
- ✅ Video de fondo en la sección principal
- ✅ Navegación suave entre secciones
- ✅ Formulario de confirmación de asistencia
- ✅ Animaciones y efectos modernos
- ✅ Colores elegantes y claros

## 🔧 Desarrollo Local

Para probar el sitio localmente:

```bash
# Usando Python
python -m http.server 8000

# O usando Node.js (serve)
npx serve

# O usando PHP
php -S localhost:8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📧 Configuración del Formulario

Para que el formulario funcione completamente, puedes:

1. **Usar un servicio de formularios** como [Formspree](https://formspree.io/), [Getform](https://getform.io/), o similar
2. **Configurar Vercel Serverless Functions** para procesar el formulario
3. **Integrar con Google Sheets** usando Apps Script

## 🌐 Dominio Personalizado

En Vercel puedes configurar un dominio personalizado desde el dashboard del proyecto:
- Settings → Domains
- Agrega tu dominio personalizado

---

Hecho con ❤️ para Andrea & Xavi

