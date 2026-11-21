// ЖДЁМ, ПОКА СТРАНИЦА ЗАГРУЗИТСЯ
document.addEventListener("DOMContentLoaded", function () {

    // НАХОДИМ ВСЕ ЭЛЕМЕНТЫ
    const burger = document.getElementById("burgerBtn");
    const menu = document.getElementById("menu");
    const overlay = document.getElementById("overlay");

    // ФУНКЦИЯ ОТКРЫТИЯ / ЗАКРЫТИЯ
    function toggleMenu() {
        burger.classList.toggle("active");   // анимация бургера
        menu.classList.toggle("active");    // выезд меню
        overlay.classList.toggle("active"); // затемнение
    }

    // КЛИК ПО БУРГЕРУ
    burger.addEventListener("click", toggleMenu);

    // КЛИК ПО ЗАТЕМНЕНИЮ (закрывает меню)
    overlay.addEventListener("click", toggleMenu);

});







const BOOKING_API_URL = "https://75ea65f72e90e721.mokky.dev/booking";
const bookingForm = document.getElementById("bookingForm");
if (bookingForm) {

    const bookingDate = document.getElementById("bookingDate");
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    bookingDate.min = localToday;
    bookingForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const submitButton = bookingForm.querySelector(
            'button[type="submit"]'
        );

        const bookingData = {
            name: document.getElementById("bookingName").value.trim(),
            phone: document.getElementById("bookingPhone").value.trim(),
            date: bookingDate.value,
            time: document.getElementById("bookingTime").value,
            guests: Number(document.getElementById("time-select").value),
            comment: document.getElementById("bookingComment").value.trim(),
            status: "Новая",
            createdAt: new Date().toISOString()
        };

        if (!/^\+992\d{9}$/.test(bookingData.phone)) {
            alert("Введите правильный номер телефона: +992XXXXXXXXX");
            return;
        }

        if (!bookingData.name || !bookingData.date || !bookingData.time) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Отправка...';

            const response = await fetch(BOOKING_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error("Ошибка отправки бронирования");
            }

            const result = await response.json();
            alert("Бронирование успешно отправлено! Мы свяжемся с вами.");
            bookingForm.reset();
            bookingDate.min = localToday;

        } catch (error) {
            console.error("Booking error:", error);
            alert("Не удалось отправить бронирование. Попробуйте ещё раз.");

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML =
                '<i class="fa-regular fa-paper-plane"></i> Отправить Бронирование';
        }
    });
}


























const WEDDING_API ="https://75ea65f72e90e721.mokky.dev/wedding";
const weddingForm = document.getElementById("weddingForm");

if (weddingForm) {
    const dateInput = document.getElementById("weddingDate");
    const today = new Date();
    const localDate = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    dateInput.min = localDate;
    weddingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const button = document.getElementById("weddingSubmit");
        const data = {
            name: document.getElementById("weddingName").value.trim(),
            phone: document.getElementById("weddingPhone").value.trim(),
            date: dateInput.value,
            guests: Number(
                document.getElementById("weddingGuests").value
            ),
            budget: document.getElementById("weddingBudget").value.trim(),
            comment: document.getElementById("weddingMessage").value.trim(),
            status: "Новая заявка",
            createdAt: new Date().toISOString()
        };

        if (!/^\+992\d{9}$/.test(data.phone)) {
            alert("Введите правильный номер телефона: +992XXXXXXXXX");
            return;
        }

        if (data.guests < 1 || data.guests > 200) {
            alert("Количество гостей должно быть от 1 до 200.");
            return;
        }

        try {
            button.disabled = true;
            button.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Отправка...';
            const response = await fetch(WEDDING_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Ошибка отправки: " + response.status);
            }

            await response.json();
            alert("Ваша заявка успешно отправлена! Мы свяжемся с вами.");

            weddingForm.reset();
            dateInput.min = localDate;

        } catch (error) {
            console.error("Wedding error:", error);
            alert("Не удалось отправить заявку. Попробуйте ещё раз.");

        } finally {
            button.disabled = false;
            button.innerHTML =
                '<i class="fa-regular fa-heart"></i> Получить предложение';
        }
    });
}






