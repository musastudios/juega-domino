# Dominó Score Tracker - Especificaciones

## Descripción General
Una aplicación móvil para llevar el puntaje en juegos de dominó, con dos modalidades de juego y sistema de bonificación.

## Modos de Juego

### Juego Rápido (200 puntos)
- Meta: Alcanzar 200 puntos
- Sin bonificaciones
- Ideal para partidas cortas

### Juego con Bonificación (500 puntos)
- Meta: Alcanzar 500 puntos
- Sistema de bonificación en las primeras 4 jugadas
- Bonificaciones secuenciales:
  1. Primera jugada: +100 puntos
  2. Segunda jugada: +75 puntos
  3. Tercera jugada: +50 puntos
  4. Cuarta jugada: +25 puntos

## Funcionalidades Principales

### Sistema de Puntuación
- Dos columnas: "Ellos" y "Nosotros"
- Entrada numérica para cada equipo
- Suma automática del total
- Nueva fila automática al ingresar puntaje
- Visualización de bonificaciones en verde

### Interfaz de Usuario
- Diseño con gradiente azul oscuro
- Fuentes personalizadas:
  - Logo: Pacifico y Dancing Script
  - Títulos: Dancing Script Bold
- Iconografía de Ionicons
- Diseño responsive

### Secuencia de Victoria
1. Al alcanzar puntaje objetivo:
   - Pausa de 1 segundo
   - Animación de confeti (5 segundos)
   - Modal de celebración con:
     - Trofeo dorado
     - Nombre del equipo ganador
     - Puntaje final
2. Espacio publicitario (4 segundos)
3. Modal de nuevo juego

## Navegación
- Pantalla inicial con selección de modo
- Pantalla de juego con:
  - Botón de retroceso
  - Título con puntaje objetivo
  - Tabla de puntuación
  - Botón de nueva fila

## Estilos y Temas
### Colores
- Gradiente principal: #1a237e → #311b92
- Botones primarios: #4527a0
- Botones alternativos: #5e35b1
- Texto claro: #ffffff
- Texto secundario: #e0e0e0
- Bonificaciones: #4caf50

### Elementos UI
- Bordes redondeados: 16-20px
- Sombras en elementos elevados
- Efectos de transparencia en modales
- Espaciado consistente

## Pendiente de Implementación
- [ ] Persistencia de datos
- [ ] Historial de partidas
- [ ] Estadísticas por equipo
- [ ] Configuraciones personalizadas
- [ ] Integración real de anuncios
- [ ] Animaciones adicionales
- [ ] Modo oscuro/claro
- [ ] Soporte multiidioma

## Notas Técnicas
- Desarrollado con Expo/React Native
- TypeScript para tipo seguro
- Navegación con Expo Router
- Gestión de estado con React Hooks 