const section = document.querySelector('.exploded-section');
const explodedSection = section;
const statementSection = document.querySelector('.statement');
const statementScroll = document.getElementById('statementScroll');
const statementWatch = document.getElementById('statementWatch');
const statementRound = statementSection.querySelector('.round-link');
const watermarkLetters = [...document.querySelectorAll('#statementWatermark span')];
const heroSection = document.getElementById('heroScroll');
const model = document.getElementById('explodedWatch');
const heroVideo = document.getElementById('heroVideo');
const heroCopy = document.getElementById('heroCopy');
const heroKicker = document.getElementById('heroKicker');
const heroTitle = document.getElementById('heroTitle');
const heroDescription = document.getElementById('heroDescription');
const heroFeature = document.getElementById('heroFeature');
const heroIndex = document.getElementById('heroIndex');
const heroFeatureText = document.getElementById('heroFeatureText');
const heroProgress = document.getElementById('heroProgress');
const card = document.getElementById('componentCard');
const scrollNumber = document.getElementById('scrollNumber');
const cardTitle = card.querySelector('h3');
const cardText = card.querySelector('p');
const cardNo = card.querySelector('.component-number');
const progressDots = [...card.querySelectorAll('.component-progress i')];
const componentProgress = card.querySelector('.component-progress');
const steps = [
  ['01 / 05', 'Domed sapphire', 'Double-domed and anti-reflective. Absolute clarity from every angle.'],
  ['02 / 05', 'The dial', 'A sunburst black dial that catches and releases the light with every movement.'],
  ['03 / 05', 'Calibre OX-92', 'Swiss automatic movement with a 72-hour power reserve. Built to quietly keep going.'],
  ['04 / 05', 'Exhibition back', 'A window into the mechanics, framed by a signed steel caseback.'],
  ['05 / 05', 'Italian rubber', 'Sculpted for comfort, secured by a quick-release steel clasp.']
];

// Lenis keeps the long frame sequence fluid while jQuery handles in-page links.
const smoothScroll = window.Lenis ? new window.Lenis({
  duration: 1.35,
  smoothWheel: true,
  syncTouch: true,
  wheelMultiplier: 0.8
}) : null;

let heroTargetTime = 0;
let previousFrameTime = 0;
function smoothScrollFrame(time) {
  if (smoothScroll) smoothScroll.raf(time);
  if (Number.isFinite(heroVideo.duration) && heroVideo.duration > 0) {
    const elapsed = previousFrameTime ? Math.min(time - previousFrameTime, 50) : 16;
    const easing = 1 - Math.exp(-elapsed / 125);
    const nextTime = heroVideo.currentTime + (heroTargetTime - heroVideo.currentTime) * easing;
    if (Math.abs(nextTime - heroVideo.currentTime) > 0.025) heroVideo.currentTime = nextTime;
  }
  previousFrameTime = time;
  requestAnimationFrame(smoothScrollFrame);
}
requestAnimationFrame(smoothScrollFrame);

if (window.jQuery) {
  window.jQuery('a[href^="#"]').on('click', function (event) {
    const target = this.getAttribute('href');
    if (!target || target === '#') return;
    const element = document.querySelector(target);
    if (!element) return;
    event.preventDefault();
    if (smoothScroll) smoothScroll.scrollTo(element, { offset: 0 });
    else element.scrollIntoView({ behavior: 'smooth' });
  });
}

const productGrid = document.querySelector('.products');
productGrid.insertAdjacentHTML('beforeend', `
  <article class="product-card tone-slate"><div class="card-actions"><button aria-label="Add Vector Slate to wishlist">♡</button><span>NEW</span></div><div class="mini-watch graphite"><div class="mini-strap"></div><div class="mini-face"><b>ORION</b><i></i><i></i></div></div><div class="product-info"><div><h3>Vector</h3><p>Slate / Steel</p></div><strong>INR 44,200</strong></div></article>
  <article class="product-card tone-ivory"><div class="card-actions"><button aria-label="Add Solace Ivory to wishlist">♡</button><span></span></div><div class="mini-watch sand"><div class="mini-strap"></div><div class="mini-face"><b>ORION</b><i></i><i></i></div></div><div class="product-info"><div><h3>Solace</h3><p>Ivory / Brushed steel</p></div><strong>INR 40,600</strong></div></article>
  <article class="product-card tone-forest"><div class="card-actions"><button aria-label="Add Terra Forest to wishlist">♡</button><span>LIMITED</span></div><div class="mini-watch moss"><div class="mini-strap"></div><div class="mini-face"><b>ORION</b><i></i><i></i></div></div><div class="product-info"><div><h3>Terra</h3><p>Forest / Titanium</p></div><strong>INR 49,300</strong></div></article>
`);

