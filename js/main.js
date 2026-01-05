const PRODUCTS = [
  {
    id: "classic-black",
    name: "Classic Black Cotton Socks",
    price: 7.9,
    description: "Everyday comfort. Soft cotton blend, breathable and durable.",
    sizes: ["36–40", "41–46"],
    image: "assets/images/classic-black.jpg",
    alt: "Pair of classic black cotton socks on a clean background",
    mediaCredit: {
      title: "Classic black socks photo",
      author: "NIKHILS",
      sourceUrl: "https://unsplash.com/photos/a-pair-of-green-socks-laying-on-top-of-a-white-surface-8Al2ylhlCYk",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      attributionRequired: false
    }
  },
  {
    id: "vienna-pattern",
    name: "Plain beiege",
    price: 9.9,
    description: " Essential warderobe staple. Simple and cozy",
    sizes: ["36–40", "41–46"],
    image: "assets/images/vienna-pattern.jpg",
    alt: "Patterned socks photographed from above",
    mediaCredit: {
      title: "Pattern socks photo",
      author: "Sam Moghadam",
      sourceUrl: "https://unsplash.com/photos/person-wearing-black-and-gray-sock-Y0lUBKt-AZI",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      attributionRequired: false
    }
  },
  {
    id: "eco-bamboo",
    name: "Eco Bamboo Socks",
    price: 10.9,
    description: "Ultra-soft bamboo fiber with sustainable packaging.",
    sizes: ["36–40", "41–46"],
    image: "assets/images/eco-bamboo.jpg",
    alt: "Eco bamboo socks with natural textile styling",
    mediaCredit: {
      title: "Eco socks photo",
      author: "Vincent Branciforti",
      sourceUrl: "https://unsplash.com/photos/white-red-and-black-checked-socks-mGh2rjPgUyA",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      attributionRequired: false
    }
  },
  {
    id: "winter-wool",
    name: "Winter Wool Blend Socks",
    price: 12.9,
    description: "Warm wool blend for cold days. Comfy, thick and cozy.",
    sizes: ["36–40", "41–46"],
    image: "assets/images/winter-wool.jpg",
    alt: "Warm wool socks folded on a wooden surface",
    mediaCredit: {
      title: "Wool socks photo",
      author: "Nynne Schrøder",
      sourceUrl: "https://unsplash.com/photos/gray-sock-on-white-textile-axt96zsVXL8",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      attributionRequired: false
    }
  },
  {
    id: "sport-grip",
    name: "Sports Grip Socks",
    price: 11.9,
    description: "Anti-slip grip for training and gym sessions.",
    sizes: ["36–40", "41–46"],
    image: "assets/images/sport-grip.jpg",
    alt: "Sports socks shown in a fitness context",
    mediaCredit: {
      title: "Sports socks photo",
      author: "Ekaterina Brycheva",
      sourceUrl: "https://unsplash.com/photos/person-wearing-white-nike-sock-APkKDd_9jic",
      licenseName: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
      attributionRequired: false
    }
  },
  {
    id: "color-pop",
    name: "Color Pop Crew Socks",
    price: 8.9,
    description: "Bright colors, clean design",
    sizes: ["36–40", "41–46"],
    image: "assets/images/color-pop.jpg",
    alt: "Colorful crew socks on a simple background",
    mediaCredit: {
      title: "Colorful socks photo",
      author: "Thái An",
      sourceUrl: "https://unsplash.com/photos/white-red-and-blue-socks-zOFQ8v3YBBU",
      licenseName: "Pexels License",
      licenseUrl: "https://www.pexels.com/license/",
      attributionRequired: false
    }
  }
];



// Make PRODUCTS accessible for Media Credits page
window.PRODUCTS = PRODUCTS;

// ==============================
// Helpers
// ==============================

function formatEUR(value) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function getCart() {
  const raw = localStorage.getItem("sockora_cart");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("sockora_cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.querySelector("[data-cart-count]");
  if (el) el.textContent = String(count);
}

function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const cart = getCart();
  const existing = cart.find(i => i.productId === productId && i.size === size);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ productId, size, qty: 1 });
  }

  saveCart(cart);
}

function removeFromCart(productId, size) {
  const cart = getCart().filter(i => !(i.productId === productId && i.size === size));
  saveCart(cart);
}

function changeQty(productId, size, delta) {
  const cart = getCart();
  const item = cart.find(i => i.productId === productId && i.size === size);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId, size);
    return;
  }

  saveCart(cart);
}

function computeCartTotals(cart) {
  const items = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.productId);
    if (!product) return null;

    const line = product.price * item.qty;
    return { ...item, product, line };
  }).filter(Boolean);

  const subtotal = items.reduce((sum, it) => sum + it.line, 0);
  const shipping = subtotal >= 35 ? 0 : (items.length ? 4.9 : 0);
  const total = subtotal + shipping;

  return { items, subtotal, shipping, total };
}

// ==============================
// Home: Featured products
// ==============================

function renderFeaturedProducts() {
  const el = document.querySelector("[data-featured]");
  if (!el) return;

  const featured = PRODUCTS.slice(0, 3);
  el.innerHTML = featured.map(p => `
    <article class="card">
      <img class="product-img" src="${p.image}" alt="${p.alt}">
      <h3>${p.name}</h3>
      <p class="muted">${p.description}</p>
      <div class="card-footer">
        <span class="price">${formatEUR(p.price)}</span>
        <a class="btn btn-primary" href="shop.html#${p.id}">View</a>
      </div>
    </article>
  `).join("");
}

