# Panel de administración — Juguetería

Panel de administración para una juguetería, desarrollado como proyecto universitario.
Permite gestionar productos, registrar ventas y visualizar métricas básicas en un dashboard.

## 📌 Características principales

- **Dashboard**

  - Total de productos registrados.
  - Productos con stock bajo.
  - Ventas totales.
  - Gráfica de ventas por mes.
- **Gestión de productos (CRUD)**

  - Crear, listar, editar y eliminar productos.
  - Campos: nombre, categoría, precio, stock, descripción, etc.
  - Manejo de categorías:
    - Las categorías se crean automáticamente al registrar un producto con una nueva categoría.
  - Reglas de negocio:
    - No se permite eliminar productos que tengan ventas asociadas (para preservar el historial).
- **Gestión de ventas**

  - Registro de ventas asociadas a un producto.
  - Actualización del stock del producto al registrar una venta.
  - Los datos de ventas alimentan el dashboard.
- **UI / UX**

  - Layout con sidebar de navegación (`Dashboard`, `Productos`, `Ventas`).
  - Transiciones suaves entre páginas usando `framer-motion`.
  - Diseño responsive y limpio, orientado a uso en escritorio.

---

## 🧱 Stack tecnológico

- **Frontend & Backend**: [Next.js 16](https://nextjs.org/) (App Router)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Base de datos**: MySQL
- **Estilos**:
  - Tailwind CSS (a través de la configuración de Next.js)
  - Componentes UI (shadcn/ui o similares)
- **Animaciones**: [framer-motion](https://www.framer.com/motion/)
- **Despliegue**:
  - Aplicación desplegada en [Railway](https://railway.app/)
  - Base de datos MySQL también en Railway

---

## 🗂️ Estructura general del proyecto

Las rutas y componentes principales del panel de administración se organizan así (puede variar ligeramente):

```text
app/
  layout.tsx              # Layout raíz con sidebar y transiciones de página
  page.tsx                # Página principal (puede ser dashboard o landing)

  dashboard/
    page.tsx              # Página de dashboard (métricas, gráficos)

  productos/
    page.tsx              # Página con tabla y formulario para CRUD de productos

  ventas/
    page.tsx              # Página para registro y listado de ventas

  api/
    productos/
      route.(ts|js)       # API REST para productos (GET, POST)
    productos/[id]/
      route.(ts|js)       # API REST para un producto específico (PUT, DELETE)
    ventas/
      route.(ts|js)       # API REST para ventas
    dashboard/
      resumen/
        route.(ts|js)     # Resumen de métricas para el dashboard
      ventas-mes/
        route.(ts|js)     # Datos de ventas por mes para la gráfica

lib/
  prisma.(ts|js)          # Cliente de Prisma y configuración

prisma/
  schema.prisma           # Definición del esquema de la base de datos

components/
  sidebar.tsx             # Sidebar de navegación
  dashboard-page.tsx      # Componente de la vista Dashboard
  products-page.tsx       # Componente para el CRUD de productos
  product-form.tsx        # Formulario de productos
  sales-page.tsx          # Componente para la gestión de ventas
  page-transition.tsx     # Transición entre páginas (framer-motion)
```

---

## 🗄️ Esquema de la base de datos (resumen)

La base de datos MySQL se gestiona con **Prisma**. El esquema concreto está en `prisma/schema.prisma`, pero conceptualmente incluye algo como:

### Tabla `Categoria`

- **id** (int, PK, autoincrement)
- **nombre** (string, único)

➡️ Relación 1:N con **Producto**.

### Tabla `Producto`

- **id** (int, PK, autoincrement)
- **nombre** (string)
- **precio** (decimal / float)
- **stock** (int)
- **descripcion** (string, opcional)
- **categoriaId** (FK a Categoria.id)

➡️ Relación 1:N con **Venta**.

### Tabla `Venta`

- **id** (int, PK, autoincrement)
- **productoId** (FK a Producto.id)
- **cantidad** (int)
- **total** (decimal / float)
- **fecha** (datetime)

🔒 Hay reglas de integridad referencial, por ejemplo:
No se permite eliminar un **Producto** que tenga registros en **Venta** (la API controla este caso y devuelve un error amigable).

---

## ✅ Requisitos previos

- **Node.js** 18 o superior.
- **npm** o **pnpm** instalado.
- Una base de datos **MySQL** accesible (en desarrollo puede ser local, en producción se usa **Railway**).

---

## ⚙️ **Configuración del entorno**

### Clonar el repositorio

```
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

### Instalar dependencias

```bash
npm install
```

### Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```bash
DATABASE_URL="mysql://usuario:password@host:puerto/base_de_datos"
```

Ejemplo (Railway):

```bash
DATABASE_URL="mysql://usuario:password@containers-us-west-99.railway.app:6801/railway"
```

Asegúrate de:

- Usar tu URL real de MySQL.
- No subir `.env` al repositorio (debe estar en `.gitignore`).

---

## Aplicar el esquema de Prisma a la base de datos

Si estás en una base de datos vacía (como Railway recién creada):

```bash
npx prisma db push
# o, si ya usas migraciones:
# npx prisma migrate deploy

### Generar el cliente de Prisma

npx prisma generate
```

---

## 🚀 Desarrollo local

Para levantar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación quedará disponible en:

http://localhost:3000

**Rutas principales:**

- `/dashboard` → Dashboard con métricas
- `/productos` → CRUD de productos
- `/ventas` → Gestión de ventas

---

## 🧪 Scripts disponibles

En `package.json`:

```bash
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "postinstall": "prisma generate"
}
```

- `npm run dev` → servidor de desarrollo.
- `npm run build` → build de producción de Next.js.
- `npm start` → arranca la app en modo producción (usa `.next`).
- `postinstall` → genera el cliente de Prisma después de instalar dependencias.

---

## ☁️ Despliegue en Railway (resumen)

### 1. Base de datos MySQL

- Crear un proyecto en Railway y provisionar una base de datos MySQL.
- Obtener la URL de conexión (usuario, contraseña, host, puerto y base).

### 2. Servicio de la app

- Crear un nuevo servicio en Railway conectado a este repositorio (GitHub).
- Configurar la variable de entorno `DATABASE_URL` en el servicio de la app con la URL de MySQL.

Railway ejecutará:

```bash
npm install
npm run build
npm start
```

### 3. Migraciones / schema

Desde local, apuntando a la base de Railway:

```bash
npx prisma db push
# o npx prisma migrate deploy
```

Esto crea las tablas `Categoria`, `Producto`, `Venta`, etc. en la base de Railway.

### 4. URL pública

Railway genera una URL del estilo:

```bash
https://tu-proyecto-production.up.railway.app
```

Ésta es la URL que se usa para acceder al panel en producción.

---

## 💡 Posibles mejoras (futuras)

- **IA para descripciones de productos**
    - Botón en el formulario de productos que genere descripciones automáticamente usando un modelo de lenguaje (por ejemplo, LLM vía API).


- **Resumen inteligente en el dashboard**
    - Tarjeta de “Resumen IA” que analice las métricas (ventas, stock, categorías) y genere recomendaciones en texto.


- **Autenticación y roles**
    - Login para administradores.
    - Diferentes niveles de permisos (solo lectura, administrador, etc.).


- **Exportación de datos**
    - Exportar productos y ventas en CSV/Excel para análisis externo.
    