const productCards = [...document.querySelectorAll('.product-card')];
const productTrack = document.createElement('div');
productTrack.className = 'products-track';
productCards.forEach((product) => productTrack.appendChild(product));
productGrid.appendChild(productTrack);
const productObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      productObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });
productCards.forEach((product, index) => {
  product.style.transitionDelay = `${(index % 3) * 90}ms`;
  productObserver.observe(product);
});
const collectionSection = document.querySelector('.collection');
const collectionScroll = document.getElementById('collectionScroll');

let isTicking = false;
let currentHeroStage = -1;
let heroCopyTimer;
const heroStages = [
  { kicker: 'The Franklord / 01', title: 'Precision,<br><em>unfolded.</em>', description: 'A timepiece built around its beating heart. Scroll to enter the mechanics within.', index: '01 / 04', feature: 'Open-worked<br>mechanism' },
  { kicker: 'The calibre / 02', title: 'Made to<br><em>move you.</em>', description: 'Every surface is shaped around the energy of the automatic movement.', index: '02 / 04', feature: '288 hand-finished<br>components' },
  { kicker: 'Inside the movement / 03', title: 'Nothing<br><em>concealed.</em>', description: 'A complete mechanical universe, suspended in a choreography of light.', index: '03 / 04', feature: '72 hour<br>power reserve' },
  { kicker: 'Franklord / 04', title: 'Time, in<br><em>full view.</em>', description: 'Crafted to reveal the beauty behind every passing second.', index: '04 / 04', feature: 'Swiss automatic<br>precision' }
];

function mixHex(start, end, amount) {
  const parse = (hex) => hex.match(/[0-9a-f]{2}/gi).map((part) => parseInt(part, 16));
  const a = parse(start); const b = parse(end);
  return `rgb(${a.map((value, index) => Math.round(value + (b[index] - value) * amount)).join(',')})`;
}

function updateHeroCopy(stage) {
  if (stage === currentHeroStage) return;
  currentHeroStage = stage;
  const content = heroStages[stage];
  window.clearTimeout(heroCopyTimer);
  heroCopy.classList.add('is-changing');
  heroFeature.classList.add('is-changing');
  heroCopyTimer = window.setTimeout(() => {
    heroKicker.textContent = content.kicker;
    heroTitle.innerHTML = content.title;
    heroDescription.textContent = content.description;
    heroIndex.textContent = content.index;
    heroFeatureText.innerHTML = content.feature;
    heroCopy.classList.remove('is-changing');
    heroFeature.classList.remove('is-changing');
  }, 150);
}

function updateHero(progress) {
  if (Number.isFinite(heroVideo.duration) && heroVideo.duration > 0) {
    heroTargetTime = Math.min(heroVideo.duration - 0.04, progress * heroVideo.duration);
  }
  heroProgress.style.width = `${progress * 100}%`;
  updateHeroCopy(Math.min(heroStages.length - 1, Math.floor(progress * heroStages.length)));
}

