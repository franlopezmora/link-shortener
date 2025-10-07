# 🔗 Link Shortener

Un acortador de enlaces moderno y rápido construido con Next.js 15, NextAuth, Prisma y Redis.

## ✨ Características

- 🚀 **Ultra rápido**: Redirecciones instantáneas con cache Edge y Redis
- 🔐 **Seguro**: Autenticación OAuth con Google y GitHub
- ⏰ **Enlaces con expiración**: Controla cuándo expiran tus enlaces
- 📊 **Analytics**: Estadísticas de visitas en tiempo real
- 📱 **Códigos QR**: Generación automática de códigos QR
- 🎨 **Modal QR elegante**: Visualización moderna de códigos QR
- 🔄 **Cron jobs**: Actualización automática de contadores

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth
- **Base de datos**: PostgreSQL con Prisma ORM
- **Cache**: Redis (Upstash)
- **Autenticación**: Google OAuth, GitHub OAuth
- **Despliegue**: Vercel

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL
- Redis (Upstash recomendado)

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/link-shortener.git
cd link-shortener
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
```bash
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/link_shortener"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="tu-github-client-id"
GITHUB_CLIENT_SECRET="tu-github-client-secret"

# Redis
UPSTASH_REDIS_REST_URL="https://tu-redis-url.upstash.io"
UPSTASH_REDIS_REST_TOKEN="tu-redis-token"

# Host público
NEXT_PUBLIC_BASE_HOST="localhost:3000"
```

4. **Configura la base de datos**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📋 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

## 🎯 Uso

1. **Inicia sesión** con Google o GitHub
2. **Crea enlaces** cortos con slugs personalizados
3. **Configura expiración** opcional para tus enlaces
4. **Visualiza estadísticas** de visitas
5. **Descarga códigos QR** para compartir

## 🔧 Configuración OAuth

### Google OAuth
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y habilita Google+ API
3. Crea credenciales OAuth 2.0
4. Agrega `http://localhost:3000/api/auth/callback/google` como redirect URI

### GitHub OAuth
1. Ve a [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Crea una nueva OAuth App
3. Agrega `http://localhost:3000/api/auth/callback/github` como Authorization callback URL

## 🚀 Despliegue en Vercel

Consulta la [guía completa de despliegue](DEPLOYMENT.md) para instrucciones detalladas.

**Pasos rápidos:**
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. ¡Despliega!

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # API Routes
│   ├── dashboard/     # Dashboard de usuario
│   ├── login/         # Página de login
│   └── page.tsx       # Página principal
├── components/        # Componentes React
├── lib/              # Utilidades y configuración
└── middleware.ts     # Middleware de redirección
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework de React
- [Prisma](https://prisma.io/) - ORM para TypeScript
- [NextAuth](https://next-auth.js.org/) - Autenticación para Next.js
- [Upstash](https://upstash.com/) - Redis serverless
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
