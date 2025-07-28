function switchTab(tabName) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        switchTab(tabName);
    });
});

document.querySelectorAll('.cta-button, .skill-card, .portfolio-item, .testimonial-card, .contact-item').forEach(element => {
    element.addEventListener('mouseenter', function () {
        this.style.transform = this.style.transform || '';
    });
});

console.log("why are u spying here lmao")