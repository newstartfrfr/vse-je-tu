(function () {
  const CART_KEY = "vse-je-tu-cart";
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (navToggle && mobilePanel) {
    navToggle.addEventListener("click", function () {
      const open = mobilePanel.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  function readCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartUI();
  }

  function addToCart(item) {
    const items = readCart();
    items.push({
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: item.title,
      price: item.price,
      category: item.category,
      notes: item.notes || "",
      page: window.location.pathname.split("/").pop() || "index.html"
    });
    saveCart(items);
    announce("Dodano v povpraševanje.");
  }

  function removeFromCart(id) {
    const filtered = readCart().filter((item) => item.id !== id);
    saveCart(filtered);
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
  }

  function cartCount() {
    return readCart().length;
  }

  function updateCartUI() {
    const count = cartCount();
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = String(count);
    });

    const cartList = document.querySelector("[data-cart-list]");
    const emptyState = document.querySelector("[data-cart-empty]");
    const hiddenCartInput = document.querySelector("[data-cart-json]");
    const cartTextArea = document.querySelector("[data-cart-readable]");
    const totalNode = document.querySelector("[data-cart-total]");

    if (hiddenCartInput) hiddenCartInput.value = JSON.stringify(readCart());

    if (cartTextArea) {
      const text = readCart()
        .map((item) => `• ${item.title} | ${item.category} | ${item.price}`)
        .join("\n");
      cartTextArea.value = text;
    }

    if (totalNode) {
      totalNode.textContent = `${count} izbranih artiklov / storitev`;
    }

    if (!cartList) return;
    const items = readCart();

    if (!items.length) {
      cartList.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    cartList.innerHTML = items
      .map((item) => `
        <div class="cart-item">
          <div class="cart-item-head">
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.category)} · ${escapeHtml(item.price)}</p>
            </div>
            <button class="link-button" type="button" data-remove-cart="${escapeHtml(item.id)}">Odstrani</button>
          </div>
          ${item.notes ? `<p>${escapeHtml(item.notes)}</p>` : ""}
        </div>
      `)
      .join("");

    cartList.querySelectorAll("[data-remove-cart]").forEach((button) => {
      button.addEventListener("click", function () {
        removeFromCart(button.getAttribute("data-remove-cart"));
      });
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function announce(message) {
    const live = document.querySelector("[data-live-region]");
    if (!live) return;
    live.textContent = message;
    setTimeout(() => {
      live.textContent = "";
    }, 1800);
  }

  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", function () {
      addToCart({
        title: button.getAttribute("data-title") || "Izdelek",
        price: button.getAttribute("data-price") || "Po dogovoru",
        category: button.getAttribute("data-category") || "Splošno",
        notes: button.getAttribute("data-notes") || ""
      });
    });
  });

  document.querySelectorAll("[data-clear-cart]").forEach((button) => {
    button.addEventListener("click", function () {
      clearCart();
    });
  });

  window.VSETU_CART = {
    readCart,
    saveCart,
    addToCart,
    clearCart
  };

  updateCartUI();
})();