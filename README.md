# COM30 · Taller 08 · Rutas y navegación

Ampliación del proyecto del **Taller 07** (inventario de equipos) con el enrutador de Angular:
listado, detalle por código, alta, estadísticas con carga diferida y vista 404. Los datos siguen
en el servicio con signals; no se usa `HttpClient` ni guards.

- **Escenario:** inventario de equipos de la Institución Universitaria de Barranquilla.
- **Datos de partida:** 18 equipos (`EQ-001` a `EQ-018`).
- **Framework:** Angular 22 con componentes standalone, signals y control de flujo `@if` / `@for`.
- **Curso:** COM30 · Programación con Frameworks para Web · 2026-III.

## Requisitos

- Node.js 22 o superior
- npm 11 o superior

## Instalación y ejecución

```bash
git clone https://github.com/Iryuu1/COM30-Taller07-Iglesias.git
cd COM30-Taller07-Iglesias
git checkout main
npm install
npx ng serve --open
```

La aplicación se abre en `http://localhost:4200/` y redirige a `/equipos`.

Si el puerto 4200 está ocupado:

```bash
npx ng serve --port 4300
```

## Compilación

```bash
npx ng build
```

El comando termina sin errores y deja el resultado en
`dist/com30-taller07-iglesias/`. La vista de estadísticas aparece como *lazy chunk*:

```text
Lazy chunk files    | Names         |  Raw size
chunk-XXXXXXXX.js   | estadisticas  |   3.21 kB
```

## Tabla A · Rutas del proyecto

Se diligencia en el orden real de `app.routes.ts`.

| Ruta | Vista (componente) | Parámetro o carga |
| --- | --- | --- |
| `/` → `/equipos` | Redirección (`redirectTo`, `pathMatch: 'full'`) | — |
| `/equipos` | `ListadoEquipos` | `?estado=` recibido con `input()` y filtrado con `computed` |
| `/equipos/nueva` | `AltaEquipo` | Formulario reactivo; al guardar usa `router.navigate` |
| `/equipos/:codigo` | `DetalleEquipo` | `:codigo` llega a `input.required<string>()`; `computed` busca el registro |
| `/estadisticas` | `Estadisticas` | Carga diferida con `loadComponent` |
| `/**` | `NoEncontrada` | Comodín al final; muestra la dirección pedida y un enlace de regreso |

Notas de orden:

- `/equipos/nueva` va **antes** de `/equipos/:codigo`; de lo contrario `nueva` se leería como un
  código.
- `/**` va **al final**, después de todas las rutas reales.
- Cada ruta declara su `title`, que Angular aplica al documento.

## Tabla B · Casos de prueba

El resultado esperado se escribió antes de ejecutar; la columna **Obtenido** se verificó en el
navegador sobre esta versión.

| Caso | Acción | Resultado esperado | Obtenido |
| --- | --- | --- | --- |
| C1 | Abrir `/` | Redirige a `/equipos`: 18 registros. Menú «Equipos» activo | Cumple: 18 filas, menú «Equipos» activo |
| C2 | Pulsar el filtro «Activo» | URL `/equipos?estado=Activo` · 11 registros | Cumple: 11 filas y filtro marcado |
| C3 | Recargar con F5 en C2 | Los mismos 11 registros y el filtro «Activo» marcado | Cumple: sigue en `?estado=Activo` con 11 filas |
| C4 | Escribir `/equipos?estado=Cancelada` | Mensaje de `@empty`: 0 equipos con ese estado | Cumple: «0 equipos con el estado «Cancelada»» |
| C5 | Pulsar la fila `EQ-005` | URL `/equipos/EQ-005` · Monitor · Sala 1 · Activo. «Equipos» sigue activo | Cumple: ficha completa y menú activo |
| C6 | Escribir `/equipos/EQ-999` | Mensaje «No existe un equipo con el código EQ-999» dentro del detalle; no es la vista 404 | Cumple: mensaje dentro del detalle |
| C7 | Escribir `/reportes` | Vista 404 con la dirección escrita y un enlace al listado | Cumple: muestra `/reportes` y enlace a `/equipos` |
| C8 | Guardar el alta `Router · Sala 3 · Baja` | Navega a `/equipos/EQ-019`. El listado tiene 19 registros; filtro «Baja»: 4 | Cumple: navegó a `EQ-019`; 19 registros y 4 bajas |
| C9 | Abrir Estadísticas con F12 > Red (JS) | Un archivo `chunk-….js` nuevo la primera vez; ninguno la segunda | Cumple: `chunk-*.js` solo en la primera visita |

