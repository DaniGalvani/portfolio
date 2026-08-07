const navLinks = document.querySelectorAll(".navbar .nav-link");

function setActiveNavLink(hash) {
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === hash) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveNavLink(link.getAttribute("href"));
  });
});

window.addEventListener("hashchange", () => {
  setActiveNavLink(window.location.hash);
});

setActiveNavLink(window.location.hash);

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
  const requiredContactTextFields = Array.from(
    contactForm.querySelectorAll(
      'input[type="text"], input[type="email"], textarea',
    ),
  );

  function updateContactSubmitState() {
    const hasContent = requiredContactTextFields.every(
      (field) => field.value.trim().length > 0,
    );
    const isComplete = hasContent && contactForm.checkValidity();
    contactSubmitButton.disabled = !isComplete;
    contactSubmitButton.setAttribute("aria-disabled", String(!isComplete));
  }

  contactForm.addEventListener("input", updateContactSubmitState);
  contactForm.addEventListener("change", updateContactSubmitState);
  contactForm.addEventListener("reset", () => {
    window.requestAnimationFrame(updateContactSubmitState);
  });

  updateContactSubmitState();
}
