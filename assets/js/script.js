window.addEventListener('load', () => {
  const menu = document.querySelector('nav ul');
  const footerText = document.getElementById('footer-text');
  const body = document.body;
  const toggleButton = document.getElementById('menu-toggle');

  const setFooterContent = () => {
    const year = new Date().getFullYear();
    const desktop = window.innerWidth >= 500;
    const base = `Made by Matěj Teplý © ${year}`;
    footerText.innerHTML = desktop ? `${base} · All rights reserved.` : `${base}.`;
  };

  window.addEventListener('resize', setFooterContent);
  setFooterContent();

  toggleButton.addEventListener('click', () => {
    menu.classList.toggle('active');
    body.classList.toggle('menu-open', menu.classList.contains('active'));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1320 && menu.classList.contains('active')) {
      menu.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });
});
