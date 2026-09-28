const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const closeBtn = lb.querySelector('.close');

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    lbImg.src = card.dataset.full;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => {
  if (e.target === lb) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
