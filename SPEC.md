# CryptoSeed Vault - Especificación Técnica

## 1. Visión General del Proyecto

**Nombre del Proyecto:** CryptoSeed Vault  
**Tipo:** Aplicación multiplataforma de escritorio y móvil  
**Descripción:** Aplicación segura para gestionar frases seed de billeteras de criptomonedas, generar y mostrar direcciones derivables.  
**Usuarios Objetivo:** Usuarios de criptomonedas que necesitan gestionar múltiples billeteras de forma segura.

---

## 2. Especificación UI/UX

### 2.1 Estructura de Diseño

**Modelo de Ventanas:**

- Ventana principal única con navegación lateral
- Modal para ingreso de seed phrases
- Modal para confirmar acciones sensibles
- Diseño responsivo que adapta a diferentes tamaños de pantalla

**Distribución del Layout:**

```
┌─────────────────────────────────────────┐
│  Header (Logo + Título + Seguridad)     │
├──────────┬──────────────────────────────┤
│          │                              │
│  Sidebar │     Área de Contenido       │
│  (Nav)   │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│  Footer (Versión + Estado de Seguridad)  │
└─────────────────────────────────────────┘
```

### 2.2 Paleta de Colores

| Rol              | Color          | Hex       |
| ---------------- | -------------- | --------- |
| Primario         | Azul Oscuro    | `#1a1f36` |
| Secundario       | Azul Brillante | `#3b82f6` |
| Acento           | Verde Éxito    | `#10b981` |
| Advertencia      | Ámbar          | `#f59e0b` |
| Peligro          | Rojo           | `#ef4444` |
| Fondo Principal  | Negro Profundo | `#0f172a` |
| Fondo Secundario | Gris Azulado   | `#1e293b` |
| Texto Principal  | Blanco         | `#f8fafc` |
| Texto Secundario | Gris           | `#94a3b8` |
| Borde            | Gris Medio`    |

### | `#3341552.3 Tipografía

- **Familia Principal:** Inter (Google Fonts)
- **Familia Monoespaciada:** JetBrains Mono (para semillas y direcciones)
- **Tamaños:**
  - H1: 32px / Bold
  - H2: 24px / SemiBold
  - H3: 18px / SemiBold
  - Body: 14px / Regular
  - Caption: 12px / Regular
  - Code: 13px / Monospace

### 2.4 Espaciado

- Sistema de grid de 4px
- Padding base: 16px
- Gaps: 8px, 12px, 16px, 24px
- Border radius: 8px (cards), 12px (modals), 6px (buttons)

### 2.5 Componentes UI

**Navegación Sidebar:**

- Iconos + texto para cada sección
- Estado activo con indicador azul
- Hover con fondo ligeramente más claro
- Ancho: 240px (expandido), 64px (colapsado)

**Cards de Dirección:**

- Fondo oscuro con borde sutil
- Índice de dirección (m/n)
- Dirección truncada con opción de ver completa
- Copiar al portapapeles con feedback visual
- Icono de red seleccionado

**Input de Semilla:**

- Campo multilínea grande
- Placeholder informativo
- Indicador de fortaleza de contraseña
- Validación en tiempo real
- Botón para generar semilla aleatoria

**Botones:**

- Primario: Fondo azul, texto blanco
- Secundario: Borde azul, texto azul
- Peligro: Fondo rojo, texto blanco
- Estados: Normal, Hover (brillo +10%), Active (brillo -10%), Disabled (opacidad 50%)

---

## 3. Especificación Funcional

### 3.1 Características Principales

#### 3.1.1 Gestión de Semillas (Seed Phrases)

- Ingresar semilla de 12 o 24 palabras
- Validar checksum BIP39
- Generar nueva semilla aleatoria segura
- Mostrar/ocultar semilla con toggle
- Encriptar semilla localmente con AES-256-GCM
- Contraseña maestra opcional (BIP39 passphrase)

#### 3.1.2 Derivación de Direcciones

- Soporte para múltiples redes:
  - **Ethereum** (EVM): ETH, BSC, Polygon, Avalanche, etc.
  - **Bitcoin**: BTC (Legacy, SegWit, Native SegWit)
  - **Solana**: SOL
  - **Cardano**: ADA
- Mostrar 10 primeras direcciones (índice 0-9)
- Ruta de derivación BIP44 estándar
- Cambio de índice para ver más direcciones

