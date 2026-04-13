(function () {
  const db = window.VSETU_DB;
  const cartApi = window.VSETU_CART;

  function setStatus(form, type, text) {
    const box = form.querySelector("[data-form-status]");
    if (!box) return;
    box.className = `form-status show ${type}`;
    box.textContent = text;
  }

  function resetStatus(form) {
    const box = form.querySelector("[data-form-status]");
    if (!box) return;
    box.className = "form-status";
    box.textContent = "";
  }

  function formToObject(form) {
    const data = new FormData(form);
    const obj = {};
    for (const [key, value] of data.entries()) {
      obj[key] = typeof value === "string" ? value.trim() : value;
    }
    return obj;
  }

  function toMailto(data) {
    const subject = encodeURIComponent(data.mail_subject || "Povpraševanje preko VSE JE TU");
    const lines = [
      `Tip: ${data.inquiry_type || "contact"}`,
      `Stran: ${data.page || window.location.pathname}`,
      `Ime: ${data.name || ""}`,
      `E-pošta: ${data.email || ""}`,
      `Telefon: ${data.phone || ""}`,
      `Organizacija: ${data.organization || ""}`,
      `Proračun: ${data.budget || ""}`,
      `Termin: ${data.preferred_date || ""}`,
      "",
      "Sporočilo:",
      data.message || "",
      "",
      "Izbrano:",
      data.cart_readable || ""
    ];
    return `mailto:maj@klemenc.org?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function submitInquiry(form) {
    resetStatus(form);
    const data = formToObject(form);
    const cartRaw = data.cart_json ? JSON.parse(data.cart_json || "[]") : [];

    const payload = {
      inquiry_type: data.inquiry_type || "contact",
      page: data.page || window.location.pathname.split("/").pop() || "index.html",
      source: window.location.href,
      name: data.name || null,
      email: data.email || null,
      phone: data.phone || null,
      organization: data.organization || null,
      budget: data.budget || null,
      preferred_date: data.preferred_date || null,
      message: data.message || null,
      cart: cartRaw.length ? cartRaw : null
    };

    try {
      if (db && db.hasSupabase()) {
        await db.saveInquiry(payload);
        setStatus(form, "success", "Uspešno oddano. Prejeli smo vaše sporočilo.");
      } else {
        window.location.href = toMailto(data);
        setStatus(form, "success", "Odprl se je vaš e-poštni odjemalec za pošiljanje povpraševanja.");
      }

      if (payload.inquiry_type === "product" || payload.inquiry_type === "tour") {
        if (cartApi && cartApi.clearCart) cartApi.clearCart();
      }

      form.reset();

      const cartJson = form.querySelector("[data-cart-json]");
      const cartReadable = form.querySelector("[data-cart-readable]");
      if (cartJson) cartJson.value = "[]";
      if (cartReadable) cartReadable.value = "";
    } catch (error) {
      console.error(error);
      setStatus(form, "error", "Pri oddaji je prišlo do napake. Poskusite znova ali pišite na maj@klemenc.org.");
    }
  }

  async function submitNewsletter(form) {
    resetStatus(form);
    const data = formToObject(form);
    try {
      if (db && db.hasSupabase()) {
        await db.saveNewsletter({
          email: data.email,
          source: window.location.href
        });
        form.reset();
        setStatus(form, "success", "Hvala. Dodani ste na listo obvestil.");
      } else {
        window.location.href = `mailto:maj@klemenc.org?subject=Prijava%20na%20obvestila&body=${encodeURIComponent(`Email: ${data.email}\nStran: ${window.location.href}`)}`;
        setStatus(form, "success", "Odprl se je e-poštni odjemalec za prijavo na obvestila.");
      }
    } catch (error) {
      console.error(error);
      setStatus(form, "error", "Prijava ni uspela. Poskusite znova.");
    }
  }

  document.querySelectorAll("[data-inquiry-form]").forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitInquiry(form);
    });
  });

  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitNewsletter(form);
    });
  });
})();