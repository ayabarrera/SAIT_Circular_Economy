
  document.querySelectorAll('.accordion-toggle').forEach(button => {
    button.addEventListener('click', () => {
      button.classList.toggle('open');
    });
  });


  document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    // Handle header change on scroll
    window.addEventListener('scroll', function() {
        // Adjust scroll threshold based on when you want the header to change.
        // A value around the height of your .header-top is often good.
        const scrollThreshold = 80; // Example: if scrolled more than 80px
        if (window.scrollY > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Handle mobile menu toggle
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        // Optional: Animate the hamburger icon to an 'X'
        this.classList.toggle('is-active');
    });
});