const siteTranslations = {
    ru: {
        home: "Главная",
        about: "О нас",
        menu: "Меню",
        booking: "Бронирование",
        wedding: "Свадебный зал",
        contact: "Контакты",
        restaurant: "Ресторан Форель",
        description: "Вкус, стиль и атмосфера — в одном ресторане в сердце Худжанда.",
        view_menu: "Смотреть меню",
        reserve: "Забронировать стол",
        special: "Что делает нас особенными",
        elite: "Элитная атмосфера",
        elite_desc: "Уютная и стильная обстановка для особых моментов",

        experience: "Лет опыта",
        guests: "Довольных гостей",
        dishes: "Блюд в меню",
        rating: "Рейтинг",
        premium: "Премиум сервис",
        premium_desc: "Безупречное обслуживание на высшем уровне",
        chefs: "Опытные повара",
        chefs_desc: "Мастера своего дела с многолетним опытом",
        impressions: "Незабываемые впечатления",
        impressions_desc: "Яркие эмоции и атмосфера, которые остаются в памяти надолго",
        atmosphere: "Атмосфера ресторана",
        atmosphere_desc: "Погрузитесь в элитную атмосферу нашего ресторана",
        instagram_title: "Подписывайтесь на нас в Instagram",
        instagram_desc: "Смотрите наши последние блюда, специальные предложения и жизнь ресторана",
        visit_instagram: "Посетить Instagram",
        quick_links: "Быстрые ссылки",
        contact_us: "Свяжитесь с нами",
        cart: "Корзина"
    },

    en: {
        home: "Home",
        about: "About Us",
        menu: "Menu",
        booking: "Reservation",
        wedding: "Wedding Hall",
        contact: "Contact",
        restaurant: "Forel Restaurant",
        description: "Taste, style and atmosphere — all in one restaurant in the heart of Khujand.",
        view_menu: "View Menu",
        reserve: "Book a Table",
        special: "What Makes Us Special",
        elite: "Elegant Atmosphere",
        elite_desc: "A cozy and stylish setting for special moments",

        experience: "Years of experience",
        guests: "Happy guests",
        dishes: "Dishes on the menu",
        rating: "Rating",
        premium: "Premium Service",
        premium_desc: "Impeccable service at the highest level",
        chefs: "Experienced Chefs",
        chefs_desc: "Masters of their craft with years of experience",
        impressions: "Unforgettable Impressions",
        impressions_desc: "Wonderful emotions and an atmosphere that stays in your memory",
        atmosphere: "Restaurant Atmosphere",
        atmosphere_desc: "Immerse yourself in the elegant atmosphere of our restaurant",
        instagram_title: "Follow us on Instagram",
        instagram_desc: "See our latest dishes, special offers and restaurant life",
        visit_instagram: "Visit Instagram",
        quick_links: "Quick Links",
        contact_us: "Contact Us",
        cart: "Cart"
    },

    zh: {
        home: "首页",
        about: "关于我们",
        menu: "菜单",
        booking: "预订",
        wedding: "婚礼大厅",
        contact: "联系我们",
        restaurant: "鳟鱼餐厅",
        description: "在苦盏市中心，品味美食、风格与氛围。",
        view_menu: "查看菜单",
        reserve: "预订餐桌",
        special: "我们的特别之处",
        elite: "优雅的氛围",
        elite_desc: "舒适时尚的环境，适合特别时刻",

        experience: "多年经验",
guests: "满意的客人",
dishes: "菜单菜品",
rating: "评分",
premium: "优质服务",
premium_desc: "提供最高水平的完美服务",
chefs: "经验丰富的厨师",
chefs_desc: "拥有多年经验的专业厨师",
impressions: "难忘的体验",
impressions_desc: "留下美好回忆的精彩情感与氛围",
atmosphere: "餐厅氛围",
atmosphere_desc: "沉浸在我们餐厅优雅的氛围中",
instagram_title: "在 Instagram 上关注我们",
instagram_desc: "查看我们的最新菜品、特别优惠和餐厅生活",
visit_instagram: "访问 Instagram",
quick_links: "快速链接",
contact_us: "联系我们",
cart: "购物车"
    },

    tj: {
        home: "Асосӣ",
        about: "Дар бораи мо",
        menu: "Меню",
        booking: "Бронкунӣ",
        wedding: "Толори тӯй",
        contact: "Тамос",
        restaurant: "Тарабхонаи Форел",
        description: "Таъму услуб ва фазои зебо дар маркази Хуҷанд.",
        view_menu: "Дидани меню",
        reserve: "Миз фармоиш додан",
        special: "Чӣ моро махсус мегардонад",
        elite: "Муҳити бошукӯҳ",
        elite_desc: "Муҳити бароҳат ва зебо барои лаҳзаҳои махсус",

        experience: "Соли таҷриба",
guests: "Меҳмонони қаноатманд",
dishes: "Таом дар меню",
rating: "Баҳо",
premium: "Хизматрасонии олӣ",
premium_desc: "Хизматрасонии бенуқсон дар сатҳи баланд",
chefs: "Ошпазони ботаҷриба",
chefs_desc: "Устодони кори худ бо таҷрибаи чандинсола",
impressions: "Таассуроти фаромӯшнашаванда",
impressions_desc: "Эҳсосоти зебо ва фазое, ки дар хотир мемонад",
atmosphere: "Фазои тарабхона",
atmosphere_desc: "Ба фазои зебои тарабхонаи мо ғарқ шавед",
instagram_title: "Моро дар Instagram пайгирӣ кунед",
instagram_desc: "Таомҳои нав, пешниҳодҳои махсус ва ҳаёти тарабхонаро тамошо кунед",
visit_instagram: "Ба Instagram гузаред",
quick_links: "Пайвандҳои зуд",
contact_us: "Бо мо тамос гиред",
cart: "Сабад"
    }
};

function changeLanguage(lang) {
    const translations = siteTranslations[lang];

    if (!translations) return;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;

        if (translations[key] !== undefined) {
            element.textContent = translations[key];
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem("language", lang);
}

document.addEventListener("DOMContentLoaded", () => {
    const savedLanguage = localStorage.getItem("language") || "ru";
    changeLanguage(savedLanguage);
});