# Salvar 🇪🇨

**Rescata sabor, protege la naturaleza.**

Salvar es la plataforma líder en Ecuador para reducir el desperdicio de alimentos, conectando negocios locales con usuarios que desean rescatar bolsas sorpresa de comida a precios increíbles.

## 🚀 Características Principales

- **Marketplace Local:** Explora "Huecas", "Agachaditos", Panaderías y más.
- **Identidad Regional:** Filtros por regiones (Costa, Sierra, Oriente, Galápagos) y comida típica.
- **Pagos Seguros:** Integración profesional con Kushki.
- **Diseño Premium:** Interfaz inspirada en estándares globales (Uber Eats/Deliveroo) con alma ecuatoriana.
- **Impacto Real:** Cada bolsa rescatada es comida que no termina en la basura.

## 🛠️ Stack Tecnológico

- **Frontend:** React Native + Expo (v54+)
- **Navegación:** Expo Router (File-based)
- **Estilos:** NativeWind (Tailwind CSS)
- **Backend:** Supabase (Auth, DB, RLS)
- **Pagos:** Kushki SDK
- **Iconografía:** Ionicons & Custom SVG Art (Ecuadorian regional dishes)

## 📁 Estructura del Proyecto

```text
salvar/
├── app/                # Expo Router Routes
│   ├── (tabs)/         # Bottom Tab Navigation
│   └── restaurante/    # Dynamic Restaurant Detail routes
├── src/
│   ├── components/     # UI Design System
│   │   ├── branding/   # Logo & Brand assets
│   │   └── ui/         # Reusable Atomic Components
│   ├── hooks/          # Custom Business Logic Hooks
│   ├── screens/        # Full-page Screen Components
│   ├── services/       # API & External Integrations (Supabase, Kushki)
│   ├── theme/          # Regional Color Palette & Typography
│   ├── types/          # TypeScript Definitions
│   └── utils/          # Formatting & Filter logic
└── supabase/           # Database Schema & Migrations
```

## 🚥 Guía de Desarrollo

1. **Instalación:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Iniciar App:**
   ```bash
   npx expo start -c
   ```

3. **Backend:**
   Asegúrate de configurar las variables `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY` en tu archivo `.env`.

---
*Hecho con orgullo para el Ecuador.* 🇪🇨