#### 3.1.3 Redes Soportadas

| Red                 | Símbolo | Tipo    | Path BIP44           |
| ------------------- | ------- | ------- | -------------------- |
| Ethereum            | ETH     | EVM     | m/44'/60'/0'/0/0     |
| Bitcoin             | BTC     | UTXO    | m/44'/0'/0'/0/0      |
| Binance Smart Chain | BSC     | EVM     | m/44'/60'/0'/0/0     |
| Polygon             | MATIC   | EVM     | m/44'/60'/0'/0/0     |
| Avalanche C-Chain   | AVAX    | EVM     | m/44'/60'/0'/0/0     |
| Solana              | SOL     | Solana  | m/44'/501'/0'/0'     |
| Cardano             | ADA     | Cardano | m/1852'/1815'/0'/0/0 |

#### 3.1.4 Funciones de Seguridad

- Bloqueo automático después de inactividad (5 min)
- Contraseña maestra para acceder a la app
- No transmitir semillas por red
- Almacenamiento local encriptado
- Indicador de seguridad en UI

### 3.2 Flujos de Usuario

**Flujo 1: Primera vez**

1. Usuario abre la app
2. App detecta que no hay semilla guardada
3. Muestra opciones: "Crear nueva" o "Importar existente"
4. Si crear nueva: genera semilla, muestra, permite backup
5. Si importar: ingresa palabras, valida, guarda encriptada

**Flujo 2: Uso regular**

1. Usuario abre la app
2. Ingresa contraseña maestra
3. App desencripta y carga semilla
4. Muestra panel principal con redes
5. Selecciona red, ve direcciones

**Flujo 3: Ver direcciones**

1. Selecciona red del sidebar
2. App deriva direcciones según path
3. Muestra lista de 10 direcciones
4. Puede copiar dirección específica
5. Puede cambiar índice para ver más

### 3.3 Arquitectura de Datos

```
┌─────────────────────────────────────────┐
│              Frontend (React)           │
├─────────────────────────────────────────┤
│         Lógica de Criptografía         │
│    (bip39, bip32, ethers, bitcoinjs)   │
├─────────────────────────────────────────┤
│         Capa de Seguridad              │
│      (Tauri + Rust: encriptación)      │
├─────────────────────────────────────────┤
│      Almacenamiento Local Seguro        │
│          (Sistema de archivos)─────────┘
```

### 3 │

└────────────────────────────────.4 Módulos Principales

| Módulo           | Responsabilidad                    |
| ---------------- | ---------------------------------- |
| `SeedManager`    | Generar, validar, guardar semillas |
| `AddressDeriver` | Derivar direcciones según red      |
| `CryptoService`  | Encriptar/desencriptar datos       |
| `NetworkManager` | Gestionar redes disponibles        |
| `StorageService` | Persistencia local segura          |

---

## 4. Criterios de Aceptación

### 4.1 Condiciones de Éxito

- [ ] La app compila para Windows (.exe)
- [ ] La app se ejecuta sin errores en Windows
- [ ] Se puede generar una nueva semilla de 12 palabras
- [ ] Se puede importar una semilla existente
- [ ] La semilla se guarda encriptada localmente
- [ ] Se muestran 10 direcciones para Ethereum
- [ ] Se muestran 10 direcciones para Bitcoin
- [ ] Se pueden copiar direcciones al portapel
- [ ] La UI es responsiva y funcional
- [ ] No hay errores críticos en consola

### 4.2 Puntos de Verificación Visual

1. **Pantalla de inicio:** Logo centrado, fondo oscuro, botón de comenzar
2. **Pantalla de semilla:** Campo grande, palabras separadas, indicadores visuales
3. **Panel principal:** Sidebar con redes, área de contenido con tarjetas de direcciones
4. **Tarjeta de dirección:** Dirección visible, botón copiar, índice claro
5. **Estados:** Loading con spinner, éxito con check verde, error con mensaje rojo

---

## 5. Stack Tecnológico

| Capa         | Tecnología                             |
| ------------ | -------------------------------------- |
| Framework    | Tauri v2                               |
| Frontend     | React 18 + TypeScript                  |
| Estilos      | Tailwind CSS                           |
| Criptografía | ethers, bitcoinjs-lib, @solana/web3.js |
| BIP39        | bip39 (npm)                            |
| Build        | Vite                                   |
| Backend      | Rust (Tauri)                           |
