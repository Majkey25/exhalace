window.addEventListener('load', () => {
    const menu = document.querySelector('nav ul'); // Select the menu directly
    const footer = document.querySelector('footer');
    const items = Array.from(menu.children);
  
    // Update the footer content
    function updateFooterContent() {
      const footerText = document.getElementById('footer-text');
      const footerLink = document.getElementById('footer-link');
  
      if (window.innerWidth >= 500) {
        // PC Version
        footerText.innerHTML = 'Made by Matěj Teplý &copy; 2025 All rights reserved.';
      } else {
        // Phone Version
        footerText.innerHTML = 'Made by Matěj Teplý.';
      }
    }
  
    window.addEventListener('resize', updateFooterContent);
    updateFooterContent(); // Initialize footer on page load
    
    // Hamburger menu toggle
    document.getElementById('menu-toggle').addEventListener('click', function() {
        menu.classList.toggle('active'); // Toggle the 'active' class on the nav ul
    });
});
