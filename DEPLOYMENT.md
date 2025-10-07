# Link Shortener - Guía de Despliegue en Vercel

## ✅ Estado del Proyecto

El proyecto está **listo para producción** con las siguientes mejoras implementadas:

### 🎨 **Nuevas Características**
- ✅ **Modal QR elegante**: Reemplazó las ventanas emergentes por un modal moderno
- ✅ **Compatibilidad Next.js 15**: Todos los route handlers actualizados con `await params`
- ✅ **Debug deshabilitado en producción**: Solo se activa en desarrollo
- ✅ **Sin errores de linting**: Código limpio y validado

### 🔧 **Correcciones Realizadas**
- ✅ Error de `src` vacío en QRModal corregido
- ✅ Parámetros dinámicos actualizados para Next.js 15
- ✅ Debug de NextAuth solo en desarrollo
- ✅ Todos los componentes verificados y funcionando

## 🚀 Variables de Entorno Requeridas

Configura estas variables en Vercel:

```bash
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.vercel.app"
NEXTAUTH_SECRET="tu-secret-key-super-seguro"

# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# GitHub OAuth  
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://tu-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="tu-redis-token"

# Host público
NEXT_PUBLIC_BASE_HOST="tu-dominio.vercel.app"
```

## 📋 Pasos para Desplegar

### 1. **Preparar Base de Datos**
```bash
# En Vercel, ejecutar migraciones automáticamente
# El script de build incluye: prisma migrate deploy
```

### 2. **Configurar OAuth**

**Google OAuth:**
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- Crea un proyecto y habilita Google+ API
- Crea credenciales OAuth 2.0
- Agrega `https://tu-dominio.vercel.app/api/auth/callback/google` como redirect URI

**GitHub OAuth:**
- Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
- Crea una nueva OAuth App
- Agrega `https://tu-dominio.vercel.app/api/auth/callback/github` como Authorization callback URL

### 3. **Configurar Redis (Upstash)**
- Crea una cuenta en [Upstash](https://upstash.com/)
- Crea una base de datos Redis
- Copia la URL y token a las variables de entorno

### 4. **Desplegar en Vercel**
```bash
# Conectar repositorio a Vercel
# Las variables de entorno se configuran en el dashboard de Vercel
# El build se ejecutará automáticamente
```

## 🎯 Funcionalidades del Modal QR

El nuevo modal QR incluye:
- **Visualización grande**: QR de 256x256px para mejor legibilidad
- **Copiar URL**: Botón para copiar la URL del QR al portapapeles
- **Descargar**: Descarga el QR como archivo SVG
- **Diseño moderno**: Modal con sombras y animaciones suaves
- **Responsive**: Se adapta a diferentes tamaños de pantalla

## 🔄 Cron Jobs

El proyecto incluye un cron job que se ejecuta cada 5 minutos:
- **Ruta**: `/api/cron/flush-visits`
- **Función**: Actualiza contadores de visitas en la base de datos
- **Configuración**: Automática en `vercel.json`

## 📊 Monitoreo

Para monitorear la aplicación en producción:
- **Vercel Analytics**: Habilitar en el dashboard
- **Logs**: Revisar logs en Vercel para errores
- **Base de datos**: Monitorear conexiones y rendimiento
- **Redis**: Verificar uso de memoria y conexiones

## ✅ Checklist Pre-Despliegue

- [x] Variables de entorno configuradas
- [x] OAuth providers configurados
- [x] Base de datos PostgreSQL lista
- [x] Redis (Upstash) configurado
- [x] Dominio configurado en `NEXT_PUBLIC_BASE_HOST`
- [x] Debug deshabilitado en producción
- [x] Cron job configurado
- [x] Sin errores de linting
- [x] Compatible con Next.js 15

## 🚀 ¡Listo para Desplegar!

El proyecto está completamente preparado para producción. Solo necesitas:
1. Configurar las variables de entorno en Vercel
2. Conectar el repositorio
3. ¡Desplegar!

El build funcionará perfectamente en Vercel (Linux) aunque tengas problemas locales en Windows.
