# Configuración de la API

Este directorio contiene la configuración centralizada para todas las URLs de la API.

## Archivo `api.js`

El archivo `api.js` contiene todas las URLs de la API en un solo lugar para facilitar el mantenimiento y la configuración.

### Uso

```javascript
import { API_URLS, API_BASE_URL } from '../config/api';

axios.get(API_URLS.FORMAS)
axios.post(API_URLS.CALZADOS, data)
axios.patch(API_URLS.MARCAS + id, data)

const customUrl = `${API_BASE_URL}/custom-endpoint/`;
```

### URLs disponibles

- `API_URLS.FORMAS` - Endpoint para figuras/formas
- `API_URLS.CALZADOS` - Endpoint para calzados
- `API_URLS.SUELAS` - Endpoint para suelas
- `API_URLS.MARCAS` - Endpoint para marcas
- `API_URLS.MODELOS` - Endpoint para modelos
- `API_URLS.CATEGORIAS` - Endpoint para categorías
- `API_URLS.COLORES` - Endpoint para colores

### Cambiar la URL base

Para cambiar la URL base de la API (por ejemplo, para producción), solo necesitas modificar la constante `API_BASE_URL` en el archivo `api.js`:

```javascript
// Para desarrollo local
const API_BASE_URL = "http://127.0.0.1:5000";

// Para producción
const API_BASE_URL = "https://tu-api-produccion.com";
```

### Ventajas

1. **Mantenimiento centralizado**: Todas las URLs están en un solo lugar
2. **Fácil configuración**: Cambiar entre entornos es simple
3. **Consistencia**: Todas las partes de la aplicación usan las mismas URLs
4. **Menos errores**: No hay URLs hardcodeadas dispersas en el código 