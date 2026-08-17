const navLinks = document.querySelectorAll(".navbar .nav-link");
const pageSectionLinks = document.querySelectorAll('a[href^="#"]');

function setActiveNavLink(hash) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function removeAddressBarHash() {
  const cleanUrl = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(window.history.state, "", cleanUrl);
}

pageSectionLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    const target = document.getElementById(hash.slice(1));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ block: "start" });
    setActiveNavLink(hash);
    removeAddressBarHash();
  });
});

const initialHash = window.location.hash;
setActiveNavLink(initialHash);

if (initialHash) {
  const initialTarget = document.getElementById(initialHash.slice(1));

  window.requestAnimationFrame(() => {
    initialTarget?.scrollIntoView({ block: "start" });
    removeAddressBarHash();
  });
}

const navigationToggle = document.querySelector("[data-nav-toggle]");
const primaryNavigation = document.querySelector("[data-primary-navigation]");

if (navigationToggle && primaryNavigation) {
  const mobileNavigationQuery = window.matchMedia("(max-width: 700px)");

  function closeMobileNavigation() {
    navigationToggle.setAttribute("aria-expanded", "false");
    navigationToggle.setAttribute("aria-label", "Open navigation");
    primaryNavigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  navigationToggle.addEventListener("click", () => {
    const shouldOpen =
      navigationToggle.getAttribute("aria-expanded") !== "true";

    navigationToggle.setAttribute("aria-expanded", String(shouldOpen));
    navigationToggle.setAttribute(
      "aria-label",
      shouldOpen ? "Close navigation" : "Open navigation",
    );
    primaryNavigation.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("menu-open", shouldOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileNavigation();
      navigationToggle.focus();
    }
  });

  mobileNavigationQuery.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMobileNavigation();
    }
  });
}

const testimonialSlider = document.querySelector(".testimonial-slider");

