
"use strict";

/*
  GS PRODUCTS - STORE SETTINGS

  Replace the WhatsApp number with your business number.
  Use country code + number, without +, spaces or dashes.
  Example format for India: 919876543210
*/
const STORE = {
  name: "GS Products",
  whatsappNumber: "918778595048"
};

/*
  DEMO PRODUCTS
  Change names, categories, prices and image URLs to your real stock.
  These prices are examples, not verified selling prices.
*/
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    description: "Wireless audio for everyday use.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 2,
    name: "Smart Watch",
    category: "Electronics",
    price: 2199,
    description: "A modern accessory for daily life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    category: "Electronics",
    price: 999,
    description: "Compact sound for your favourite music.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 4,
    name: "Desk Lamp",
    category: "Home",
    price: 799,
    description: "Simple lighting for your workspace.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug",
    category: "Home",
    price: 349,
    description: "A practical addition to your kitchen.",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 6,
    name: "Everyday Backpack",
    category: "Accessories",
    price: 1199,
    description: "A versatile bag for daily essentials.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 7,
    name: "Classic Sunglasses",
    category: "Fashion",
    price: 599,
    description: "A classic style for everyday wear.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 8,
    name: "Sports Shoes",
    category: "Fashion",
    price: 1799,
    description: "Casual footwear for an active day.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=650&q=80"
  }
];

// Website elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const resultsText = document.getElementById("resultsText");
const emptyMessage = document.getElementById("emptyMessage");

const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

let selectedCategory = "All";
let cart = [];
let toastTimer;

// Format prices in Indian rupees
function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

// Show a small notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Render products based on search and category
function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const searchableText =
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase();

    return matchesCategory && searchableText.includes(query);
  });

  productGrid.replaceChildren();
  resultsText.textContent = `${filtered.length} product(s) found`;
  emptyMessage.hidden = filtered.length !== 0;

  filtered.forEach(product => {
    const article = document.createElement("article");
    article.className = "product-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";
    image.onerror = () => {
      image.style.display = "none";
      imageWrap.style.background = "#e8e3d8";
    };

    const badge = document.createElement("span");
    badge.className = "product-category";
    badge.textContent = product.category;

    imageWrap.append(image, badge);

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.type = "button";
    addButton.textContent = "＋ Add to Cart";
    addButton.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, addButton);
    info.append(name, description, bottom);
    article.append(imageWrap, info);
    productGrid.append(article);
  });
}

// Category filter
categoryList.addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;

  categoryList.querySelectorAll(".category").forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderProducts();
});

// Product search
searchInput.addEventListener("input", renderProducts);

// Add product to cart
function addToCart(productId) {
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast("Product added to your cart!");
}

// Update quantity or remove an item
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  saveCart();
  renderCart();
}

// Save cart in this browser
function saveCart() {
  try {
    localStorage.setItem("gsProductsCart", JSON.stringify(cart));
  } catch {
    // The cart still works for this page if storage is unavailable.
  }
}

// Load saved cart
function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("gsProductsCart") || "[]"
    );

    if (Array.isArray(saved)) {
      cart = saved
        .filter(item =>
          products.some(product => product.id === item.id) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          item.quantity <= 99
        )
        .map(item => ({ id: item.id, quantity: item.quantity }));
    }
  } catch {
    cart = [];
  }
}

// Render cart contents
function renderCart() {
  cartItems.replaceChildren();

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  cartCount.textContent = totalQuantity;
  cartTotal.textContent = formatPrice(subtotal);

  if (cart.length === 0) {
    const message = document.createElement("p");
    message.className = "cart-empty";
    message.textContent = "Your cart is empty. Explore our products!";
    cartItems.append(message);
    return;
  }

  cart.forEach(item => {
    const product = products.find(product => product.id === item.id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;

    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = formatPrice(product.price * item.quantity);

    const controls = document.createElement("div");
    controls.className = "quantity-control";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Decrease ${product.name} quantity`);
    minus.addEventListener("click", () => updateQuantity(product.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Increase ${product.name} quantity`);
    plus.addEventListener("click", () => {
      if (item.quantity >= 99) {
        showToast("Maximum quantity is 99.");
        return;
      }
      updateQuantity(product.id, 1);
    });

    controls.append(minus, quantity, plus);
    details.append(name, price, controls);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-item";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart = cart.filter(cartItem => cartItem.id !== product.id);
      saveCart();
      renderCart();
    });

    const actions = document.createElement("div");
    actions.append(remove);
    row.append(image, details, actions);
    cartItems.append(row);
  });
}

// Open and close cart
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartDrawer.removeAttribute("inert");
  cartOverlay.hidden = false;
  document.body.classList.add("cart-open");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("inert", "");
  cartOverlay.hidden = true;
  document.body.classList.remove("cart-open");
  document.getElementById("openCart").focus();
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartDrawer.classList.contains("open")) {
    closeCart();
  }
});

// Clear the cart
document.getElementById("clearCart").addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  showToast("Cart cleared.");
});

// Create WhatsApp order enquiry
function createWhatsAppMessage() {
  if (!/^[1-9]\d{7,14}$/.test(STORE.whatsappNumber)) {
    showToast("Please configure your business WhatsApp number in script.js.");
    return;
  }

  if (cart.length === 0) {
    showToast("Please add products to your cart first.");
    return;
  }

  const lines = cart.map(item => {
    const product = products.find(product => product.id === item.id);
    return `${product.name} x ${item.quantity} = ${
      formatPrice(product.price * item.quantity)
    }`;
  });

  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const message = [
    `Hello ${STORE.name}!`,
    "I would like to enquire about these products:",
    "",
    ...lines,
    "",
    `Estimated subtotal: ${formatPrice(subtotal)}`,
    "",
    "Please confirm availability, delivery charges and final price."
  ].join("\n");

  const url = `https://wa.me/${STORE.whatsappNumber}?text=${
    encodeURIComponent(message)
  }`;

  window.open(url, "_blank", "noopener,noreferrer");
}

document.getElementById("checkoutButton")
  .addEventListener("click", createWhatsAppMessage);

// Contact button
document.getElementById("contactButton").addEventListener("click", event => {
  if (!/^[1-9]\d{7,14}$/.test(STORE.whatsappNumber)) {
    event.preventDefault();
    showToast("Add your WhatsApp number in script.js first.");
    return;
  }

  event.currentTarget.href =
    `https://wa.me/${STORE.whatsappNumber}?text=${
      encodeURIComponent("Hello GS Products! I would like to know more about your products.")
    }`;
});

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Start website
loadCart();
renderProducts();
renderCart();
