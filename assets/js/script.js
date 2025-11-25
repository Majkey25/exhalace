window.addEventListener('load', () => {
  const menu = document.querySelector('nav ul');
  const footerText = document.getElementById('footer-text');

  const setFooterContent = () => {
    const year = new Date().getFullYear();
    const desktop = window.innerWidth >= 500;
    const base = `Made by Matěj Teplý © ${year}`;
    footerText.innerHTML = desktop ? `${base} · All rights reserved.` : `${base}.`;
  };

  window.addEventListener('resize', setFooterContent);
  setFooterContent();

  document.getElementById('menu-toggle').addEventListener('click', () => {
    menu.classList.toggle('active');
  });
});
