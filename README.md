# CHAIR-OS - Frontend

Sistema Operativo para Barberías - Frontend React

## Quick Start

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Stack Tecnológico

- **React 18** - UI Library
- **Vite** - Bundler y dev server
- **Tailwind CSS** - Estilos utility-first
- **React Router** - Enrutamiento
- **Lucide React** - Iconos

## Estructura del Proyecto

```
src/
├── services/
│   └── api.js          # Servicio de API
├── App.jsx              # Componente principal con rutas
├── main.jsx             # Entry point
└── index.css             # Estilos globales
```

## Páginas

- **Dashboard** - Resumen de ventas, barberos, alertas
- **Servicios** - Registro de cortes/servicios
- **Barberos** - Gestión de barberos y comisiones
- **Wallet** - Wallets de barberos e historial
- **Caja** - Gestión de caja diaria
- **Inventario** - Control de productos
- **Configuración** - Tasa BCV y parámetros

## Deploy en Vercel

1. Crear repo en GitHub
2. Importar proyecto en Vercel
3. Vercel detecta Vite automáticamente
4. Deploy automático en cada push

## Desarrollo Local

El frontend se conecta al backend en `http://localhost:3000` gracias al proxy configurado en `vite.config.js`.

```bash
# Terminal 1: Backend
cd ../backend
npm install
npm run dev

# Terminal 2: Frontend
npm install
npm run dev
```

Abrir http://localhost:5173

## Datos de Prueba

```
Email: owner@barbershop.com
Password: password123
```
