import axios from "axios";

/** API JSON + ficheiros (documentação interactiva: /index.html) */
const BASE_URL = "http://161.97.159.75:9001";
// URL relativa sempre: Vite proxy (dev) e Vercel rewrite (prod) tratam o encaminhamento.
// Necessário para iOS — o Safari/WebKit bloqueia cookies SameSite=None de origens cruzadas.
const API_URL = "/api/";

export const API_SWAGGER_URL = `${BASE_URL}/index.html`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
     "ngrok-skip-browser-warning": "true"
  },
  withCredentials: true, // Enviar cookies para autenticação baseada em sessão
});

// Upload de ficheiros (FormData): o browser tem de definir o Content-Type com o boundary do
// multipart — se ficar "application/json" (o omissão acima) ou "multipart/form-data" sem
// boundary, o servidor não consegue fazer parse do corpo.
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// Sessão expirada/inválida: avisa a app (fora do ciclo do React) para limpar o
// utilizador e voltar ao login, sem precisar de refresh da página.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

// Exportar a URL base para usar em imagens
export const BASE_IMAGE_URL = BASE_URL;

// Função utilitária para obter URL completa de imagem
export const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/placeholder-image.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  
  // Se o caminho já começar com /api/files, usa diretamente
  if (imagePath.startsWith('/api/')) {
    return `${BASE_URL}${imagePath}`;
  }
  
  // Se for apenas o caminho do arquivo
  return `${BASE_URL}/api/files/${imagePath}`;
};

// Função para obter URL de thumbnail (se necessário)
export const getThumbnailUrl = (imagePath: string | null | undefined): string => {
  // Pode implementar lógica de thumbnail se a API suportar
  return getFullImageUrl(imagePath);
};

export default api;