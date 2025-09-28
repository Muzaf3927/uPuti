// Менеджер сессий для управления аутентификацией пользователей
import { safeLocalStorage } from "./localStorage";

export const sessionManager = {
  // Проверяет, есть ли активная сессия
  hasActiveSession: () => {
    const token = safeLocalStorage.getItem("token");
    const user = safeLocalStorage.getItem("user");
    
    return !!(token && user && token !== "" && !token.startsWith("mock_token_"));
  },

  // Получает данные пользователя из localStorage
  getUserData: () => {
    try {
      const userData = safeLocalStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Получает токен
  getToken: () => {
    return safeLocalStorage.getItem("token");
  },

  // Очищает всю сессию
  clearSession: () => {
    safeLocalStorage.removeItem("token");
    safeLocalStorage.removeItem("user");
    safeLocalStorage.removeItem("reFreshToken");
    safeLocalStorage.removeItem("showOnboarding");
  },

  // Создает новую сессию
  createSession: (userData, token) => {
    // Сначала очищаем старую сессию
    sessionManager.clearSession();
    
    // Создаем новую
    safeLocalStorage.setItem("token", token);
    safeLocalStorage.setItem("user", JSON.stringify(userData));
  },

  // Проверяет валидность токена
  isTokenValid: (token) => {
    return token && 
           token !== "" && 
           token !== "null" && 
           token !== "undefined" &&
           !token.startsWith("mock_token_");
  },

  // Проверяет, не истекла ли сессия
  isSessionExpired: () => {
    const token = sessionManager.getToken();
    if (!sessionManager.isTokenValid(token)) {
      return true;
    }
    
    // Дополнительная проверка на mock токены
    if (token && token.startsWith("mock_token_")) {
      return false; // Mock токены не истекают
    }
    
    return false;
  },

  // Принудительно завершает все сессии (для входа с нового устройства)
  forceLogoutAllSessions: () => {
    sessionManager.clearSession();
    // Здесь можно добавить API вызов для инвалидации всех токенов на сервере
    console.log("All sessions cleared - user can now login from any device");
  }
};
