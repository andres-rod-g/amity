# Diagramas de Clases - Amity (Funcionalidades de Negocio)

## Índice
1. [Diagrama de Entidades Principales](#diagrama-de-entidades-principales)
2. [Diagrama de Gestión de Tareas](#diagrama-de-gestión-de-tareas)
3. [Diagrama de Sistema de Notas](#diagrama-de-sistema-de-notas)
4. [Diagrama de Calendario y Eventos](#diagrama-de-calendario-y-eventos)
5. [Diagrama de Ciclo Menstrual](#diagrama-de-ciclo-menstrual)
6. [Diagrama de Relaciones Generales](#diagrama-de-relaciones-generales)

---

## Diagrama de Entidades Principales

Este diagrama muestra las entidades principales del dominio de negocio de Amity.

```plantuml
@startuml Amity_Entidades_Principales
!theme plain

package "Dominio Amity" {

  class Usuario {
    - nombre: string
    - fechaRegistro: Date
    --
    + autenticar(): boolean
    + obtenerNombre(): string
  }

  class Tarea {
    - id: string
    - titulo: string
    - descripcion: string
    - completada: boolean
    - fechaCreacion: Date
    - fechaVencimiento: Date
    --
    + marcarCompletada(): void
    + marcarPendiente(): void
    + estaVencida(): boolean
    + obtenerDiasRestantes(): number
  }

  class Nota {
    - id: string
    - contenido: string
    - fechaCreacion: Date
    --
    + obtenerResumen(caracteres: number): string
    + obtenerFechaFormateada(): string
  }

  class Evento {
    - id: string
    - titulo: string
    - descripcion: string
    - fecha: Date
    - hora: string
    --
    + esHoy(): boolean
    + esFuturo(): boolean
    + obtenerFechaHoraFormateada(): string
  }

  class CicloMenstrual {
    - id: string
    - fechaInicio: Date
    - fechaFin: Date
    - duracionCiclo: number
    - duracionPeriodo: number
    - sintomas: string[]
    - estadoAnimo: EstadoAnimo
    - intensidadFlujo: IntensidadFlujo
    - notas: string
    --
    + calcularDuracion(): number
    + estaActivo(): boolean
    + contieneFecha(fecha: Date): boolean
  }

  enum EstadoAnimo {
    MUY_BIEN
    BIEN
    NORMAL
    MAL
    MUY_MAL
  }

  enum IntensidadFlujo {
    MUY_LIGERO
    LIGERO
    NORMAL
    ABUNDANTE
    MUY_ABUNDANTE
  }

  ' Relaciones básicas
  Usuario ||--o{ Tarea : "gestiona"
  Usuario ||--o{ Nota : "crea"
  Usuario ||--o{ Evento : "planifica"
  Usuario ||--o{ CicloMenstrual : "registra"
  
  CicloMenstrual ||--|| EstadoAnimo : "tiene"
  CicloMenstrual ||--|| IntensidadFlujo : "presenta"
}

@enduml
```

---

## Diagrama de Gestión de Tareas

Este diagrama se centra específicamente en la funcionalidad de gestión de tareas.

```plantuml
@startuml Amity_Gestion_Tareas
!theme plain

package "Gestión de Tareas" {

  class GestorTareas {
    - tareas: List<Tarea>
    --
    + crearTarea(titulo: string, descripcion: string, fechaVencimiento: Date): Tarea
    + obtenerTareas(): List<Tarea>
    + obtenerTareasCompletadas(): List<Tarea>
    + obtenerTareasPendientes(): List<Tarea>
    + eliminarTarea(id: string): boolean
    + actualizarTarea(id: string, cambios: TareaCambios): boolean
    + calcularEstadisticas(): EstadisticasTareas
  }

  class Tarea {
    - id: string
    - titulo: string
    - descripcion: string
    - completada: boolean
    - fechaCreacion: Date
    - fechaVencimiento: Date
    --
    + marcarCompletada(): void
    + marcarPendiente(): void
    + cambiarTitulo(nuevoTitulo: string): void
    + cambiarDescripcion(nuevaDescripcion: string): void
    + estaVencida(): boolean
    + obtenerDiasRestantes(): number
    + obtenerPrioridad(): Prioridad
  }

  class EstadisticasTareas {
    - tareasCompletadas: number
    - tareasPendientes: number
    - porcentajeProductividad: number
    --
    + calcular(tareas: List<Tarea>): EstadisticasTareas
    + obtenerTendenciaProductividad(): string
    + obtenerResumenSemanal(): ResumenSemanal
  }

  enum Prioridad {
    ALTA
    MEDIA
    BAJA
  }

  class TareaCambios {
    - titulo: string
    - descripcion: string
    - fechaVencimiento: Date
    - completada: boolean
  }

  class ResumenSemanal {
    - tareasCompletadasSemana: number
    - tareasVencidasSemana: number
    - promedioTareasDiarias: number
    --
    + generarReporte(): string
  }

  ' Relaciones
  GestorTareas ||--o{ Tarea : "administra"
  GestorTareas ||--|| EstadisticasTareas : "calcula"
  Tarea ||--|| Prioridad : "tiene"
  EstadisticasTareas ||--|| ResumenSemanal : "incluye"
}

@enduml
```

---

## Diagrama de Sistema de Notas

Este diagrama representa la funcionalidad del sistema de notas.

```plantuml
@startuml Amity_Sistema_Notas
!theme plain

package "Sistema de Notas" {

  class GestorNotas {
    - notas: List<Nota>
    --
    + crearNota(contenido: string): Nota
    + obtenerNotas(): List<Nota>
    + obtenerNotasOrdenadas(): List<Nota>
    + buscarNotas(termino: string): List<Nota>
    + eliminarNota(id: string): boolean
    + actualizarNota(id: string, nuevoContenido: string): boolean
    + contarNotas(): number
  }

  class Nota {
    - id: string
    - contenido: string
    - fechaCreacion: Date
    - fechaModificacion: Date
    --
    + actualizarContenido(nuevoContenido: string): void
    + obtenerResumen(maxCaracteres: number): string
    + obtenerFechaFormateada(): string
    + obtenerPalabrasClaves(): string[]
    + contienePalabra(palabra: string): boolean
    + obtenerLongitud(): number
  }

  class BuscadorNotas {
    --
    + buscarPorContenido(notas: List<Nota>, termino: string): List<Nota>
    + buscarPorFecha(notas: List<Nota>, fechaInicio: Date, fechaFin: Date): List<Nota>
    + filtrarPorLongitud(notas: List<Nota>, longitudMinima: number): List<Nota>
  }

  class OrganizadorNotas {
    --
    + ordenarPorFecha(notas: List<Nota>, ascendente: boolean): List<Nota>
    + ordenarPorLongitud(notas: List<Nota>): List<Nota>
    + agruparPorMes(notas: List<Nota>): Map<string, List<Nota>>
  }

  ' Relaciones
  GestorNotas ||--o{ Nota : "gestiona"
  GestorNotas ||--|| BuscadorNotas : "utiliza"
  GestorNotas ||--|| OrganizadorNotas : "utiliza"
}

@enduml
```

---

## Diagrama de Calendario y Eventos

Este diagrama muestra la funcionalidad del calendario y gestión de eventos.

```plantuml
@startuml Amity_Calendario_Eventos
!theme plain

package "Calendario y Eventos" {

  class GestorCalendario {
    - eventos: List<Evento>
    --
    + crearEvento(titulo: string, descripcion: string, fecha: Date, hora: string): Evento
    + obtenerEventos(): List<Evento>
    + obtenerEventosPorFecha(fecha: Date): List<Evento>
    + obtenerEventosMes(mes: number, año: number): List<Evento>
    + eliminarEvento(id: string): boolean
    + actualizarEvento(id: string, cambios: EventoCambios): boolean
  }

  class Evento {
    - id: string
    - titulo: string
    - descripcion: string
    - fecha: Date
    - hora: string
    - recordatorio: boolean
    --
    + cambiarFecha(nuevaFecha: Date): void
    + cambiarHora(nuevaHora: string): void
    + activarRecordatorio(): void
    + desactivarRecordatorio(): void
    + esHoy(): boolean
    + esFuturo(): boolean
    + esPasado(): boolean
    + obtenerFechaHoraFormateada(): string
    + obtenerTiempoRestante(): string
  }

  class Calendario {
    - fechaActual: Date
    - mesActual: number
    - añoActual: number
    --
    + navegarMes(direccion: DireccionNavegacion): void
    + navegarAFecha(fecha: Date): void
    + obtenerDiasMes(): List<DiaCalendario>
    + marcarFechasConEventos(eventos: List<Evento>): void
    + esFinDeSemana(fecha: Date): boolean
    + esFestivo(fecha: Date): boolean
  }

  class DiaCalendario {
    - fecha: Date
    - tieneEventos: boolean
    - numeroEventos: number
    - esHoy: boolean
    - esMesActual: boolean
    --
    + marcarConEventos(): void
    + obtenerEventos(): List<Evento>
  }

  enum DireccionNavegacion {
    ANTERIOR
    SIGUIENTE
    HOY
  }

  class EventoCambios {
    - titulo: string
    - descripcion: string
    - fecha: Date
    - hora: string
  }

  ' Relaciones
  GestorCalendario ||--o{ Evento : "administra"
  GestorCalendario ||--|| Calendario : "utiliza"
  Calendario ||--o{ DiaCalendario : "contiene"
  DiaCalendario ||--o{ Evento : "muestra"
}

@enduml
```

---

## Diagrama de Ciclo Menstrual

Este diagrama representa la funcionalidad especializada del seguimiento menstrual.

```plantuml
@startuml Amity_Ciclo_Menstrual
!theme plain

package "Seguimiento Menstrual" {

  class GestorCicloMenstrual {
    - ciclos: List<CicloMenstrual>
    - configuracion: ConfiguracionMenstrual
    --
    + registrarPeriodo(fechaInicio: Date, sintomas: string[], estadoAnimo: EstadoAnimo, flujo: IntensidadFlujo): CicloMenstrual
    + finalizarPeriodo(idCiclo: string, fechaFin: Date): void
    + obtenerCicloActual(): CicloMenstrual
    + obtenerHistorialCiclos(): List<CicloMenstrual>
    + eliminarRegistro(idCiclo: string): boolean
    + actualizarConfiguracion(nuevaConfig: ConfiguracionMenstrual): void
  }

  class CicloMenstrual {
    - id: string
    - fechaInicio: Date
    - fechaFin: Date
    - duracionCiclo: number
    - duracionPeriodo: number
    - sintomas: List<Sintoma>
    - estadoAnimo: EstadoAnimo
    - intensidadFlujo: IntensidadFlujo
    - notas: string
    --
    + calcularDuracionCiclo(): number
    + calcularDuracionPeriodo(): number
    + agregarSintoma(sintoma: Sintoma): void
    + removerSintoma(sintoma: Sintoma): void
    + cambiarEstadoAnimo(nuevoEstado: EstadoAnimo): void
    + cambiarIntensidadFlujo(nuevaIntensidad: IntensidadFlujo): void
    + estaActivo(): boolean
    + contieneFecha(fecha: Date): boolean
  }

  class PredictorCiclo {
    --
    + predecirProximoPeriodo(ciclos: List<CicloMenstrual>): Date
    + predecirOvulacion(proximoPeriodo: Date): Date
    + calcularDiaActualCiclo(ultimoCiclo: CicloMenstrual): number
    + obtenerVentanaFertil(fechaOvulacion: Date): PeriodoFertilidad
    + calcularPromedios(ciclos: List<CicloMenstrual>): PromediosCiclo
  }

  class ConfiguracionMenstrual {
    - duracionPromedioCiclo: number
    - duracionPromedioPeriodo: number
    - fechaUltimoPeriodo: Date
    - seguimientoActivo: boolean
    - recordatoriosActivos: boolean
    --
    + actualizarPromedios(nuevoCiclo: CicloMenstrual): void
    + activarSeguimiento(): void
    + desactivarSeguimiento(): void
  }

  class PeriodoFertilidad {
    - fechaInicio: Date
    - fechaFin: Date
    - probabilidadConcepccion: Probabilidad
    --
    + contieneFecha(fecha: Date): boolean
    + obtenerDuracion(): number
  }

  class PromediosCiclo {
    - duracionPromedioCiclo: number
    - duracionPromedioPeriodo: number
    - sintomasFrecuentes: List<Sintoma>
    - estadoAnimoFrecuente: EstadoAnimo
  }

  enum EstadoAnimo {
    MUY_BIEN
    BIEN
    NORMAL
    MAL
    MUY_MAL
  }

  enum IntensidadFlujo {
    MUY_LIGERO
    LIGERO
    NORMAL
    ABUNDANTE
    MUY_ABUNDANTE
  }

  enum Sintoma {
    COLICOS
    DOLOR_CABEZA
    HINCHAZON
    SENSIBILIDAD_SENOS
    CAMBIOS_HUMOR
    FATIGA
    ANSIEDAD
    ACNE
    ANTOJOS
    NAUSEAS
  }

  enum Probabilidad {
    ALTA
    MEDIA
    BAJA
  }

  ' Relaciones
  GestorCicloMenstrual ||--o{ CicloMenstrual : "administra"
  GestorCicloMenstrual ||--|| ConfiguracionMenstrual : "utiliza"
  GestorCicloMenstrual ||--|| PredictorCiclo : "utiliza"
  
  CicloMenstrual ||--|| EstadoAnimo : "tiene"
  CicloMenstrual ||--|| IntensidadFlujo : "presenta"
  CicloMenstrual ||--o{ Sintoma : "incluye"
  
  PredictorCiclo ||--|| PeriodoFertilidad : "calcula"
  PredictorCiclo ||--|| PromediosCiclo : "genera"
  
  PeriodoFertilidad ||--|| Probabilidad : "tiene"
}

@enduml
```

---

## Diagrama de Relaciones Generales

Este diagrama muestra cómo interactúan todas las funcionalidades principales de Amity.

```plantuml
@startuml Amity_Relaciones_Generales
!theme plain

package "Sistema Amity" {

  class UsuarioAmity {
    - nombre: string
    - fechaRegistro: Date
    - configuraciones: Configuraciones
    --
    + autenticar(): boolean
    + obtenerEstadisticasGenerales(): EstadisticasGenerales
  }

  class GestorTareas {
    - tareas: List<Tarea>
    --
    + gestionarTareas(): void
    + calcularProductividad(): number
  }

  class GestorNotas {
    - notas: List<Nota>
    --
    + gestionarNotas(): void
    + obtenerResumen(): string
  }

  class GestorCalendario {
    - eventos: List<Evento>
    --
    + gestionarEventos(): void
    + sincronizarConCicloMenstrual(): void
  }

  class GestorCicloMenstrual {
    - ciclos: List<CicloMenstrual>
    --
    + gestionarCiclos(): void
    + integrarConCalendario(): void
  }

  class EstadisticasGenerales {
    - tareasCompletadas: number
    - notasCreadas: number
    - eventosProximos: number
    - diasCicloActual: number
    - proximoPeriodo: Date
    --
    + generarResumenActividad(): string
    + obtenerTendenciasUsuario(): TendenciasUsuario
  }

  class TendenciasUsuario {
    - productividadSemanal: number
    - frecuenciaUsoNotas: number
    - eventosPromedioPorMes: number
    - regularidadCiclo: number
    --
    + analizarPatrones(): string
  }

  class SincronizadorDatos {
    --
    + sincronizarEventosConCiclo(eventos: List<Evento>, ciclos: List<CicloMenstrual>): void
    + marcarFechasPeriodoEnCalendario(): void
    + crearRecordatoriosCiclo(): List<Evento>
  }

  ' Relaciones principales
  UsuarioAmity ||--|| GestorTareas : "utiliza"
  UsuarioAmity ||--|| GestorNotas : "utiliza"
  UsuarioAmity ||--|| GestorCalendario : "utiliza"
  UsuarioAmity ||--|| GestorCicloMenstrual : "utiliza"
  UsuarioAmity ||--|| EstadisticasGenerales : "consulta"
  
  EstadisticasGenerales ||--|| TendenciasUsuario : "incluye"
  
  GestorCalendario ||--|| SincronizadorDatos : "utiliza"
  GestorCicloMenstrual ||--|| SincronizadorDatos : "utiliza"
  
  ' Integración entre módulos
  GestorCalendario ..> GestorCicloMenstrual : "se integra con"
  GestorCicloMenstrual ..> GestorCalendario : "actualiza"
}

@enduml
```

---

## Resumen de Funcionalidades

### Gestión de Tareas
- Crear, completar y eliminar tareas
- Seguimiento de productividad con estadísticas
- Gestión de fechas de vencimiento

### Sistema de Notas
- Creación y gestión de notas de texto libre
- Búsqueda y organización por fecha
- Resúmenes automáticos de contenido

### Calendario y Eventos
- Planificación de eventos con fecha y hora
- Navegación mensual interactiva
- Integración con ciclo menstrual

### Seguimiento Menstrual
- Registro de períodos con síntomas y estado de ánimo
- Predicciones automáticas de próximo período y ovulación
- Cálculo de promedios y tendencias del ciclo
- Configuración personalizable de seguimiento

Todas estas funcionalidades están diseñadas para trabajar de forma integrada, proporcionando una experiencia completa de gestión personal y bienestar.
