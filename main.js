const products = [
  {
    id: "snk-1",
    name: "Retro Runner",
    price: 120,
    category: "sneakers",
    description: "Suede overlays, breathable mesh, everyday traction.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    badge: "New",
  },
  {
    id: "snk-2",
    name: "Aero Knit",
    price: 135,
    category: "sneakers",
    description: "Featherlight knit upper with responsive foam midsole.",
    image:
      "https://images.unsplash.com/photo-1615016254516-382f5c81e108?auto=format&fit=crop&w=800&q=80",
    badge: "Light",
  },
  {
    id: "snk-3",
    name: "Streetform",
    price: 110,
    category: "sneakers",
    description: "Minimal silhouette with city-ready tread and support.",
    image:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
    badge: "Daily",
  },
  {
    id: "jkt-1",
    name: "Featherlite Parka",
    price: 180,
    category: "jackets",
    description: "Water-repellent shell, recycled fill, warm without bulk.",
    image:
      "https://static.vecteezy.com/system/resources/previews/071/735/416/non_2x/a-light-grey-down-jacket-hanging-on-a-hanger-free-photo.jpg",
    badge: "Warm",
  },
  {
    id: "jkt-2",
    name: "Crescent Bomber",
    price: 145,
    category: "jackets",
    description: "Matte nylon bomber with rib trims and hidden pocketing.",
    image:
      "https://static.vecteezy.com/system/resources/previews/047/362/139/non_2x/a-bomber-black-jacket-with-white-stripe-to-mockup-design-free-photo.jpg",
    badge: "Popular",
  },
  {
    id: "jkt-3",
    name: "Layer Shell",
    price: 160,
    category: "jackets",
    description: "Lightweight wind shell, packable hood, storm zip.",
    image:
      "https://camperscorner.com.sg/cdn/shop/files/GoldwinAiryShellPackableWindJacket_Unisex_WolfGreycopy.png?v=1749042949&width=713",
    badge: "Packable",
  },
  {
    id: "frg-1",
    name: "Midnight Oud",
    price: 95,
    category: "fragrances",
    description: "Smoky oud, amber resin, dark woods for evening wear.",
    image:
      "https://images.unsplash.com/photo-1716857591457-7d7fa45199c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Signature",
  },
  {
    id: "frg-2",
    name: "Citrus Grove",
    price: 78,
    category: "fragrances",
    description: "Blood orange, neroli bloom, clean white musk trail.",
    image:
      "https://images.unsplash.com/photo-1617661338085-d1ec6a89a6d8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Fresh",
  },
  {
    id: "frg-3",
    name: "Coast Drift",
    price: 88,
    category: "fragrances",
    description: "Sea salt, driftwood, and a hint of pine for crisp clarity.",
    image:
      "https://images.unsplash.com/photo-1591375372226-3531cf2eb6d3?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    badge: "Clean",
  },
];

const cartKey = "thrift-street-cart";

const getCart = () => {
  const raw = localStorage.getItem(cartKey);
  return raw ? JSON.parse(raw) : [];
};

const saveCart = (items) => {
  localStorage.setItem(cartKey, JSON.stringify(items));
  updateCartBadges(items);
};

const updateCartBadges = (items = getCart()) => {
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count > 0 ? count : "0";
  });
};

const addToCart = (id) => {
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) {
    item.qty += 1;
  } else {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    cart.push({ id, qty: 1 });
  }
  saveCart(cart);
  flash("Added to cart");
};

const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
};

const updateQty = (id, delta) => {
  const cart = getCart()
    .map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    )
    .filter((item) => item.qty > 0);
  saveCart(cart);
  renderCart();
};

const renderProducts = () => {
  document.querySelectorAll("[data-products]").forEach((container) => {
    const target = container.dataset.products;
    const filtered =
      target === "featured"
        ? products.slice(0, 6)
        : products.filter((p) => p.category === target);
    container.innerHTML = filtered
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-media">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
            </div>
            <div class="pill">${product.badge}</div>
            <div class="product-meta">
              <span class="name">${product.name}</span>
              <span class="price">$${product.price}</span>
            </div>
            <p class="muted">${product.description}</p>
            <button class="btn primary block" data-add="${product.id}">Add to cart</button>
          </article>
        `
      )
      .join("");
  });
};

const renderCart = () => {
  const list = document.querySelector("[data-cart-list]");
  if (!list) return;

  const cart = getCart();
  if (cart.length === 0) {
    list.innerHTML = `<div class="empty">Your cart is empty. Add a few favorites.</div>`;
    const summary = document.querySelector("[data-cart-summary]");
    if (summary)
      summary.innerHTML = `<div class="summary-row total"><span>Total</span><span>$0</span></div>`;
    return;
  }

  list.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <div>
            <div class="product-meta">
              <span class="name">${product.name}</span>
              <span class="price">$${product.price}</span>
            </div>
            <p class="muted">${product.description}</p>
          </div>
          <div class="cart-actions">
            <button class="qty-btn" data-qty="${product.id}" data-delta="-1">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-qty="${product.id}" data-delta="1">+</button>
            <button class="btn ghost danger" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");

  const subtotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);
  const shipping = subtotal > 0 ? 12 : 0;
  const total = subtotal + shipping;

  const summary = document.querySelector("[data-cart-summary]");
  if (summary) {
    summary.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(
        2
      )}</span></div>
      <div class="summary-row"><span>Shipping</span><span>$${shipping.toFixed(
        2
      )}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(
        2
      )}</span></div>
      <button class="btn primary block" style="margin-top:12px;">Checkout</button>
    `;
  }
};

const flash = (message) => {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
};

const hydrateActiveNav = () => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
};

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  hydrateActiveNav();
  updateCartBadges();

  document.body.addEventListener("click", (event) => {
    const addBtn = event.target.closest("[data-add]");
    if (addBtn) addToCart(addBtn.dataset.add);

    const removeBtn = event.target.closest("[data-remove]");
    if (removeBtn) removeFromCart(removeBtn.dataset.remove);

    const qtyBtn = event.target.closest("[data-qty]");
    if (qtyBtn)
      updateQty(qtyBtn.dataset.qty, Number(qtyBtn.dataset.delta || 0));
  });
});

/* Toast styling */
const style = document.createElement("style");
style.innerHTML = `
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 16px;
    background: rgba(12, 14, 22, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: white;
    border-radius: 12px;
    opacity: 0;
    transform: translateY(12px);
    transition: 0.25s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    z-index: 999;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);
