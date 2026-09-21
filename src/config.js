// Si la variable está vacía, usa una cadena vacía para que las rutas sean relativas (ej. /api/...)
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL !== undefined
    ? process.env.REACT_APP_API_BASE_URL
    : '';
