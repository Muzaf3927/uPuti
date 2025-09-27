import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const I18nContext = createContext({ lang: "uz", t: (k) => k, setLang: () => {} });

const dict = {
  uz: {
    nav: {
      requests: "So'rovlar",
      booking: "Bronlar",
      history: "Tarix",
      trips: "Safarlar",
      chats: "Chatlar",
    },
    chats: {
      selectChat: "Chatni tanlang",
      placeholder: "Xabar yozing...",
      send: "Yuborish",
    },
    booking: {
      myBookings: "Mening bronlarim",
      toMe: "Mening safarımga bronlar",
      loading: "Yuklanmoqda...",
      none: "Hali bronlaringiz yo'q.",
      myTripsNone: "Hali siz yaratgan safarlar yo'q.",
      writeDriver: "Haydovchiga yozish",
      writePassenger: "Yo'lovchiga yozish",
      write: "Yozish",
      call: "Qo'ng'iroq qilish",
    },
    history: {
      driverTab: "Mening tugagan safarlarim",
      passengerTab: "Men yo'lovchi bo'lgan",
      empty: "Safarlar tarixi bo‘sh",
      totalEarn: "Umumiy daromad",
      completed: "yakunlangan",
      rate: "Baholash",
      rateDriver: "Haydovchini baholash",
      save: "Saqlash",
      cancel: "Bekor qilish",
    },
    tripsCard: {
      book: "Bron qilish",
      offer: "Narx taklif qilish",
      cancel: "Bekor qilish",
      seats: "o'rindiq",
      priceSuffix: "sum",
      commentPlaceholder: "Shuncha so'm taklif qila olaman",
      bookingTitle: "Necha o'rin band qilmoqchisiz?",
      offerTitle: "Narx taklif qilish",
      seatsLabel: "O'rindiqlar soni",
      seatsPlaceholder: "1-4 o'rin",
      priceLabel: "Taklif narxi (so'm)",
      commentLabel: "Izoh",
      submitBooking: "Yuborish",
      submitOffer: "Yuborish",
      cancelButton: "Bekor qilish"
    },
    profile: {
      back: "Orqaga qaytish",
      edit: "Tahrirlash",
      balance: "Balans:",
      rating: "Reyting:",
      hello: "Salom",
    },
    trips: {
      all: "Barcha safarlar",
      mine: "Mening safarlarim",
      create: "Safar yaratish",
      search: "Safar qidirish",
      empty: "Hozirda hali sizda safarlar yo'q.",
      commentPlaceholder: "(ixtiyoriy) Cherez Samarqand ketaman/ Pochta olaman",
      form: {
        from: "Qayerdan",
        to: "Qayerga",
        date: "Sana",
        time: "Vaqt",
        cost: "Xizmat haqqi",
        carModel: "Mashina modeli",
        carColor: "Mashina rangi",
        carNumber: "Mashina raqami",
        carSeats: "O'rindiqlar soni",
        note: "Izoh",
        cancel: "Bekor qilish",
        submit: "Yaratish",
        fromPlaceholder: "Toshkent",
        toPlaceholder: "Buxoro",
        costPlaceholder: "50000",
        carModelPlaceholder: "Nexia",
        carColorPlaceholder: "Oq",
        carNumberPlaceholder: "01A123BC",
        carSeatsPlaceholder: "4",
        validationError: "Iltimos, barcha majburiy maydonlarni to'ldiring",
        successMessage: "Safar yaratildi.",
        errorMessage: "Safar yaratishda xatolik yuz berdi."
      },
      searchForm: {
        from: "Qayerdan",
        to: "Qayerga",
        date: "Sana",
        fromPlaceholder: "Qaysi shahardan",
        toPlaceholder: "Qaysi shaharga",
        datePlaceholder: "06.09.2025",
        search: "Qidirish",
        cancel: "Bekor qilish",
        clear: "Qidiruvni tozalash"
      },
      confirmation: {
        title: "Tasdiqlash",
        message: "Sizning so'rovingiz haydovchi tomonidan qabul qilinishi kerak. Qabul qilingandan keyin sizning telefon raqamingiz unga ko'rinadi.",
        continue: "Davom etish",
        cancel: "Bekor qilish"
      }
    },
    auth: {
      slogan: "Birgalikda yo‘l — hamyonbop va ishonchli",
      loginTitle: "Tizimga kirish",
      loginSubtitle: "Prifilingizga kiring",
      loginBtn: "Kirish",
      loginLoading: "Kirilmoqda...",
      forgot: "Parol esdan chiqdimi?",
      needAccount: "Hisobingiz yo'qmi?",
      register: "Ro'yhatdan o'ting",
      phoneLabel: "Telefon raqami",
      passwordLabel: "Parol",
      signupTitle: "Ro'yhatdan o'tish",
      signupSubtitle: "Profil yaratish",
      nameLabel: "Ism",
      phonePlaceholder: "(90) 123 45 67",
      signupBtn: "Ro'yhatdan o'tish",
      signupProgress: "Ro'yhatdan o'tilmoqda...",
      haveAccount: "Allaqachon hisobingiz bormi?",
      goLogin: "Tizimga kiring",
      verifyTitle: "Raqamingizga kelgan kodni kiriting",
      code: "Kod",
      send: "Yuborish",
    },
    myTripsCard: {
      requests: "So'rovlar",
      bookings: "Bronlar",
      complete: "Yakunlash",
      edit: "Tahrirlash",
      delete: "O'chirish",
      loading: "Yuklanmoqda...",
      noRequests: "Hozircha so'rovlar yo'q.",
      noBookings: "Hozircha bronlar yo'q.",
      accept: "Qabul qilish",
      decline: "Bekor qilish",
      acceptedToast: "Tasdiqlandi.",
      declinedToast: "Bekor qilindi.",
      completeToast: "Safar yakunlandi.",
      completeError: "Yakunlashda xatolik.",
    },
    requests: {
      mineTab: "Men yuborgan so'rovlar",
      toMeTab: "Menga kelgan so'rovlar",
      loading: "Yuklanmoqda...",
      emptyMine: "Hozircha yuborgan so'rovlaringiz yo'q.",
      emptyToMe: "Hozircha sizning safarlarga so'rovlar yo'q.",
      pending: "Kutilmoqda",
      seats: "ta o'rin",
      price: "Narx",
      offer: "Taklif",
      accept: "Qabul qilish",
      decline: "Bekor qilish",
      acceptedToast: "Tasdiqlandi.",
      declinedToast: "Bekor qilindi.",
      acceptError: "Tasdiqlashda xatolik.",
      declineError: "Bekor qilishda xatolik.",
    },
    profilePanel: {
      support: "Texnik yordam",
      name: "Ism",
      phone: "Telefon",
      rating: "Reyting",
      balance: "Balans",
      logout: "Tizimdan chiqish",
    },
    support: {
      title: "Savollar va takliflar",
      description: "Telegram orqali biz bilan bog'laning",
      button: "UPuti",
      close: "Yopish",
    },
  },
  ru: {
    nav: {
      requests: "Заявки",
      booking: "Брони",
      history: "История",
      trips: "Поездки",
      chats: "Чаты",
    },
    chats: {
      selectChat: "Выберите чат",
      placeholder: "Напишите сообщение...",
      send: "Отправить",
    },
    booking: {
      myBookings: "Мои брони",
      toMe: "Брони пассажиров",
      loading: "Загрузка...",
      none: "Пока нет броней.",
      myTripsNone: "Пока нет ваших поездок.",
      writeDriver: "Написать водителю",
      writePassenger: "Написать пассажиру",
      write: "Написать",
      call: "Позвонить",
    },
    history: {
      driverTab: "Как водитель",
      passengerTab: "Как пассажир",
      empty: "История поездок пуста",
      totalEarn: "Общий заработок",
      completed: "завершено",
      rate: "Оценить",
      rateDriver: "Оценить водителя",
      save: "Сохранить",
      cancel: "Отмена",
    },
    tripsCard: {
      book: "Забронировать",
      offer: "Предложить цену",
      cancel: "Отменить",
      seats: "мест",
      priceSuffix: "сум",
      commentPlaceholder: "Могу предложить столько сумм",
      bookingTitle: "Сколько мест хотите забронировать?",
      offerTitle: "Предложить цену",
      seatsLabel: "Количество мест",
      seatsPlaceholder: "1-4 места",
      priceLabel: "Предложенная цена (сум)",
      commentLabel: "Комментарий",
      submitBooking: "Отправить",
      submitOffer: "Отправить",
      cancelButton: "Отмена"
    },
    profile: {
      back: "Назад",
      edit: "Редактировать",
      balance: "Баланс:",
      rating: "Рейтинг:",
      hello: "Привет",
    },
    trips: {
      all: "Все поездки",
      mine: "Мои поездки",
      create: "Создать поездку",
      search: "Поиск поездки",
      empty: "Пока у вас нет поездок.",
      commentPlaceholder: "(не обязательно) Через Самарканд поеду/ Беру почта",
      form: {
        from: "Откуда",
        to: "Куда",
        date: "Дата",
        time: "Время",
        cost: "Стоимость",
        carModel: "Модель машины",
        carColor: "Цвет машины",
        carNumber: "Номер машины",
        carSeats: "Количество мест",
        note: "Примечание",
        cancel: "Отмена",
        submit: "Создать",
        fromPlaceholder: "Ташкент",
        toPlaceholder: "Бухара",
        costPlaceholder: "50000",
        carModelPlaceholder: "Nexia",
        carColorPlaceholder: "Белый",
        carNumberPlaceholder: "01А123БЦ",
        carSeatsPlaceholder: "4",
        validationError: "Пожалуйста, заполните все обязательные поля",
        successMessage: "Поездка создана.",
        errorMessage: "Ошибка при создании поездки."
      },
      searchForm: {
        from: "Откуда",
        to: "Куда",
        date: "Дата",
        fromPlaceholder: "Из какого города",
        toPlaceholder: "В какой город",
        datePlaceholder: "06.09.2025",
        search: "Поиск",
        cancel: "Отмена",
        clear: "Очистить поиск"
      },
      confirmation: {
        title: "Подтверждение",
        message: "Ваш запрос должен быть принят водителем. После принятия ваш номер телефона будет ему виден.",
        continue: "Продолжить",
        cancel: "Отмена"
      }
    },
    auth: {
      slogan: "В путь вместе — доступно и надёжно",
      loginTitle: "Вход",
      loginSubtitle: "Войдите в аккаунт",
      loginBtn: "Войти",
      loginLoading: "Входим...",
      forgot: "Забыли пароль?",
      needAccount: "Нет аккаунта?",
      register: "Зарегистрируйтесь",
      phoneLabel: "Номер телефона",
      passwordLabel: "Пароль",
      signupTitle: "Регистрация",
      signupSubtitle: "Создайте аккаунт",
      nameLabel: "Имя",
      phonePlaceholder: "(90) 123 45 67",
      signupBtn: "Зарегистрироваться",
      signupProgress: "Регистрация...",
      haveAccount: "Уже есть аккаунт?",
      goLogin: "Войдите",
      verifyTitle: "Введите код из сообщения",
      code: "Код",
      send: "Отправить",
    },
    myTripsCard: {
      requests: "Заявки",
      bookings: "Брони",
      complete: "Завершить",
      edit: "Редактировать",
      delete: "Удалить",
      loading: "Загрузка...",
      noRequests: "Заявок пока нет.",
      noBookings: "Броней пока нет.",
      accept: "Принять",
      decline: "Отклонить",
      acceptedToast: "Подтверждено.",
      declinedToast: "Отклонено.",
      completeToast: "Поездка завершена.",
      completeError: "Ошибка при завершении.",
    },
    requests: {
      mineTab: "Мои заявки",
      toMeTab: "Заявки ко мне",
      loading: "Загрузка...",
      emptyMine: "Пока нет отправленных заявок.",
      emptyToMe: "Пока нет заявок на ваши поездки.",
      pending: "В ожидании",
      seats: "мест",
      price: "Цена",
      offer: "Предложение",
      accept: "Принять",
      decline: "Отклонить",
      acceptedToast: "Подтверждено.",
      declinedToast: "Отклонено.",
      acceptError: "Ошибка при подтверждении.",
      declineError: "Ошибка при отклонении.",
    },
    profilePanel: {
      support: "Техподдержка",
      name: "Имя",
      phone: "Телефон",
      rating: "Рейтинг",
      balance: "Баланс",
      logout: "Выйти",
    },
    support: {
      title: "Вопросы и предложения",
      description: "Свяжитесь с нами в Telegram",
      button: "UPuti",
      close: "Закрыть",
    },
  },
};

export function I18nProvider({ children }) {
  const [lang, setLang] = useState("uz");
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ru" || saved === "uz") {
      setLang(saved);
    }
    setIsReady(true);
  }, []);
  const t = useMemo(() => {
    const d = dict[lang] || dict.uz;
    return (key) => {
      const result = key.split(".").reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), d);
      return result !== undefined ? result : key;
    };
  }, [lang]);
  const value = useMemo(
    () => ({
      lang,
      isReady,
      setLang: (l) => {
        localStorage.setItem("lang", l);
        setLang(l);
      },
      t,
    }),
    [lang, isReady, t]
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}


