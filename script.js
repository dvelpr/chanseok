const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('img');
const closeBtn = lb.querySelector('.close');
let lastFocused;
const cards = [...document.querySelectorAll('.card')];
let imageIndex = 0;
function showImage(index) {
  imageIndex = (index + cards.length) % cards.length;
  const card = cards[imageIndex];
  lbImg.src = card.dataset.full;
  lbImg.alt = card.querySelector('img').alt;
}
function openLightbox(index) {
  lastFocused = document.activeElement;
  showImage(index);
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
}
cards.forEach((card, index) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${card.querySelector('h3').textContent} image`);
  card.addEventListener('click', () => openLightbox(index));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(index); }
  });
});
function closeLightbox() {
  if (!lb.classList.contains('open')) return;
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  lbImg.removeAttribute('src');
  document.body.style.overflow = '';
  lastFocused?.focus();
}
closeBtn.addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showImage(imageIndex + 1);
  if (e.key === 'ArrowLeft') showImage(imageIndex - 1);
  if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
});
const gaugeFill = document.getElementById('gaugeFill');
const powerValue = document.getElementById('powerValue');
const powerLabel = document.getElementById('powerLabel');
const powerSection = document.getElementById('power');
let coffeeCount = 0;
function getPowerLabel(value) {
  if (value < 20) return 'Intern Energy';
  if (value < 45) return 'Pivot Table Apprentice';
  if (value < 70) return 'Spreadsheet Warrior';
  if (value < 90) return 'M&A Mode';
  if (value < 100) return 'Boardroom Boss';
  return 'CFO FINAL BOSS';
}
function updatePowerGauge() {
  const rect = powerSection.getBoundingClientRect();
  const viewport = window.innerHeight;
  const progress = Math.min(1, Math.max(0, (viewport * .9 - rect.top) / (viewport * .7)));
  const value = Math.min(100, Math.round(progress * 100) + coffeeCount * 10);
  gaugeFill.style.width = value + '%';
  gaugeFill.parentElement.setAttribute('aria-valuenow', value);
  powerValue.textContent = value + '%';
  powerLabel.textContent = getPowerLabel(value);
}
window.addEventListener('scroll', updatePowerGauge, { passive: true });
window.addEventListener('resize', updatePowerGauge);
function updateCoffee() {
  document.getElementById('coffeeNote').textContent = `Coffee consumed: ${coffeeCount}. ${coffeeCount >= 5 ? 'The spreadsheet can now hear colors.' : 'Budget: imaginary.'}`;
  updatePowerGauge();
}
document.getElementById('coffeeButton').addEventListener('click', () => { coffeeCount = Math.min(10, coffeeCount + 1); updateCoffee(); });
document.getElementById('resetPower').addEventListener('click', () => { coffeeCount = 0; updateCoffee(); });
updatePowerGauge();
const answers = {
  excel: '합격…은 아니고, 일단 이 피벗 테이블 좀 봐주세요. / Next round: one extremely suspicious spreadsheet.',
  coffee: '솔직함 +100. 카페인 예산 검토 중. / Honesty approved. Coffee budget under review.',
  synergy: '내용은 모르겠지만 임원 면접으로 모시겠습니다. / Nobody understood it. Somehow, you advanced.'
};
document.querySelectorAll('.answer').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.answer').forEach(b => { b.classList.remove('selected'); b.setAttribute('aria-pressed', 'false'); });
    button.classList.add('selected'); button.setAttribute('aria-pressed', 'true');
    document.getElementById('interviewResult').textContent = answers[button.dataset.answer];
  });
  button.setAttribute('aria-pressed', 'false');
});
const phrases = [
  ['Let’s align on the alignment before we realign.', 'We need another meeting.'],
  ['We should unlock scalable synergy across the coffee ecosystem.', 'Someone needs to refill the coffee.'],
  ['Let’s take a holistic approach to the lunch pipeline.', 'Where are we eating?'],
  ['We need to optimize our post-meeting meeting strategy.', 'The meeting did not resolve anything.'],
  ['This spreadsheet is a single source of multiple truths.', 'There are three different totals.'],
  ['Let’s leverage our existing chair infrastructure.', 'Please sit down.'],
  ['We’re entering an exciting phase of budget mindfulness.', 'Maybe skip the expensive lunch.'],
  ['I suggest a strategic pause in the slide delivery process.', 'Please stop presenting.']
];
let phraseIndex = 0;
document.getElementById('phraseButton').addEventListener('click', () => {
  phraseIndex = (phraseIndex + 1 + Math.floor(Math.random() * (phrases.length - 1))) % phrases.length;
  document.getElementById('phrase').textContent = `“${phrases[phraseIndex][0]}”`;
  document.getElementById('translation').textContent = `Translation: ${phrases[phraseIndex][1]}`;
});
document.getElementById('phrase').setAttribute('aria-live', 'polite');
const bingoButtons = [...document.querySelectorAll('.bingo-grid button')];
const winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function updateBingo() {
  const marked = bingoButtons.map(button => button.getAttribute('aria-pressed') === 'true');
  const winning = winningLines.filter(line => line.every(i => marked[i]));
  bingoButtons.forEach((button, index) => button.classList.toggle('winning', winning.some(line => line.includes(index))));
  const count = marked.filter(Boolean).length;
  document.getElementById('bingoStatus').textContent = winning.length ? `BINGO! ${winning.length} completed line${winning.length > 1 ? 's' : ''}. Your imaginary equity: still 0%.` : `${count} / 9 marked. ${count > 5 ? 'This meeting could definitely have been an email.' : 'Keep listening. Strategically.'}`;
}
bingoButtons.forEach(button => button.addEventListener('click', () => {
  button.setAttribute('aria-pressed', button.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); updateBingo();
}));
document.getElementById('resetBingo').addEventListener('click', () => { bingoButtons.forEach(button => button.setAttribute('aria-pressed', 'false')); updateBingo(); });
