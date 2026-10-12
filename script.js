// ===== MOBMEK AUTO SERVICES =====

// Header: solid background once the page is scrolled
const header = document.getElementById('siteHeader');

function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', function () {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', open);
});

// Close the mobile menu when a link is chosen
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Highlight the current page in the navigation
const currentPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
document.querySelectorAll('.nav-links a:not(.nav-phone)').forEach(link => {
    if (link.pathname === currentPath) {
        link.classList.add('active');
    }
});

// Footer copyright year
const yearEl = document.getElementById('year');
if (yearEl) {
    yearEl.innerHTML = `&copy; ${new Date().getFullYear()} MOBMEK AUTO SERVICES. All Rights Reserved.`;
}

// Contact form: open the SMS app with a pre-filled message
function SendText() {
    const name = document.getElementById('name').value.trim();
    const rego = document.getElementById('rego').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !rego || !message) {
        alert('Please fill out all fields (Name, Rego # and Message).');
        return;
    }

    const smsBody = `Hi, I'm ${name}.\nRego: ${rego}\n\n${message}`;
    window.location.href = `sms:+64224261587?body=${encodeURIComponent(smsBody)}`;
}
