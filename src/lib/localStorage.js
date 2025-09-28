// Безопасная работа с localStorage
// Защищает от ошибок когда localStorage недоступен (SSR, iframe, приватный режим)

export const safeLocalStorage = {
  // Безопасное получение значения из localStorage
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },

  // Безопасное сохранение значения в localStorage
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },

  // Безопасное удаление значения из localStorage
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  },

  // Безопасная очистка всего localStorage
  clear: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
        return true;
      }
      return false;
    } catch (error) {
      console.warn('localStorage.clear failed:', error);
      return false;
    }
  }
};
