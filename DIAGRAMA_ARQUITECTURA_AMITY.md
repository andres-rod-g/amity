# Diagrama de Arquitectura del Sistema - Amity

## Índice
1. [Arquitectura General del Sistema](#arquitectura-general-del-sistema)
2. [Arquitectura de Capas](#arquitectura-de-capas)
3. [Arquitectura de Módulos de Negocio](#arquitectura-de-módulos-de-negocio)
4. [Flujo de Datos](#flujo-de-datos)
5. [Arquitectura de Persistencia](#arquitectura-de-persistencia)
6. [Arquitectura de Integración](#arquitectura-de-integración)

---

## Arquitectura General del Sistema

Este diagrama muestra la vista general de la arquitectura del sistema Amity enfocada en la lógica de negocio.

```plantuml
@startuml Amity_Arquitectura_General
!theme plain

package "Sistema Amity" {
  
  [Usuario] as user
  
  package "Capa de Aplicación" {
    [Controlador Principal] as controller
    [Servicio de Autenticación] as auth
    [Manejador de Sesión] as session
  }
  
  package "Capa de Dominio" {
    [Gestión de Tareas] as tasks
    [Gestión de Notas] as notes
    [Gestión de Calendario] as calendar
    [Seguimiento Menstrual] as menstrual
    [Calculadora de Estadísticas] as stats
  }
  
  package "Capa de Servicios" {
    [Predictor de Ciclos] as predictor
    [Validador de Datos] as validator
    [Generador de IDs] as idgen
    [Formateador de Fechas] as formatter
  }
  
  package "Capa de Persistencia" {
    [Repositorio de Datos] as repo
    [Almacenamiento Local] as storage
  }
  
  ' Conexiones
  user --> controller
  controller --> auth
  controller --> session
  controller --> tasks
  controller --> notes
  controller --> calendar
  controller --> menstrual
  
  tasks --> stats
  menstrual --> predictor
  
  tasks --> validator
  notes --> validator
  calendar --> validator
  menstrual --> validator
  
  tasks --> idgen
  notes --> idgen
  calendar --> idgen
  menstrual --> idgen
  
  calendar --> formatter
  menstrual --> formatter
  
  tasks --> repo
  notes --> repo
  calendar --> repo
  menstrual --> repo
  auth --> repo
  
  repo --> storage
}

@enduml
```

---

## Arquitectura de Capas

Este diagrama detalla la separación por capas del sistema.

```plantuml
@startuml Amity_Arquitectura_Capas
!theme plain

package "Arquitectura por Capas" {
  
  package "Capa de Presentación" as presentation <<Rectangle>> {
    [Interfaz de Usuario] as ui
    [Controladores de Vista] as viewcontrollers
    [Validadores de Entrada] as inputvalidators
  }
  
  package "Capa de Aplicación" as application <<Rectangle>> {
    [Casos de Uso de Tareas] as taskusecases
    [Casos de Uso de Notas] as noteusecases
    [Casos de Uso de Calendario] as calendarusecases
    [Casos de Uso Menstruales] as menstrualusecases
    [Coordinador de Operaciones] as coordinator
  }
  
  package "Capa de Dominio" as domain <<Rectangle>> {
    [Entidades de Negocio] as entities
    [Reglas de Negocio] as businessrules
    [Servicios de Dominio] as domainservices
    [Interfaces de Repositorio] as repointerfaces
  }
  
  package "Capa de Infraestructura" as infrastructure <<Rectangle>> {
    [Implementación de Repositorios] as repoimpl
    [Servicios de Persistencia] as persistence
    [Servicios Externos] as external
    [Utilidades del Sistema] as utilities
  }
  
  ' Dependencias
  ui --> viewcontrollers
  viewcontrollers --> inputvalidators
  viewcontrollers --> taskusecases
  viewcontrollers --> noteusecases
  viewcontrollers --> calendarusecases
  viewcontrollers --> menstrualusecases
  
  taskusecases --> coordinator
  noteusecases --> coordinator
  calendarusecases --> coordinator
  menstrualusecases --> coordinator
  
  coordinator --> entities
  coordinator --> businessrules
  coordinator --> domainservices
  coordinator --> repointerfaces
  
  repointerfaces <|.. repoimpl
  repoimpl --> persistence
  repoimpl --> external
  repoimpl --> utilities
}

@enduml
```

---

## Arquitectura de Módulos de Negocio

Este diagrama muestra la organización de los módulos principales del negocio.

```plantuml
@startuml Amity_Modulos_Negocio
!theme plain

package "Módulos de Negocio Amity" {
  
  package "Módulo de Gestión Personal" as personal {
    [Autenticación de Usuario] as userauth
    [Perfil de Usuario] as userprofile
    [Configuraciones] as settings
  }
  
  package "Módulo de Productividad" as productivity {
    [Gestión de Tareas] as taskmanagement
    [Sistema de Notas] as notesystem
    [Calculadora de Estadísticas] as statscalc
    [Generador de Reportes] as reports
  }
  
  package "Módulo de Planificación" as planning {
    [Gestión de Calendario] as calendarmanagement
    [Administrador de Eventos] as eventmanager
    [Recordatorios] as reminders
  }
  
  package "Módulo de Salud Femenina" as health {
    [Seguimiento Menstrual] as menstrualtracking
    [Predictor de Ciclos] as cyclepredictor
    [Análisis de Patrones] as patternanalysis
    [Registro de Síntomas] as symptomtracking
  }
  
  package "Módulo de Integración" as integration {
    [Sincronizador de Datos] as datasync
    [Coordinador de Módulos] as modulecoordinator
    [Notificaciones Internas] as notifications
  }
  
  package "Módulo de Persistencia" as persistence {
    [Administrador de Datos] as datamanager
    [Backup y Restauración] as backup
    [Validador de Integridad] as integrity
  }
  
  ' Relaciones entre módulos
  personal --> productivity : "configura"
  personal --> planning : "personaliza"
  personal --> health : "habilita"
  
  productivity --> integration : "sincroniza con"
  planning --> integration : "sincroniza con"
  health --> integration : "sincroniza con"
  
  planning --> health : "integra eventos de"
  health --> planning : "genera eventos para"
  
  integration --> persistence : "gestiona datos"
  personal --> persistence : "almacena configuración"
  productivity --> persistence : "persiste datos"
  planning --> persistence : "guarda eventos"
  health --> persistence : "registra ciclos"
}

@enduml
```

---

## Flujo de Datos

Este diagrama ilustra cómo fluyen los datos a través del sistema.

```plantuml
@startuml Amity_Flujo_Datos
!theme plain

!define RECTANGLE class

package "Flujo de Datos del Sistema" {
  
  RECTANGLE "Entrada de Usuario" as input {
    + Acciones de Usuario
    + Datos de Formulario
    + Selecciones de Interfaz
  }
  
  RECTANGLE "Procesamiento de Comandos" as commands {
    + Validación de Entrada
    + Transformación de Datos
    + Ejecución de Lógica
  }
  
  RECTANGLE "Motor de Reglas de Negocio" as businessengine {
    + Reglas de Tareas
    + Reglas de Calendario
    + Reglas Menstruales
    + Cálculos de Estadísticas
  }
  
  RECTANGLE "Procesador de Datos" as processor {
    + Generación de IDs
    + Formateo de Fechas
    + Cálculo de Predicciones
    + Agregación de Estadísticas
  }
  
  RECTANGLE "Almacén de Datos" as datastore {
    + Datos de Usuario
    + Tareas y Notas
    + Eventos de Calendario
    + Registros Menstruales
  }
  
  RECTANGLE "Generador de Respuestas" as responses {
    + Estados Actualizados
    + Datos de Vista
    + Notificaciones
    + Errores y Validaciones
  }
  
  RECTANGLE "Salida al Usuario" as output {
    + Interfaz Actualizada
    + Feedback Visual
    + Datos Mostrados
  }
  
  ' Flujo de datos
  input --> commands : "envía"
  commands --> businessengine : "aplica"
  businessengine --> processor : "procesa"
  processor --> datastore : "almacena"
  datastore --> processor : "recupera"
  processor --> responses : "genera"
  responses --> output : "presenta"
  
  ' Flujo de retroalimentación
  output --> input : "retroalimenta"
  datastore --> businessengine : "consulta estado"
}

@enduml
```

---

## Arquitectura de Persistencia

Este diagrama muestra cómo se manejan los datos en el sistema.

```plantuml
@startuml Amity_Arquitectura_Persistencia
!theme plain

package "Arquitectura de Persistencia" {
  
  package "Capa de Acceso a Datos" as dataaccess {
    [Repositorio de Usuario] as userrepo
    [Repositorio de Tareas] as taskrepo
    [Repositorio de Notas] as noterepo
    [Repositorio de Eventos] as eventrepo
    [Repositorio Menstrual] as menstrualrepo
  }
  
  package "Capa de Serialización" as serialization {
    [Serializador JSON] as jsonserializer
    [Validador de Esquemas] as schemavalidator
    [Conversor de Tipos] as typeconverter
    [Manejador de Versiones] as versionhandler
  }
  
  package "Capa de Almacenamiento" as storage {
    [Almacenamiento Local] as localstorage
    [Gestor de Archivos] as filemanager
    [Control de Transacciones] as transactions
    [Backup Automático] as autobackup
  }
  
  package "Servicios de Datos" as dataservices {
    [Agregador de Estadísticas] as aggregator
    [Calculadora de Métricas] as calculator
    [Generador de Reportes] as reportgenerator
    [Analizador de Patrones] as analyzer
  }
  
  ' Flujo de persistencia
  userrepo --> jsonserializer
  taskrepo --> jsonserializer
  noterepo --> jsonserializer
  eventrepo --> jsonserializer
  menstrualrepo --> jsonserializer
  
  jsonserializer --> schemavalidator
  jsonserializer --> typeconverter
  jsonserializer --> versionhandler
  
  schemavalidator --> localstorage
  typeconverter --> localstorage
  versionhandler --> localstorage
  
  localstorage --> filemanager
  localstorage --> transactions
  localstorage --> autobackup
  
  ' Servicios que consumen datos
  taskrepo --> aggregator
  eventrepo --> calculator
  menstrualrepo --> reportgenerator
  menstrualrepo --> analyzer
}

@enduml
```

---

## Arquitectura de Integración

Este diagrama muestra cómo se integran los diferentes módulos del sistema.

```plantuml
@startuml Amity_Arquitectura_Integracion
!theme plain

package "Arquitectura de Integración" {
  
  [Hub Central de Datos] as datahub
  
  package "Productividad" as prod {
    [API Tareas] as taskapi
    [API Notas] as noteapi
    [Calculadora Estadísticas] as statscalc
  }
  
  package "Calendario" as cal {
    [API Calendario] as calapi
    [Gestor de Eventos] as eventmgr
    [Programador] as scheduler
  }
  
  package "Salud Menstrual" as health {
    [API Ciclo Menstrual] as cycleapi
    [Motor de Predicciones] as predictionengine
    [Analizador de Síntomas] as symptomanalyzer
  }
  
  package "Servicios Compartidos" as shared {
    [Generador de IDs] as idservice
    [Validador Universal] as validator
    [Formateador de Fechas] as dateformatter
    [Notificador de Eventos] as notifier
  }
  
  package "Orquestador de Integraciones" as orchestrator {
    [Sincronizador Calendario-Menstrual] as calsync
    [Integrador de Estadísticas] as statsintegrator
    [Coordinador de Notificaciones] as notificationcoord
  }
  
  ' Conexiones al hub central
  taskapi --> datahub
  noteapi --> datahub
  calapi --> datahub
  cycleapi --> datahub
  
  datahub --> statscalc
  datahub --> eventmgr
  datahub --> predictionengine
  datahub --> symptomanalyzer
  
  ' Uso de servicios compartidos
  taskapi --> idservice
  noteapi --> idservice
  calapi --> idservice
  cycleapi --> idservice
  
  taskapi --> validator
  noteapi --> validator
  calapi --> validator
  cycleapi --> validator
  
  calapi --> dateformatter
  cycleapi --> dateformatter
  
  ' Integraciones específicas
  calsync --> calapi
  calsync --> cycleapi
  
  statsintegrator --> taskapi
  statsintegrator --> noteapi
  statsintegrator --> calapi
  
  notificationcoord --> notifier
  notificationcoord --> predictionengine
  notificationcoord --> scheduler
  
  ' Flujo de eventos
  predictionengine --> calsync : "eventos de predicción"
  eventmgr --> calsync : "eventos de calendario"
  statscalc --> statsintegrator : "estadísticas calculadas"
}

@enduml
```

---

## Resumen Arquitectónico

### Principios de Diseño
- **Separación de Responsabilidades**: Cada módulo tiene una función específica y bien definida
- **Bajo Acoplamiento**: Los módulos se comunican a través de interfaces bien definidas
- **Alta Cohesión**: Funcionalidades relacionadas están agrupadas en el mismo módulo
- **Inversión de Dependencias**: Los módulos de alto nivel no dependen de detalles de implementación

### Características Principales
- **Arquitectura Modular**: Organización en módulos independientes pero integrados
- **Flujo de Datos Unidireccional**: Datos fluyen de manera predecible a través del sistema
- **Persistencia Local**: Almacenamiento completamente local sin dependencias externas
- **Integración Inteligente**: Sincronización automática entre calendario y ciclo menstrual

### Escalabilidad
- **Módulos Extensibles**: Fácil adición de nuevas funcionalidades
- **Servicios Reutilizables**: Componentes compartidos entre módulos
- **Arquitectura por Capas**: Separación clara entre lógica de negocio y persistencia
- **Patrones de Integración**: Comunicación estandarizada entre módulos

Esta arquitectura garantiza un sistema robusto, mantenible y escalable centrado en las necesidades del usuario final.
