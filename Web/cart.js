const API_CART = "https://75ea65f72e90e721.mokky.dev/cart";
const API_ORDERS = "https://75ea65f72e90e721.mokky.dev/orders";

const cartItemsContainer = document.querySelector(".cart-items");
const cartCountElements = document.querySelectorAll(".cart-count");

let cartData = [];
let successAudioContext = null;

async function GET_CART() {
    try {
        const response = await axios.get(API_CART);
        cartData = response.data;
        RENDER_CART(cartData);

        const count = cartData.reduce(
            (sum, item) => sum + Number(item.quantity || 1),
            0
        );

        cartCountElements.forEach(el => {
            el.textContent = count;
        });

    } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
    }
}

async function CHANGE_QTY(id, newQty) {
    try {
        if (newQty <= 0) {
            await axios.delete(`${API_CART}/${id}`);
        } else {
            await axios.patch(`${API_CART}/${id}`, {
                quantity: newQty
            });
        }

        await GET_CART();
    } catch (error) {
        console.error("Ошибка количества:", error);
    }
}

async function REMOVE_ITEM(id) {
    try {
        await axios.delete(`${API_CART}/${id}`);
        await GET_CART();
    } catch (error) {
        console.error("Ошибка удаления:", error);
    }
}

function CREATE_ORDER_MODAL() {
    if (document.getElementById("orderModal")) return;
    const modal = document.createElement("div");

    modal.id = "orderModal";
    modal.className = "order-modal";
    modal.innerHTML = `
        <div class="order-modal-content">

            <button type="button" class="modal-close" id="closeModal">
                &times;
            </button>

            <div class="modal-header">
                <div class="modal-logo">FOREL RESTAURANT</div>

                <h2>Оформление заказа</h2>

                <p>
                    Заполните данные, чтобы мы могли подготовить ваш заказ
                </p>
            </div>

            <div class="modal-progress">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <form id="orderForm">

             

                <div class="modal-section">

                    <div class="modal-section-title">
                        <span class="section-number">01</span>

                        <div>
                            <h3>Данные клиента</h3>
                            <p>Как к вам обращаться?</p>
                        </div>
                    </div>

                    <label for="customerName">Ваше имя *</label>

                    <input
                        type="text"
                        id="customerName"
                        placeholder="Введите ваше имя"
                        required
                    >

                    <label for="customerPhone">Номер телефона *</label>

                    <input
                        type="tel"
                        id="customerPhone"
                        value="+992"
                        maxlength="13"
                        minlength="13"
                        pattern="\\+992[0-9]{9}"
                        placeholder="+992 XX XXX XX XX"
                        required
                    >

                </div>

               

                <div class="modal-section">

                    <div class="modal-section-title">
                        <span class="section-number">02</span>

                        <div>
                            <h3>Время получения</h3>
                            <p>Когда подготовить ваш заказ?</p>
                        </div>
                    </div>

                    <label for="orderDate">Дата и время *</label>

                    <input
                        type="datetime-local"
                        id="orderDate"
                        required
                    >

                </div>

             

                <div class="modal-section">

                    <div class="modal-section-title">
                        <span class="section-number">03</span>

                        <div>
                            <h3>Получение заказа</h3>
                            <p>Выберите удобный способ</p>
                        </div>
                    </div>

                    <label for="deliveryMethod">
                        Способ получения *
                    </label>

                    <select id="deliveryMethod" required>
                        <option value="delivery">Доставка — 20 TJS</option>
                        <option value="pickup">Самовывоз — бесплатно</option>
                    </select>

                    <div id="addressBlock">

                        <label for="deliveryAddress">
                            Адрес доставки *
                        </label>

                        <textarea
                            id="deliveryAddress"
                            placeholder="Улица, дом, квартира, ориентир"
                            rows="3"
                        ></textarea>

                    </div>

                </div>

        

                <div class="modal-section">

                    <div class="modal-section-title">
                        <span class="section-number">04</span>

                        <div>
                            <h3>Способ оплаты</h3>
                            <p>Выберите удобный вариант</p>
                        </div>
                    </div>

                    <label for="paymentMethod">
                        Как будете оплачивать? *
                    </label>

                    <select id="paymentMethod" required>
                        <option value="">Выберите способ оплаты</option>
                        <option value="Наличные">Наличные</option>
                        <option value="Банковская карта">Банковская карта</option>
                    </select>

                </div>

              

                <div class="modal-section">

                    <div class="modal-section-title">
                        <span class="section-number">05</span>

                        <div>
                            <h3>Дополнительно</h3>
                            <p>Есть особые пожелания?</p>
                        </div>
                    </div>

                    <label for="orderComment">
                        Комментарий к заказу
                    </label>

                    <textarea
                        id="orderComment"
                        rows="3"
                        placeholder="Ваши пожелания..."
                    ></textarea>

                </div>

               
                <div class="modal-total-wrapper">

                    <div class="modal-total-heading">
                        <span>ВАШ ЗАКАЗ</span>
                        <span class="total-status">К оплате</span>
                    </div>

                    <div id="modalTotal"></div>

                </div>

                <button
                    type="submit"
                    class="golden_button10 submit-order"
                >
                    <span>Подтвердить заказ</span>
                    <span class="submit-arrow">→</span>
                </button>

                <p class="modal-footer-text">
                    Спасибо, что выбираете Forel Restaurant!
                </p>

            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeModal").onclick =
        CLOSE_ORDER_MODAL;

    document.getElementById("deliveryMethod").onchange =
        UPDATE_DELIVERY;

    document.getElementById("orderForm").onsubmit =
        SUBMIT_ORDER;

    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            CLOSE_ORDER_MODAL();
        }
    });
}


function OPEN_ORDER_MODAL() {
    if (cartData.length === 0) {
        alert("Корзина пуста!");
        return;
    }

    CREATE_ORDER_MODAL();
    const modal = document.getElementById("orderModal");
    const now = new Date();

    const localNow = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().slice(0, 16);

    const dateInput = document.getElementById("orderDate");
    dateInput.min = localNow;
    dateInput.value = localNow;

    UPDATE_DELIVERY();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function CLOSE_ORDER_MODAL() {
    const modal = document.getElementById("orderModal");
    if (modal) {
        modal.classList.remove("active");
    }
    document.body.style.overflow = "";
}

function GET_DELIVERY_COST() {
    const method = document.getElementById("deliveryMethod");

    if (!method || method.value === "pickup") {
        return 0;
    }
    return 20;
}

function UPDATE_DELIVERY() {
    const method = document.getElementById("deliveryMethod");
    const addressBlock = document.getElementById("addressBlock");
    const address = document.getElementById("deliveryAddress");

    if (method.value === "pickup") {
        addressBlock.style.display = "none";
        address.required = false;
        address.value = "";

    } else {
        addressBlock.style.display = "block";
        address.required = true;
    }
    UPDATE_MODAL_TOTAL();
}

function UPDATE_MODAL_TOTAL() {
    const totalElement = document.getElementById("modalTotal");

    if (!totalElement) return;
    const subtotal = cartData.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity || 1),
        0
    );

    const delivery = GET_DELIVERY_COST();
    const total = subtotal + delivery;

    totalElement.innerHTML = `
        <div class="order-summary modal-order-summary">

            <div class="summary-row">
                <span>Сумма</span>
                <h3>${subtotal} TJS</h3>
            </div>

            <div class="summary-row">
                <span>Доставка</span>
                <h3>${delivery} TJS</h3>
            </div>

            <div class="summary-row final-total">
                <span>Итого</span>
                <h2>${total} TJS</h2>
            </div>

        </div>
    `;
}

function PREPARE_SUCCESS_AUDIO() {
    try {
        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) return;
        if (!successAudioContext) {
            successAudioContext = new AudioContextClass();
        }
        if (successAudioContext.state === "suspended") {
            successAudioContext.resume();
        }

    } catch (error) {
        console.log("Ошибка аудио:", error);
    }
}

const successAudio = new Audio("./img/apple-pay.mp3");
successAudio.volume = 1;
successAudio.preload = "auto";

function PLAY_SUCCESS_SOUND() {
    successAudio.pause();
    successAudio.currentTime = 0;

    successAudio.play().catch(error => {
        console.error("Ошибка воспроизведения:", error);
    });
}

function SHOW_ORDER_SUCCESS(orderId, total) {

    document.getElementById("successScreen")?.remove();
    const screen = document.createElement("div");
    screen.id = "successScreen";
    screen.style.cssText = `
        position:fixed;
        inset:0;
        z-index:100000;

        background:#F8F5EC;

        display:flex;
        justify-content:center;
        align-items:center;

        padding:20px;

        opacity:0;
        transition:opacity 0.5s ease;

        color:#26382D;
        font-family:inherit;
    `;

    screen.innerHTML = `

        <div class="success-content" style="
            width:100%;
            max-width:420px;
            text-align:center;
            transform:translateY(25px);
            transition:transform 0.5s ease;
        ">

            <!-- ANIMATED CHECK -->

            <div id="successCircle" style="
                width:110px;
                height:110px;
                border-radius:50%;

                background:linear-gradient(
                    145deg,
                    #42D77D,
                    #159447
                );

                display:flex;
                justify-content:center;
                align-items:center;

                margin:0 auto 30px;

                box-shadow:
                    0 0 0 10px rgba(42,190,100,0.10),
                    0 0 40px rgba(42,190,100,0.25);
            ">

                <svg
                    viewBox="0 0 100 100"
                    style="width:75px;height:75px;"
                >
                    <path
                        d="M27 52 L43 68 L75 34"
                        fill="none"
                        stroke="#FFFFFF"
                        stroke-width="7"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="check-path"
                    />
                </svg>

            </div>

            <h1 style="
                color:#244A32;
                font-size:27px;
                margin-bottom:12px;
            ">
                Заказ успешно оформлен!
            </h1>

            <p style="
                color:#77736A;
                line-height:1.6;
            ">
                Спасибо, что выбрали Forel Restaurant!
                Ваш заказ принят.
            </p>

            <!-- ORDER DETAILS -->

            <div style="
                margin:28px 0;
                padding:22px;

                border:1px solid #E8DCC4;
                border-radius:16px;

                background:#FFFFFF;

                box-shadow:0 8px 25px rgba(0,0,0,0.04);
            ">

                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin:12px 0;
                    gap:10px;
                ">
                    <span style="color:#888;">Номер заказа</span>
                    <strong>#${orderId ?? "—"}</strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin:12px 0;
                    gap:10px;
                ">
                    <span style="color:#888;">Общая сумма</span>
                    <strong style="color:#A77A2D;">
                        ${total} TJS
                    </strong>
                </div>

                <div style="
                    display:flex;
                    justify-content:space-between;
                    margin:12px 0;
                    gap:10px;
                ">
                    <span style="color:#888;">Статус</span>

                    <strong style="color:#299B59;">
                        ✓ Новый заказ
                    </strong>
                </div>

            </div>

            <!-- BUTTON -->

            <button id="successMenuButton" style="
                width:100%;
                padding:16px;

                background:linear-gradient(
                    90deg,
                    #F5C77A,
                    #FFE8B5,
                    #C99B54
                );

                color:#FFFFFF;

                border:none;
                border-radius:10px;

                font-size:16px;
                font-weight:700;

                cursor:pointer;

                box-shadow:0 8px 22px rgba(173,132,70,0.2);

                transition:0.3s ease;
            ">
                Вернуться в меню →
            </button>

            <p style="
                color:#A77A2D;
                letter-spacing:4px;
                margin-top:25px;
                font-size:13px;
                font-weight:700;
            ">
                FOREL RESTAURANT
            </p>

        </div>
    `;

    document.body.appendChild(screen);
    document.body.style.overflow = "hidden";

                                        //  ✨✨✨✨✨✨✨

    requestAnimationFrame(() => {
        screen.style.opacity = "1";
        screen.querySelector(".success-content").style.transform =
            "translateY(0)";
        const circle = document.getElementById("successCircle");
        circle.animate(
            [
                { transform: "scale(0)", opacity: 0 },
                { transform: "scale(1.15)", opacity: 1 },
                { transform: "scale(1)", opacity: 1 }
            ],
            {
                duration: 650,
                easing: "cubic-bezier(.17,.67,.35,1.5)",
                fill: "forwards"
            }
        );

        const check = screen.querySelector(".check-path");
        check.style.strokeDasharray = "100";
        check.style.strokeDashoffset = "100";
        check.animate(
            [
                { strokeDashoffset: 100 },
                { strokeDashoffset: 0 }
            ],
            {
                duration: 550,
                delay: 400,
                easing: "ease",
                fill: "forwards"
            }
        );

    });
    PLAY_SUCCESS_SOUND();

    const menuButton = document.getElementById("successMenuButton");
    menuButton.onmouseenter = () => {
        menuButton.style.transform = "translateY(-3px)";
        menuButton.style.boxShadow =
            "0 12px 28px rgba(173,132,70,0.3)";
    };

    menuButton.onmouseleave = () => {
        menuButton.style.transform = "translateY(0)";
        menuButton.style.boxShadow =
            "0 8px 22px rgba(173,132,70,0.2)";
    };

    menuButton.onclick = () => {
        window.location.href = "./menu.html";
    };
}
async function SUBMIT_ORDER(e) {

    e.preventDefault();
    const form = document.getElementById("orderForm");
    if (!form.reportValidity()) return;

    if (cartData.length === 0) {
        alert("Корзина пуста!");
        return;
    }
    PREPARE_SUCCESS_AUDIO();

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const date = document.getElementById("orderDate").value;

    const deliveryMethod =
        document.getElementById("deliveryMethod").value;
    const address =
        document.getElementById("deliveryAddress").value.trim();
    const payment =
        document.getElementById("paymentMethod").value;

    const comment =
        document.getElementById("orderComment").value.trim();
    if (!name || !phone || !date || !payment) {
        alert("Заполните обязательные поля!");
        return;
    }

    if (!/^\+992[0-9]{9}$/.test(phone)) {
        alert("Введите правильный номер телефона: +992 и 9 цифр");
        return;
    }

    if (new Date(date).getTime() <= Date.now()) {
        alert("Выберите будущее время получения заказа!");
        return;
    }

    if (deliveryMethod === "delivery" && !address) {
        alert("Введите адрес доставки!");
        return;
    }

    const subtotal = cartData.reduce(
        (sum, item) =>
            sum + Number(item.price) * Number(item.quantity || 1),
        0
    );

    const deliveryCost = deliveryMethod === "delivery" ? 20 : 0;
    const order = {

        customerName: name,
        customerPhone: phone,

        orderDate: new Date(date).toISOString(),
        deliveryMethod: deliveryMethod,
        deliveryAddress:
            deliveryMethod === "delivery"
                ? address
                : "Самовывоз",

        paymentMethod: payment,
        comment: comment,
        products: cartData.map(item => ({

            productId: item.productId ?? item.id,
            title: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity || 1),
            image: item.image
        })),

        subtotal: subtotal,
        delivery: deliveryCost,
        total: subtotal + deliveryCost,

        status: "Новый",
        date: new Date().toISOString()
    };

    const submitButton = form.querySelector(".submit-order");
    submitButton.disabled = true;
    submitButton.textContent = "Оформляем заказ...";

    try {
        const response = await axios.post(API_ORDERS, order);
        const savedOrder = response.data;
        await Promise.all(
            cartData.map(item =>
                axios.delete(`${API_CART}/${item.id}`)
            )
        );

        CLOSE_ORDER_MODAL();
        await GET_CART();
        SHOW_ORDER_SUCCESS(
            savedOrder.id,
            subtotal + deliveryCost
        );
    } catch (error) {
        console.error("Ошибка оформления заказа:", error);

        alert(
            "Не удалось полностью оформить заказ. Проверьте соединение и состояние корзины."
        );
        submitButton.disabled = false;
        submitButton.textContent = "Подтвердить заказ";
    }
}

function CREATE_CART_ITEM(item) {

    const qty = Number(item.quantity || 1);
    const article = document.createElement("article");
    article.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;

    const info = document.createElement("div");
    info.className = "cart-item-info";
    const title = document.createElement("h3");

    title.textContent = qty > 1
        ? `${item.title} × ${qty}`
        : item.title;

    const price = document.createElement("p");
    price.textContent = Number(item.price) + " TJS за шт.";
    const total = document.createElement("p");

    total.textContent =
        "Итого: " + Number(item.price) * qty + " TJS";
    const controls = document.createElement("div");
    controls.className = "cart-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.onclick = () => CHANGE_QTY(item.id, qty - 1);

    const quantity = document.createElement("span");
    quantity.textContent = qty;
    const plus = document.createElement("button");

    plus.textContent = "+";
    plus.onclick = () => CHANGE_QTY(item.id, qty + 1);
    controls.append(minus, quantity, plus);

    info.append(title, price, total, controls);
    const remove = document.createElement("button");
    remove.className = "remove-cart";

    remove.innerHTML =
        '<i class="fa-solid fa-trash-can"></i>';
    remove.onclick = () => REMOVE_ITEM(item.id);
    article.append(img, info, remove);

    return article;
}

function RENDER_CART(data) {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    if (data.length === 0) {

        cartItemsContainer.innerHTML = `
            <div style="text-align:center;padding:30px;">

                <h3>Корзина пуста</h3>

                <p style="padding-bottom:30px;">
                    Добавьте блюда из нашего меню!
                </p>

                <a href="./menu.html" class="golden_button10">
                    Продолжить покупки
                </a>

            </div>
        `;
        return;
    }

    let subtotal = 0;
    data.forEach(item => {
        subtotal +=
            Number(item.price) * Number(item.quantity || 1);
        cartItemsContainer.appendChild(
            CREATE_CART_ITEM(item)
        );

    });

    const deliveryCost = 20;
    const totalCost = subtotal + deliveryCost;

    const summary = document.createElement("div");
    summary.className = "order-summary";
    summary.innerHTML = `

        <h1 style="color:goldenrod;">
            Сводка заказа
        </h1>

        <div style="padding-top:40px;" class="summary-row">

            <span style="color:#888;">Сумма</span>

            <h3>${subtotal} TJS</h3>

        </div>

        <div class="summary-row">

            <span style="color:red;">Доставка</span>

            <h3>${deliveryCost} TJS</h3>

        </div>

        <p style="color:red;" class="delivery-info">
            Доставка по городу — 20 TJS. Самовывоз — бесплатно.
        </p>

        <div class="summary-row final-total">

            <span>Итого</span>

            <h2>${totalCost} TJS</h2>

        </div>

        <button class="golden_button10 checkout-btn">
            Оформить заказ
        </button>

    `;

    cartItemsContainer.appendChild(summary);
    summary.querySelector(".checkout-btn").onclick =
        OPEN_ORDER_MODAL;
}

GET_CART();
