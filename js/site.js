(() => {
  // Nav gets a solid background once the title card scrolls away.
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade sections in as they enter the viewport.
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Lightbox: one sequence per data-lb group ("sel" or "ev").
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('figcaption');
  let list = [], idx = 0, opener = null;

  const show = (i) => {
    idx = (i + list.length) % list.length;
    const a = list[idx];
    lbImg.style.opacity = 0;
    lbImg.onload = () => { lbImg.style.opacity = 1; };
    lbImg.src = a.href;
    lbImg.alt = a.querySelector('img').alt;
    lbCap.textContent = a.dataset.cap || '';
  };
  const open = (a) => {
    list = [...document.querySelectorAll(`a[data-lb="${a.dataset.lb}"]`)];
    opener = a;
    show(list.indexOf(a));
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = '';
    lbImg.removeAttribute('src');
    if (opener) opener.focus();
  };

  document.querySelectorAll('a[data-lb]').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); open(a); }));
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(idx - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