Límites comprobados:

- Un filtro sin registros (`C4`) **no** es un error: es el estado vacío del listado.
- Un código inexistente (`C6`) **no** es una ruta inexistente: la ruta existe y falta el registro.
- Solo una dirección que ninguna ruta atiende (`C7`) llega al comodín `/**`.

## Estructura del proyecto

```text
src/app/
├── app.config.ts                 provideRouter(routes, withComponentInputBinding())
├── app.routes.ts                 mapa de rutas del taller
├── app.ts / app.html / app.css   cabecera, menú y único <router-outlet />
├── data/equipos.ts               semilla de 18 equipos
├── models/equipo.ts              modelo y estados del equipo
├── services/equipo-api.ts        servicio con signal: equipos, total, próximo código y alta
└── features/
    ├── equipos/
    │   ├── listado/              listado + filtro ?estado= con input() y computed
    │   ├── detalle/              detalle /equipos/:codigo con input.required() y computed
    │   └── alta/                 formulario reactivo + router.navigate al detalle
    ├── estadisticas/             vista cargada con loadComponent
    └── no-encontrada/            vista 404
```

## Decisiones técnicas

- `withComponentInputBinding()` conecta los parámetros de ruta y de consulta con los `input()` del
  mismo nombre. Por eso `:codigo` llega a `codigo` y `?estado=` llega a `estado`.
- El detalle usa `input.required<string>()` y un `computed` que busca el registro en el signal del
  servicio. No se usa `ActivatedRoute.snapshot`.
- El filtro vive en la dirección (`?estado=Activo`), no en una signal local. Así sobrevive a F5, se
  puede compartir por enlace y Atrás lo deshace.
- El listado usa `@for` / `@empty` y el detalle `@if`; no hay `*ngIf` ni `NgModule`.
- Los enlaces internos usan `routerLink`; el alta navega desde el código con `router.navigate`.
- La vista de estadísticas se declara con `loadComponent`, por lo que su código se descarga solo
  al entrar a `/estadisticas`.

## Ramas del taller

El trabajo se dividió por etapa; cada rama contiene un commit `T08: …`.

| Rama | Contenido |
| --- | --- |
| `t08/e1-mapa-rutas` | `withComponentInputBinding`, rutas, menú con `routerLinkActive`, listado inicial y 404 |
| `t08/e2-detalle` | Detalle `/equipos/:codigo`, `input.required()`, `computed` y mensaje de inexistente |
| `t08/e3-filtro-url` | Filtro `?estado=` con `input()`, enlaces `queryParams`, `@empty` y F5 |
| `t08/e4-alta-estadisticas` | Alta reactiva con `router.navigate` y estadísticas con `loadComponent` |
| `t08/r8-readme` | README, tablas A y B, título del proyecto y evidencias |

## Evidencias para el informe

1. **C5:** abrir `http://localhost:4200/equipos/EQ-005` y capturar la ventana completa, con la
   barra de dirección visible.
2. **C9:** abrir las herramientas de desarrollo con F12, pestaña **Red**, filtro **JS**, entrar a
   `/estadisticas` y capturar el `chunk-….js`. Recargar la vista y comprobar que no se descarga de
   nuevo.
3. Guardar el documento del taller como `COM30_Taller08_Apellido.pdf` y adjuntar el enlace del
   repositorio.

## Enlace del repositorio

<https://github.com/Iryuu1/COM30-Taller07-Iglesias>