if (testimonialSlider) {
  const testimonialSlides = Array.from(
    testimonialSlider.querySelectorAll("[data-testimonial-slide]"),
  );
  const testimonialDots = Array.from(
    testimonialSlider.querySelectorAll("[data-testimonial-dot]"),
  );
  const previousTestimonialButton = testimonialSlider.querySelector(
    "[data-testimonial-prev]",
  );
  const nextTestimonialButton = testimonialSlider.querySelector(
    "[data-testimonial-next]",
  );
  let activeTestimonialIndex = 0;

  function showTestimonial(index) {
    activeTestimonialIndex =
      (index + testimonialSlides.length) % testimonialSlides.length;

    testimonialSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeTestimonialIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });

    testimonialDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeTestimonialIndex;
      dot.classList.toggle("is-active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  previousTestimonialButton.addEventListener("click", () => {
    showTestimonial(activeTestimonialIndex - 1);
  });

  nextTestimonialButton.addEventListener("click", () => {
    showTestimonial(activeTestimonialIndex + 1);
  });

  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showTestimonial(Number(dot.dataset.testimonialDot));
    });
  });

  testimonialSlider.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showTestimonial(activeTestimonialIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showTestimonial(activeTestimonialIndex + 1);
    }
  });

  showTestimonial(activeTestimonialIndex);
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const contactSubmitButton = contactForm.querySelector(
    "[data-contact-submit]",
  );
  const contactStatus = contactForm.querySelector("[data-contact-status]");
  const requiredContactFields = Array.from(
    contactForm.querySelectorAll("input[required], textarea[required]"),
  );
  const touchedContactFields = new Set();
  let isSubmitting = false;
  let contactStatusTimeoutId = null;

  function getContactMessage(type) {
    const messages = {
      en: {
        sending: "Your message is being sent...",
        success: "Thank you! Your message has been sent.",
        error: "The message could not be sent. Please try again later.",
      },
      de: {
        sending: "Deine Nachricht wird gesendet...",
        success: "Vielen Dank! Deine Nachricht wurde gesendet.",
        error:
          "Die Nachricht konnte nicht gesendet werden. Bitte versuche es später erneut.",
      },
    };
    const language = document.documentElement.lang.toLowerCase();

    return (messages[language] ?? messages.en)[type];
  }

  function setContactStatus(type = "") {
    if (contactStatusTimeoutId !== null) {
      window.clearTimeout(contactStatusTimeoutId);
      contactStatusTimeoutId = null;
    }

    contactStatus.hidden = !type;
    contactStatus.classList.toggle("is-success", type === "success");
    contactStatus.classList.toggle("is-error", type === "error");
    contactStatus.textContent = type ? getContactMessage(type) : "";

    if (type === "success") {
      contactStatusTimeoutId = window.setTimeout(() => {
        contactStatusTimeoutId = null;
        setContactStatus();
      }, 5000);
    }
  }

  function getContactFieldError(field) {
    if (field.type === "checkbox") {
      return field.checked ? null : "valueMissing";
    }

    if (field.value.trim().length === 0) {
      return "valueMissing";
    }

    if (field.validity.typeMismatch) {
      return "typeMismatch";
    }

    return field.validity.valid ? null : "valueMissing";
  }

  function updateContactFieldState(field, forceError = false) {
    const fieldWrapper = field.closest("[data-contact-field]");
    const errorType = getContactFieldError(field);
    const shouldShowError =
      Boolean(errorType) && (forceError || touchedContactFields.has(field));
    const errorMessages = fieldWrapper.querySelectorAll(
      "[data-contact-error]",
    );

    fieldWrapper.classList.toggle("is-invalid", shouldShowError);
    field.setAttribute("aria-invalid", String(shouldShowError));

    errorMessages.forEach((errorMessage) => {
      const isActiveError =
        shouldShowError && errorMessage.dataset.contactError === errorType;

      errorMessage.hidden = !isActiveError;
    });

    const activeError = fieldWrapper.querySelector(
      `[data-contact-error="${errorType}"]`,
    );

    if (shouldShowError && activeError) {
      field.setAttribute("aria-describedby", activeError.id);
    } else {
      field.removeAttribute("aria-describedby");
    }
  }

  function updateContactSubmitState() {
    const isComplete = requiredContactFields.every(
      (field) => getContactFieldError(field) === null,
    );

    const isDisabled = !isComplete || isSubmitting;

    contactSubmitButton.disabled = isDisabled;
    contactSubmitButton.setAttribute("aria-disabled", String(isDisabled));
  }

  requiredContactFields.forEach((field) => {
    field.addEventListener("blur", () => {
      touchedContactFields.add(field);
      updateContactFieldState(field);
    });

    field.addEventListener("input", () => {
      updateContactFieldState(field);
      updateContactSubmitState();
    });

    field.addEventListener("change", () => {
      updateContactFieldState(field);
      updateContactSubmitState();
    });
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalidFields = requiredContactFields.filter(
      (field) => getContactFieldError(field) !== null,
    );

    if (invalidFields.length > 0) {
      invalidFields.forEach((field) => {
        touchedContactFields.add(field);
        updateContactFieldState(field, true);
      });

      invalidFields[0].focus();
      updateContactSubmitState();
      return;
    }

    if (isSubmitting) {
      return;
    }

    const formData = new FormData(contactForm);
    const payload = {
      privacyAccepted: formData.has("privacy-policy-accepted"),
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    isSubmitting = true;
    updateContactSubmitState();
    contactForm.setAttribute("aria-busy", "true");
    setContactStatus("sending");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "Mail delivery failed");
      }

      contactForm.reset();
      setContactStatus("success");
    } catch (error) {
      console.error("Contact form submission failed:", error);
      setContactStatus("error");
    } finally {
      isSubmitting = false;
      contactForm.removeAttribute("aria-busy");
      updateContactSubmitState();
    }
  });

  contactForm.addEventListener("reset", () => {
    touchedContactFields.clear();

    window.requestAnimationFrame(() => {
      requiredContactFields.forEach((field) => {
        updateContactFieldState(field);
      });
      updateContactSubmitState();
    });
  });

  requiredContactFields.forEach((field) => {
    updateContactFieldState(field);
  });
  updateContactSubmitState();
}