function updateScroll() {
  const heroRect = heroSection.getBoundingClientRect();
  const heroProgress = Math.max(0, Math.min(1, -heroRect.top / (heroSection.offsetHeight - window.innerHeight)));
  updateHero(heroProgress);
  const rect = section.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, -rect.top / (section.offsetHeight - window.innerHeight)));
  const stage = Math.min(4, Math.floor(progress * 5));
  const spread = Math.min(1, progress * 1.42);
  const insideProgress = Math.max(0, Math.min(1, (progress - 0.68) / 0.32));
  const explodedSpread = spread * (1 - insideProgress);
  componentProgress.style.setProperty('--component-fill', `${progress * 100}%`);
  explodedSection.style.backgroundColor = mixHex('#d9d6ce', '#18211b', insideProgress);
  explodedSection.classList.toggle('is-inside', insideProgress > 0.04);
  explodedSection.classList.toggle('is-zoomed', insideProgress > 0.38);
  document.querySelector('.part-strap-top').style.transform = `translateY(${-150 * explodedSpread}px)`;
  document.querySelector('.part-lugs-top').style.transform = `translateY(${-86 * explodedSpread}px)`;
  document.querySelector('.part-bezel').style.transform = `translateY(${-44 * explodedSpread}px)`;
  document.querySelector('.part-dial').style.transform = `translateY(${-10 * explodedSpread}px)`;
  document.querySelector('.part-movement').style.transform = `translateY(${31 * explodedSpread}px)`;
  document.querySelector('.part-caseback').style.transform = `translateY(${72 * explodedSpread}px)`;
  document.querySelector('.part-lugs-bottom').style.transform = `translateY(${104 * explodedSpread}px)`;
  document.querySelector('.part-strap-bottom').style.transform = `translateY(${169 * explodedSpread}px)`;
  const rotation = 23 - progress * 12 - insideProgress * 11;
  model.style.transform = `rotateZ(${rotation}deg) scale(${.8 + progress * .08 + insideProgress * 5.2})`;

  const detail = steps[stage];
  if (card.dataset.stage !== String(stage)) {
    card.dataset.stage = stage;
    cardNo.textContent = detail[0]; cardTitle.textContent = detail[1]; cardText.textContent = detail[2];
    scrollNumber.textContent = `0${stage + 1}`;
    progressDots.forEach((dot, i) => dot.style.background = i <= stage ? '#171712' : '#a6a49a');
  }

  const statementRect = statementScroll.getBoundingClientRect();
  const statementProgress = Math.max(0, Math.min(1, -statementRect.top / (statementScroll.offsetHeight - window.innerHeight)));
  const textProgress = Math.min(1, statementProgress / 0.55);
  const watermarkCenter = (watermarkLetters.length - 1) / 2;
  watermarkLetters.forEach((letter, index) => {
    const centerDistance = Math.abs(index - watermarkCenter);
    const letterProgress = Math.max(0, Math.min(1, (textProgress - centerDistance * 0.075) / 0.7));
    letter.style.opacity = `${letterProgress * 0.9}`;
    letter.style.transform = `translateY(${(1 - letterProgress) * 95}vh)`;
  });
  statementSection.style.setProperty('--orion-y', `${(1 - textProgress) * 95}vh`);
  statementSection.style.setProperty('--orion-scale', `${1 + textProgress * .28}`);
  const watchProgress = Math.max(0, Math.min(1, (statementProgress - 0.70) / 0.30));
  const watchEase = watchProgress * watchProgress * (3 - 2 * watchProgress);
  const watchTravel = Math.max(420, statementSection.offsetHeight * .91);
  statementWatch.style.opacity = `${Math.min(1, watchEase * 1.8)}`;
  statementRound.style.opacity = `${textProgress}`;
  statementRound.style.transform = `rotate(${statementProgress * 360}deg)`;
  statementWatch.style.transform = `translate3d(0, ${(1 - watchEase) * watchTravel}px, 0) scale(${.62 + watchEase * .38})`;
  statementWatch.classList.toggle('is-arrived', watchEase > 0.55);

  const collectionRect = collectionScroll.getBoundingClientRect();
  const collectionProgress = Math.max(0, Math.min(1, -collectionRect.top / (collectionScroll.offsetHeight - window.innerHeight)));
  const sliderFocus = Math.max(0, Math.min(1, collectionProgress / 0.34));
  collectionSection.style.setProperty('--slider-y', `${72 - sliderFocus * 13}%`);
  collectionSection.style.setProperty('--heading-opacity', `${1 - sliderFocus}`);
  collectionSection.style.setProperty('--heading-shift', `${-42 * sliderFocus}px`);
  collectionSection.classList.toggle('is-slider-focus', sliderFocus >= 1);
  const sliderDistance = Math.max(0, productTrack.scrollWidth - productGrid.clientWidth);
  const sliderProgress = Math.max(0, Math.min(1, (collectionProgress - 0.34) / 0.66));
  productTrack.style.transform = `translate3d(${-sliderProgress * sliderDistance}px,0,0)`;
}

function requestUpdate() {
  if (isTicking) return;
  isTicking = true;
  requestAnimationFrame(() => { updateScroll(); isTicking = false; });
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
heroVideo.addEventListener('loadedmetadata', requestUpdate);
updateScroll();
