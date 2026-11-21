const API_MENU = "https://75ea65f72e90e721.mokky.dev/menu";
const API_CART = "https://75ea65f72e90e721.mokky.dev/cart";
const categories = {
    salad: document.getElementById("salad_items"),
    soup: document.getElementById("soup_items"),
    snacks: document.getElementById("snack_items"),
    georgian: document.getElementById("georgian_items"),
    cutlets: document.getElementById("cutlet_items"),
    pasta: document.getElementById("pasta_items"),
    main: document.getElementById("main_items"),
    steak: document.getElementById("steak_items"),
    kebab: document.getElementById("kebab_items"),
    special: document.getElementById("special_items"),
    desserts: document.getElementById("desserts_items"),
     rolls: document.getElementById("rolls_items"),
     pizza: document.getElementById("pizza_items"),
    
};

const categoryNames = {
    salad: "salads",
    soup: "soups",
    snacks: "snacks",
    georgian: "georgian_cuisine",
    cutlets: "cutlets",
    pasta: "pasta",
    main: "main_dishes",
    steak: "steaks",
    kebab: "kebab",
    special:"special",
    desserts: "desserts",
    rolls: "rolls",
    pizza: "pizza"
};

let allProducts = [];
let cartData = [];

function GET_CATEGORY(category) {
    for (const key in categoryNames) {
        if (categoryNames[key] === category) {
            return key;
        }
    }
    return null;
}


async function FETCH_CART_AND_RENDER_MENU() {
    try {
        const res = await axios.get(API_CART);
        cartData = res.data;
        const count = cartData.reduce(
            (sum, item) => sum + Number(item.quantity || 1), 0
        );

        document.querySelectorAll(".cart-count").forEach(el => {
            el.textContent = count;
        });

        if (allProducts.length > 0) {
            SEARCH_MENU(searchInput ? searchInput.value : "");
        }

    } catch (error) {
        console.error("Ошибка корзины:", error);
    }
}




async function UPDATE_CART_QUANTITY(cartItemId, newQuantity) {
    try {
        if (newQuantity <= 0) {
            await axios.delete(`${API_CART}/${cartItemId}`);
        } else {
            await axios.patch(`${API_CART}/${cartItemId}`, {
                quantity: newQuantity
            });
        }
        await FETCH_CART_AND_RENDER_MENU();
    } catch (error) {
        console.error("Ошибка обновления:", error);
    }
}

async function ADD_TO_CART(product) {
    try {
        const res = await axios.get(API_CART);
        const existing = res.data.find(item => String(item.productId) === String(product.id));

        if (existing) {
            await UPDATE_CART_QUANTITY(existing.id, Number(existing.quantity || 1) + 1);
        } else {
            await axios.post(API_CART, {
                productId: product.id,
                title: product.title,
                price: Number(product.price),
                image: product.image,
                category: product.category,
                quantity: 1
            });
            await FETCH_CART_AND_RENDER_MENU();
        }
    } catch (error) {
        console.error("Ошибка добавления:", error);
    }
}



function CREATE_CARD(element, category) {
    const card = document.createElement("div");
    const isFirstMenu = category === "salad" || category === "soup";
    card.className = isFirstMenu ? "card-block" : "card-block2";

    const img = document.createElement("img");
    img.src = element.image;
    img.alt = element.title;

    const info = document.createElement("div");
    info.className = isFirstMenu ? "text_btn" : "text_btn2";

    const titlePrice = document.createElement("div");
  titlePrice.className = "title-price";

  const title = document.createElement("h3");
  title.textContent = element.title;

const price = document.createElement("p");
price.textContent = element.price + " с";
price.style.color ="#D4760C"

titlePrice.append(title, price);
info.appendChild(titlePrice);

    const cartItem = cartData.find(
        item => String(item.productId) === String(element.id)
    );

    if (cartItem) {
        const controlsDiv = document.createElement("div");
        controlsDiv.className = "cart-controls";

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "−";
        minusBtn.className = "quantity-btn minus-btn";
        minusBtn.type = "button";

        const qtySpan = document.createElement("span");
        qtySpan.textContent = cartItem.quantity;
        qtySpan.className = "quantity-number";

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.className = "quantity-btn plus-btn";
        plusBtn.type = "button";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Убрать";
        removeBtn.className = "remove-cart-btn";
        removeBtn.type = "button";
        removeBtn.style.justifyContent = "end";

        minusBtn.addEventListener("click", () => {
            UPDATE_CART_QUANTITY(
                cartItem.id,
                Number(cartItem.quantity) - 1
            );
        });

        plusBtn.addEventListener("click", () => {
            UPDATE_CART_QUANTITY(
                cartItem.id,
                Number(cartItem.quantity) + 1
            );
        });

        removeBtn.addEventListener("click", () => {
            UPDATE_CART_QUANTITY(cartItem.id, 0);
        });

        controlsDiv.append(minusBtn, qtySpan, plusBtn, removeBtn);
        info.appendChild(controlsDiv);

    } else {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "В корзину";
        button.className = isFirstMenu ? "menu_button" : "menu_button2";
        button.style.marginTop = "15px";
        button.addEventListener("click", () => {
            ADD_TO_CART(element);
        });

        info.appendChild(button);
    }

    card.append(img, info);
    return card;
}






const searchInput = document.querySelector(".input");

function SEARCH_MENU(value) {
    const searchValue = value.trim().toLowerCase();

    const filteredProducts = allProducts.filter(product =>
        String(product.title || "")
            .toLowerCase()
            .includes(searchValue)
    );

    RENDER_MENU(filteredProducts);
    Object.entries(categories).forEach(([key, container]) => {
        if (!container) return;
        const sectionBlock = container.closest(".div-icon");
        if (!sectionBlock) return;
        const hasProducts = filteredProducts.some(product =>
            GET_CATEGORY(product.category) === key
        );

        sectionBlock.style.display = hasProducts ? "" : "none";
    });
    let emptyMessage = document.querySelector(".search-empty");
    if (!emptyMessage && searchInput) {
        emptyMessage = document.createElement("p");
        emptyMessage.className = "search-empty";
        searchInput.parentElement.appendChild(emptyMessage);
    }
    if (emptyMessage) {
        emptyMessage.textContent = "Блюда не найдены";
        emptyMessage.style.display =
            searchValue !== "" && filteredProducts.length === 0
                ? "block"
                : "none";
    }
}
if (searchInput) {
    searchInput.addEventListener("input", function () {
        SEARCH_MENU(this.value);
    });
}

function RENDER_MENU(products) {
    Object.values(categories).forEach(container => {
        if (container) container.innerHTML = "";
    });
    products.forEach(element => {
        const category = GET_CATEGORY(element.category);
        if (!category || !categories[category]) return;
        categories[category].appendChild(CREATE_CARD(element, category));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("burgerBtn");
    const menu = document.getElementById("menu");
    const overlay = document.getElementById("overlay");
    if (burger && menu && overlay) {
        function toggleMenu() {
            burger.classList.toggle("active");
            menu.classList.toggle("active");
            overlay.classList.toggle("active");
        }
        burger.addEventListener("click", toggleMenu);
        overlay.addEventListener("click", toggleMenu);
    }
});


async function GET_MENU() {
    try {
        const response = await axios.get(API_MENU);
        allProducts = response.data;
        await FETCH_CART_AND_RENDER_MENU();
    } catch (error) {
        console.error("Ошибка загрузки меню:", error);
    }
}

GET_MENU();