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


const gaugeFill = document.getElementById('gaugeFill');
const powerValue = document.getElementById('powerValue');
const powerLabel = document.getElementById('powerLabel');
const powerSection = document.getElementById('power');

function getPowerLabel(value){
  if(value < 20) return 'Intern Energy';
  if(value < 45) return 'Pivot Table Apprentice';
  if(value < 70) return 'Spreadsheet Warrior';
  if(value < 90) return 'M&A Mode';
  if(value < 100) return 'Boardroom Boss';
  return 'CFO FINAL BOSS';
}

function updatePowerGauge(){
  if(!powerSection || !gaugeFill || !powerValue || !powerLabel) return;

  const rect = powerSection.getBoundingClientRect();
  const viewport = window.innerHeight || document.documentElement.clientHeight;
  const start = viewport * 0.9;
  const end = viewport * 0.2;
  const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
  const value = Math.round(progress * 100);

  gaugeFill.style.width = value + '%';
  powerValue.textContent = value + '%';
  powerLabel.textContent = getPowerLabel(value);
}

window.addEventListener('scroll', updatePowerGauge, {passive:true});
window.addEventListener('resize', updatePowerGauge);
updatePowerGauge();
