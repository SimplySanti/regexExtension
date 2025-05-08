## Extensión Multi-Regex para Chrome

Este repositorio contiene la extensión del equipo **Debuggers** para Chrome —desarrollada con Plasmo. A continuación se describen los pasos necesarios para configurar y ejecutar la extensión.

---

### 1. Ubicación del proyecto

Al descargarlo de Github, por defecto debería moverse a la siguiente carpeta. 
```bash
cd /Users/s/Documents/GitHub/regexExtension/multi-regex
```

Si ya habías instalado dependencias y quieres partir desde cero, elimina archivos previos:
```bash
rm -rf node_modules
rm package-lock.json
```

---

### 2. Prerrequisitos

* **Node.js v20** (recomendado usar NVM):

  ```bash
  nvm install 20
  nvm use 20
  ```
* **pnpm** como gestor de paquetes global:

  ```bash
  npm install -g pnpm
  ```

---

### 3. Instalación de dependencias

```bash
pnpm install
```

---

### 4. Compilar la extensión

Para generar los archivos finales de la extensión:

```bash
pnpm run build
```

---

### 5. Cargar la extensión en Chrome

1. Abre Chrome y navega a:

   ```
   chrome://extensions
   ```
2. Activa el **Modo desarrollador** (esquina superior derecha).
3. Haz clic en **Cargar descomprimida** ("Load unpacked").
4. Selecciona la carpeta de salida generada por Plasmo (por defecto):

   ```
   /Users/s/Documents/GitHub/regexExtension/multi-regex/build/chrome-mv3
   ```

---

### 6. Vista previa automática

Si deseas lanzar Chrome automáticamente con la extensión cargada, ejecuta:

```bash
pnpm run preview
```

---

¡Listo! La extensión Multi-Regex estará instalada y lista para usar en tu navegador.
