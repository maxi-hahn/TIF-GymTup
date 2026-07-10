# DECISIONS.md

## Decisiones del Proyecto

### Arquitectura

- Se utiliza una arquitectura basada en Features.
- Los Services están centralizados.
- Los componentes reutilizables viven en `shared`.

---

### Tecnologías

- React + Vite.
- React Router.
- Axios.
- Context API.
- CSS Modules.
- React Hook Form.
- Zod.
- react-i18next.

---

### Estado Global

- Se utilizará Context API.
- Solo se almacenará estado realmente global.

---

### Internacionalización

- Se implementará con react-i18next.
- Todos los textos visibles se obtendrán desde archivos de traducción.

---

### Estilos

- Se utilizarán CSS Modules.
- Los estilos globales se limitarán a reset, variables y estilos generales.

---

### Autenticación

- JWT almacenado en localStorage.
- Axios agregará automáticamente el token en cada petición.

---

### Responsive

- Mobile First.
- Navbar superior en escritorio.
- Menú hamburguesa en dispositivos móviles.

---

### Componentes

- Se reutilizarán siempre que sea posible.
- Antes de crear uno nuevo se verificará que no exista otro similar.

---

## Futuras decisiones

Cada vez que durante el desarrollo tomemos una decisión importante, se agregará en este archivo con una breve explicación.