// ==============================
// Shop: Products grid
// ==============================

function renderShopProducts() {
  const el = document.querySelector("[data-products]");
  if (!el) return;

  el.innerHTML = PRODUCTS.map(p => `
    <article class="card" id="${p.id}">
      <img class="product-img" src="${p.image}" alt="${p.alt}">
      <h3>${p.name}</h3>
      <p class="muted">${p.description}</p>

      <div class="card-footer">
        <div>
          <div class="price">${formatEUR(p.price)}</div>
          <div class="small">Free shipping from €35</div>
        </div>

        <div>
          <label class="small" for="size-${p.id}">Size</label><br />
          <select id="size-${p.id}" aria-label="Select size for ${p.name}">
            ${p.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
          </select>
        </div>

        <button class="btn btn-primary" data-add-to-cart="${p.id}">
          Add to cart
        </button>
      </div>
    </article>
  `).join("");

  el.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const productId = btn.getAttribute("data-add-to-cart");
      const select = document.querySelector(`#size-${CSS.escape(productId)}`);
      const size = select ? select.value : "36–40";
      addToCart(productId, size);
      btn.textContent = "Added ✓";
      setTimeout(() => (btn.textContent = "Add to cart"), 900);
    });
  });
}

// ==============================
// Cart page
// ==============================

function renderCartPage() {
  const tableBody = document.querySelector("[data-cart-body]");
  const summaryBox = document.querySelector("[data-cart-summary]");
  const emptyEl = document.querySelector("[data-cart-empty]");
  if (!tableBody || !summaryBox) return;

  const cart = getCart();
  const totals = computeCartTotals(cart);

  if (totals.items.length === 0) {
    if (emptyEl) emptyEl.hidden = false;
    tableBody.innerHTML = "";
    summaryBox.innerHTML = `
      <div class="notice">
        Your cart is empty. Visit the shop and add some socks!
      </div>
    `;
    return;
  }

  if (emptyEl) emptyEl.hidden = true;

  tableBody.innerHTML = totals.items.map(it => `
    <tr>
      <td>
        <strong>${it.product.name}</strong><br />
        <span class="small">Size: ${it.size}</span>
      </td>
      <td>${formatEUR(it.product.price)}</td>
      <td>
        <div class="qty-controls">
          <button type="button" aria-label="Decrease quantity" data-qty-minus="${it.productId}|${it.size}">−</button>
          <span aria-live="polite">${it.qty}</span>
          <button type="button" aria-label="Increase quantity" data-qty-plus="${it.productId}|${it.size}">+</button>
        </div>
      </td>
      <td><strong>${formatEUR(it.line)}</strong></td>
      <td>
        <button class="btn" type="button" data-remove="${it.productId}|${it.size}">Remove</button>
      </td>
    </tr>
  `).join("");

  summaryBox.innerHTML = `
    <div class="summary">
      <h2 style="margin-top:0;">Order summary</h2>
      <div class="summary-row"><span>Subtotal</span><strong>${formatEUR(totals.subtotal)}</strong></div>
      <div class="summary-row"><span>Shipping</span><strong>${totals.shipping === 0 ? "Free" : formatEUR(totals.shipping)}</strong></div>
      <hr />
      <div class="summary-row"><span>Total</span><strong>${formatEUR(totals.total)}</strong></div>
      <p class="small">Checkout is mocked — no real payment is processed.</p>
      <a class="btn btn-primary" href="checkout.html">Go to checkout</a>
    </div>
  `;

  document.querySelectorAll("[data-qty-minus]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [pid, size] = btn.getAttribute("data-qty-minus").split("|");
      changeQty(pid, size, -1);
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-qty-plus]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [pid, size] = btn.getAttribute("data-qty-plus").split("|");
      changeQty(pid, size, +1);
      renderCartPage();
    });
  });

  document.querySelectorAll("[data-remove]").forEach(btn => {
    btn.addEventListener("click", () => {
      const [pid, size] = btn.getAttribute("data-remove").split("|");
      removeFromCart(pid, size);
      renderCartPage();
    });
  });
}

// ==============================
// Checkout form
// ==============================

function setupCheckoutForm() {
  const form = document.querySelector("[data-checkout-form]");
  const result = document.querySelector("[data-checkout-result]");
  if (!form || !result) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = getCart();
    const totals = computeCartTotals(cart);

    if (totals.items.length === 0) {
      result.innerHTML = `<div class="notice">Your cart is empty. Please add products first.</div>`;
      return;
    }

    saveCart([]); // mock: clear cart
    result.innerHTML = `
      <div class="notice">
        <strong>Order confirmed (mock)</strong><br />
        Thank you! This is a demo checkout. No real payment was processed.
      </div>
    `;

    form.reset();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ==============================
// Cookie banner (mock)
// ==============================

function setupCookieBanner() {
  const banner = document.querySelector("[data-cookie-banner]");
  const acceptBtn = document.querySelector("[data-cookie-accept]");
  const rejectBtn = document.querySelector("[data-cookie-reject]");
  if (!banner || !acceptBtn || !rejectBtn) return;

  const choice = localStorage.getItem("sockora_cookie_choice");
  if (choice) return;

  banner.hidden = false;

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("sockora_cookie_choice", "accepted");
    banner.hidden = true;
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("sockora_cookie_choice", "rejected");
    banner.hidden = true;
  });
}

// ==============================
// Init
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderFeaturedProducts();
  renderShopProducts();
  renderCartPage();
  setupCheckoutForm();
  setupCookieBanner();
});
