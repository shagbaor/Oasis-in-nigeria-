// Contact email used by the form (opens the visitor's email app).
const CONTACT_EMAIL = "hello@oasis.org";

document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

menu.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  })
);

// "Get involved" links preselect the form subject
const form = document.getElementById("contact-form");
document.querySelectorAll("[data-subject]").forEach((link) =>
  link.addEventListener("click", () => {
    form.subject.value = link.dataset.subject;
  })
);

// Contact form: validate, then open a pre-filled email
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  ["name", "email", "message"].forEach((field) => {
    const input = form[field];
    const ok = input.checkValidity() && input.value.trim() !== "";
    input.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = "Please fill in your name, a valid email and a message.";
    status.classList.add("error");
    return;
  }

  const subject = `[OASIS] ${form.subject.value} — ${form.name.value.trim()}`;
  const body = `${form.message.value.trim()}\n\nFrom: ${form.name.value.trim()} <${form.email.value.trim()}>`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.classList.remove("error");
  status.textContent = "Opening your email app… Thank you for reaching out!";
  form.reset();
});

// Fade sections in as they scroll into view
const revealTargets = document.querySelectorAll(".section-head, .card, .split > *, .values li");
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("visible"));
}
