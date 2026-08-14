document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => spyObserver.observe(section));

    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => revealObserver.observe(el));

    const contactForm = document.querySelector('.contact-form form');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    function setStatus(message, isError) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.classList.add('visible');
        formStatus.classList.toggle('error', Boolean(isError));
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            setStatus('Sending your message...', false);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' },
                });

                if (response.ok) {
                    setStatus('Thanks! Your message has been sent — I will get back to you soon.', false);
                    contactForm.reset();
                } else {
                    setStatus('Something went wrong sending your message. Please email villonglory@gmail.com directly.', true);
                }
            } catch (error) {
                setStatus('Network error — please email villonglory@gmail.com directly.', true);
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});
