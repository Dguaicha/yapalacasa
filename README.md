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

2. **Configuración del Entorno:**
   ```bash
   cp .env.example .env
   # Edita .env con tus claves API
   ```

3. **Backend Setup:**
   - Configura Supabase: `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Ejecuta el schema: `supabase/setup.sql` en tu base de datos

4. **Configuración de Pagos:**
   - **Stripe (Recomendado):** Crea cuenta en [Stripe Dashboard](https://dashboard.stripe.com)
     - Obtén tu `Publishable Key` para `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - Configura tu `Secret Key` en Supabase Edge Functions
   - **Kushki (Legacy):** Solo para Ecuador - usa Stripe para mejor compatibilidad cross-platform

5. **Iniciar App:**
   ```bash
   npx expo start -c
   ```

## 💳 Configuración de Pagos

### Stripe (Recomendado para iOS, Android, Web)

1. **Cuenta Stripe:**
   - Regístrate en [Stripe](https://stripe.com)
   - Activa tu cuenta para Ecuador

2. **Claves API:**
   ```env
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Supabase Edge Function:**
   ```bash
   # Deploy the payment function
   supabase functions deploy create-payment-intent
   ```

4. **Variables de Entorno en Supabase:**
   - `STRIPE_SECRET_KEY`: Tu clave secreta de Stripe
   - `SUPABASE_URL` y `SUPABASE_ANON_KEY`: Auto-configuradas

### Kushki (Solo Ecuador)

Kushki está disponible como fallback, pero Stripe ofrece mejor soporte cross-platform.

```env
EXPO_PUBLIC_KUSHKI_PUBLIC_KEY=your_kushki_key
```

---
*Hecho con orgullo para el Ecuador.* 🇪🇨
