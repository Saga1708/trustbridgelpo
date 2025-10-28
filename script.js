/* script.js
   - TubesCursor integration (module import)
   - Slider next/prev logic
   - Theme toggle (persist)
   - Contact form using EmailJS (placeholders) with mailto fallback
   - Dynamic year fill
*/

import TubesCursor from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

/* --- Tubes Cursor: initialize once for pages that include a #canvas --- */
const canvas = document.getElementById("canvas");
let tubesApp = null;
if (canvas) {
  // initialize with brand-friendly colors
  tubesApp = TubesCursor(canvas, {
    tubes: {
      colors: ["#00e5ff", "#b400ff", "#4bff85"],
      lights: {
        intensity: 220,
        colors: ["#00f0ff", "#ff00e1", "#66ffcc", "#ffffff"],
      },
    },
    // any other options supported by the lib can be passed here
  });

  document.body.addEventListener("click", () => {
    if (!tubesApp) return;
    const colors = randomColors(3);
    const lightsColors = randomColors(4);
    tubesApp.tubes.setColors(colors);
    tubesApp.tubes.setLightsColors(lightsColors);
  });
}

function randomColors(count) {
  return new Array(count).fill(0).map(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  );
}

/* --- Slider logic for pages with a .slide --- */
function attachSliderControls(scope = document) {
  const nextBtn = scope.querySelector(".next");
  const prevBtn = scope.querySelector(".prev");
  if (!nextBtn || !prevBtn) return;

  nextBtn.addEventListener("click", function () {
    const items = scope.querySelectorAll(".item");
    if (!items || items.length === 0) return;
    scope.querySelector(".slide").appendChild(items[0]);
  });

  prevBtn.addEventListener("click", function () {
    const items = scope.querySelectorAll(".item");
    if (!items || items.length === 0) return;
    scope.querySelector(".slide").prepend(items[items.length - 1]);
  });
}

/* Run when DOM ready */
document.addEventListener("DOMContentLoaded", () => {
  attachSliderControls(document);

  // Theme toggle
  const toggles = document.querySelectorAll("#theme-toggle, #theme-toggle-2, #theme-toggle-3, #theme-toggle-4");
  const root = document.documentElement;
  const saved = localStorage.getItem("tb-theme");
  if (saved) root.setAttribute("data-theme", saved);
  toggles.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("tb-theme", next);
    });
  });

  // Contact form (EmailJS integration)
  // We expect the EmailJS script loaded on contact.html:
  // <script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
  // Replace the placeholders below with your EmailJS credentials.
  if (typeof emailjs !== "undefined") {
    try {
      // NOTE: Replace "YOUR_PUBLIC_KEY" below with your EmailJS public key
      emailjs.init("YOUR_PUBLIC_KEY");
    } catch (e) {
      // ignore if init not supported here
      // console.warn('EmailJS init failed', e);
    }
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();
      const status = document.getElementById("formStatus");
      if (!name || !email || !message) {
        status.textContent = "Please complete all fields.";
        status.style.color = "#ffb3b3";
        return;
      }

      // If EmailJS configured, send via EmailJS
      if (typeof emailjs !== "undefined" && emailjs.send) {
        // 🔧 Replace these placeholders with your actual IDs:
        const SERVICE_ID = "YOUR_SERVICE_ID";
        const TEMPLATE_ID = "YOUR_TEMPLATE_ID";

        const templateParams = {
          from_name: name,
          from_email: email,
          message: message,
          to_email: "info@trustbridgelpo.com"
        };

        status.textContent = "Sending...";
        emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
          .then(() => {
            status.textContent = "Message sent successfully — we will contact you soon.";
            status.style.color = "#9fe6b6";
            contactForm.reset();
          }, (err) => {
            status.textContent = "Sending failed. Opening your mail client as fallback.";
            status.style.color = "#ffb3b3";
            // fallback to mailto
            const mailto = `mailto:info@trustbridgelpo.com?subject=${encodeURIComponent("Contact from " + name)}&body=${encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\n"+message)}`;
            window.location.href = mailto;
            console.error("EmailJS error:", err);
          });
        return;
      }

      // If EmailJS not available or not configured -> fallback to mailto:
      const mailto = `mailto:info@trustbridgelpo.com?subject=${encodeURIComponent("Contact from " + name)}&body=${encodeURIComponent("Name: "+name+"\nEmail: "+email+"\n\n"+message)}`;
      status.textContent = "Opening your mail client...";
      window.location.href = mailto;
    });
  }

  const mailtoBtn = document.getElementById("mailtoFallback");
  if (mailtoBtn) {
    mailtoBtn.addEventListener("click", () => {
      window.location.href = "mailto:info@trustbridgelpo.com";
    });
  }

  // dynamic years
  ["year","year2","year3","year4"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = new Date().getFullYear();
  });
});
