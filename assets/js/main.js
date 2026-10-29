(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") nav.classList.remove("open");
    });
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Contact form (EmailJS)
  var form = document.getElementById("contact-form");
  if (form && window.emailjs) {
    emailjs.init("amOuNkktospDYLyfn");

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var status = document.getElementById("form-status");
      var button = form.querySelector('button[type="submit"]');
      var params = {
        from_name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        contact: document.getElementById("phone").value,
        to_name: "BlueJay Delivery",
        message: document.getElementById("note").value,
        sms_consent_status: document.getElementById("sms_consent").checked ? "Yes" : "No"
      };

      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Sending…";

      try {
        await emailjs.send("service_09mt6sp", "template_e38g3uu", params);
        form.reset();
        status.className = "form-status ok";
        status.textContent = "Thank you — your message has been sent. We’ll be in touch shortly.";
      } catch (err) {
        status.className = "form-status err";
        status.textContent = "Something went wrong sending your message. Please try again later.";
      } finally {
        button.disabled = false;
      }
    });
  }
})();
