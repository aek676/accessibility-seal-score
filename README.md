# Generador de Sellos de Accesibilidad

## 📋 Descripción

Este proyecto es un generador de sellos de accesibilidad que permite crear sellos personalizados basados en puntuaciones de accesibilidad. El sistema consta de dos componentes principales:

- **API Backend (Python/FastAPI)**: Servicio que genera los sellos de accesibilidad en formato PNG
- **Frontend (React/TypeScript)**: Interfaz web para interactuar con la API y generar los sellos

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura de microservicios con Docker:

- **API (Puerto 8000)**: Backend en Python con FastAPI que procesa las solicitudes y genera las imágenes de los sellos
- **Frontend (Puerto 3000)**: Aplicación React que proporciona la interfaz de usuario
- **Docker Compose**: Orquesta ambos servicios con configuración de red y health checks

## 🚀 Requisitos

- Docker
- Docker Compose

## 📦 Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd accessibility-seal-score
```

### 2. Ejecutar con Docker Compose

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up --build -d
```

### 3. Acceder a las aplicaciones

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **Documentación de la API**: http://localhost:8000/docs

## 🎯 Funcionalidades

### API Endpoints

- `GET /` - Mensaje de bienvenida
- `GET /health` - Check de salud del servicio
- `GET /api/imagen-score/{score}` - Genera sellos basados en la puntuación proporcionada

### Frontend

- Interfaz intuitiva para introducir puntuaciones
- Generación de sellos en tiempo real
- Descarga de imágenes generadas
- Sellos disponibles en versión blanca y negra

## 🔍 Health Checks

Ambos servicios incluyen health checks configurados:

- **API**: Verifica la disponibilidad en `/health`
- **Frontend**: Verifica la disponibilidad del puerto 3000

## 🐛 Troubleshooting

### Problemas comunes

1. **Puerto ocupado**: Si los puertos 3000 o 8000 están en uso, modifica las configuraciones en `docker-compose.yml`

2. **Problemas de permisos**: Asegúrate de que Docker tenga permisos para acceder a los directorios del proyecto

3. **Health check fallando**: Espera unos minutos para que los servicios se inicialicen completamente

### Logs útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs específicos del API
docker-compose logs -f api
```

## 📝 Desarrollo

Para desarrollo local sin Docker:

### API
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd generador-de-sellos
npm install
npm run dev
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request