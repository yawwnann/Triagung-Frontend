const API_BASE_URL = "http://localhost:8000";

export const getImageUrl = (path?: string | null): string => {
  // Jika path tidak ada, kembalikan gambar placeholder
  if (!path) {
    return "/placeholder.png";
  }

  // Jika path sudah merupakan URL lengkap, langsung kembalikan
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Jika path dimulai dengan '/storage/', itu mungkin path yang benar dari base URL
  if (path.startsWith("/storage/")) {
    return `${API_BASE_URL}${path}`;
  }

  // Untuk kasus lain (misalnya, 'products/image.jpg'), gabungkan dengan '/storage/'
  return `${API_BASE_URL}/storage/${path}`;
};
