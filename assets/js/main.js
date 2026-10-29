(function () {
  "use strict";

  // NAVI application intake. Leave endpoint empty until the API is deployed;
  // submissions then fall back to EmailJS so no application is lost.
  var NAVI_APPLY = {
    endpoint: "", // e.g. "https://<api-id>.execute-api.us-west-2.amazonaws.com/public/apply"
    siteKey: ""
  };

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

  // Application form (NAVI intake with EmailJS fallback)
  var applyForm = document.getElementById("apply-form");
  if (applyForm) {
    // Pre-select the role from ?role=<slug>
    var roleSelect = document.getElementById("role");
    var requestedRole = new URLSearchParams(window.location.search).get("role");
    if (requestedRole && roleSelect.querySelector('option[value="' + requestedRole + '"]')) {
      roleSelect.value = requestedRole;
    }

    applyForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      var status = document.getElementById("form-status");
      var button = applyForm.querySelector('button[type="submit"]');
      var application = {
        siteKey: NAVI_APPLY.siteKey,
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        role: roleSelect.value,
        message: document.getElementById("message").value.trim(),
        smsConsent: document.getElementById("sms_consent").checked,
        company: document.getElementById("company").value
      };

      button.disabled = true;
      status.className = "form-status";
      status.textContent = "Submitting…";

      var sent = false;

      if (NAVI_APPLY.endpoint) {
        try {
          var res = await fetch(NAVI_APPLY.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application)
          });
          sent = res.ok;
        } catch (err) {
          sent = false;
        }
      }

      if (!sent && window.emailjs) {
        try {
          emailjs.init("amOuNkktospDYLyfn");
          await emailjs.send("service_09mt6sp", "template_e38g3uu", {
            from_name: application.firstName + " " + application.lastName,
            email: application.email,
            contact: application.phone,
            to_name: "BlueJay Delivery",
            message: "JOB APPLICATION — " +
              roleSelect.options[roleSelect.selectedIndex].text +
              (application.message ? "\n\n" + application.message : ""),
            sms_consent_status: application.smsConsent ? "Yes" : "No"
          });
          sent = true;
        } catch (err) {
          sent = false;
        }
      }

      if (sent) {
        applyForm.reset();
        status.className = "form-status ok";
        status.textContent = "Application received — we'll call you back, usually within one business day.";
      } else {
        status.className = "form-status err";
        status.textContent = "Something went wrong. Please call us at (510) 900-9018 and we'll take your application over the phone.";
      }
      button.disabled = false;
    });
  }

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
