import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Хук для умного автоматического обновления данных
 * @param {Function} refreshFunction - функция для обновления данных
 * @param {number} interval - интервал обновления в миллисекундах (по умолчанию 5000)
 * @param {Array} dependencies - зависимости для перезапуска интервала
 */
export function useSmartRefresh(refreshFunction, interval = 5000, dependencies = []) {
  const location = useLocation();
  const intervalRef = useRef(null);
  const isTypingRef = useRef(false);
  const isCreatingRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  
  // Отслеживаем активность пользователя
  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Отслеживаем печать в чатах
    const handleTyping = (e) => {
      // Проверяем, что это поле ввода сообщения
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
        isTypingRef.current = true;
        lastActivityRef.current = Date.now();
        
        // Сбрасываем флаг печати через 2 секунды после последней активности
        setTimeout(() => {
          if (Date.now() - lastActivityRef.current >= 2000) {
            isTypingRef.current = false;
          }
        }, 2000);
      }
    };

    // Отслеживаем создание поездок
    const handleFormActivity = (e) => {
      if (e.target.closest('form') || e.target.closest('[data-creating-trip]')) {
        isCreatingRef.current = true;
        lastActivityRef.current = Date.now();
      }
    };

    document.addEventListener('keydown', handleTyping);
    document.addEventListener('input', handleTyping);
    document.addEventListener('click', handleFormActivity);
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('touchstart', handleActivity);

    return () => {
      document.removeEventListener('keydown', handleTyping);
      document.removeEventListener('input', handleTyping);
      document.removeEventListener('click', handleFormActivity);
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Функция для принудительного обновления (после действий пользователя)
  const forceRefresh = () => {
    if (refreshFunction) {
      refreshFunction();
    }
  };

  // Функция для сброса флагов активности
  const resetActivityFlags = () => {
    isTypingRef.current = false;
    isCreatingRef.current = false;
  };

  // Настройка автоматического обновления
  useEffect(() => {
    if (!refreshFunction) return;

    const startInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        // Не обновляем если пользователь печатает или создает поездку
        if (isTypingRef.current || isCreatingRef.current) {
          return;
        }

        // Не обновляем если пользователь неактивен более 30 секунд
        if (Date.now() - lastActivityRef.current > 30000) {
          return;
        }

        // Обновляем данные
        refreshFunction();
      }, interval);
    };

    // Запускаем интервал
    startInterval();

    // Очищаем интервал при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshFunction, interval, ...dependencies]);

  // Очищаем интервал при смене страницы
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [location.pathname]);

  return {
    forceRefresh,
    resetActivityFlags,
    isTyping: isTypingRef.current,
    isCreating: isCreatingRef.current
  };
}
