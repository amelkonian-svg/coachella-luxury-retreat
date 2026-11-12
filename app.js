(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const photos = [
    { src: 'assets/kitchen.jpg', title: 'Kitchen and breakfast area', description: 'The original kitchen. We had to leave something reassuring.', alt: 'Original listing photo of the kitchen and breakfast area opening to the pool' },
    { src: 'assets/pool-disaster.jpg', title: 'Private pool. Thriving ecosystem.', description: 'Pool maintenance has taken a more ecological direction. Photo altered for the joke.', alt: 'Altered pool photo: swamp-green water, sad flamingo float and rusty patio chairs' },
    { src: 'assets/bedroom-disaster.jpg', title: 'King-size expectations.', description: 'Our signature floor-level sleep experience. Photo altered for the joke.', alt: 'Altered bedroom photo: sagging mattresses on the floor, industrial fan and garbage-bag blackout blind' },
    { src: 'assets/games-disaster.jpg', title: 'Championship-level disappointment.', description: 'Every game ends in the same corner. Photo altered for the joke.', alt: 'Altered games-room photo: torn pool-table felt and cinder-block leg support' },
    { src: 'assets/living.jpg', title: 'Indoor-outdoor living', description: 'Original listing photo. There is still hope.', alt: 'Original living room with wide glass doors opening onto the patio' },
    { src: 'assets/exterior.jpg', title: 'First impressions are everything', description: 'Original listing photo. The exterior has an excellent publicist.', alt: 'Original exterior photo of the home and garage' },
    { src: 'assets/bathroom.jpg', title: 'Master bathroom', description: 'Original listing photo. A quiet place to reconsider your choices.', alt: 'Original master bathroom with bathtub, vanity and fireplace' },
    { src: 'assets/patio.jpg', title: 'Outdoor dining with a view', description: 'Original listing photo. The mountains remain exceptional.', alt: 'Original patio dining area with mountain views' }
  ];

  let toastTimeout;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('visible'), 3500);
  }
  let lastDialogFocus = null;
  function openDialog(dialog) {
    lastDialogFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  }
  function closeDialog(dialog) {
    dialog.close();
  }
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('close', () => {
      document.body.style.overflow = '';
      lastDialogFocus?.focus({ preventScroll: true });
    });
    $$('.dialog-close, .dialog-done', dialog).forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  });

  const infoText = {
    app: ['The group-chat edition', 'All the charm of a travel app. None of the accidental reservations. This page is a joke made from the original property listing and a few creatively damaged photos.'],
    currency: ['Your standards have been converted.', 'Prices are displayed in Canadian dollars. The quality of the pool water is unaffected by the exchange rate.'],
    list: ['Have a place like this?', 'Excellent. Please consider fixing it first. This is a parody page, so there is no property registration here.'],
    help: ['Help is on the way. In theory.', 'For the pool, try a biologist. For the bed, try optimism. For the person who booked this, try forgiveness.'],
    trips: ['Your upcoming trip', 'Coachella. Six friends. Two forks. One very active group chat. No real booking has been made on this page.'],
    'sign-in': ['No password required.', 'You already have everything you need: access to the group chat and a flexible definition of luxury.'],
    booking: ['Good news: your standards are available.', 'No reservation has been made and nothing has been charged. This is the joke version. The real house is still on the original Vrbo listing. Your friends, however, may never trust you again.']
  };
  function showInfo(key) {
    const [title, message] = infoText[key] || infoText.app;
    $('#info-title').textContent = title;
    $('#info-message').textContent = message;
    openDialog($('#info-dialog'));
  }
  $$('[data-info]').forEach(button => button.addEventListener('click', () => showInfo(button.dataset.info)));

  async function shareListing() {
    const url = new URL(location.href);
    url.hash = '';
    const share = { title: 'Found our Coachella place. Looks incredible.', text: '3 bedrooms. Sleeps 6. Forks 2. Luxury refers to the nightly rate.', url: url.href };
    try {
      if (navigator.share && !location.protocol.startsWith('file')) {
        await navigator.share(share);
        return;
      }
      await navigator.clipboard.writeText(url.href);
      toast('Link copied. Let the group chat decide.');
    } catch (error) {
      if (error.name === 'AbortError') return;
      const field = document.createElement('textarea');
      field.value = url.href;
      field.style.position = 'fixed';
      field.style.left = '-9999px';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      toast(copied ? 'Link copied. Lower expectations before sharing.' : 'Copy the page address to share it with the group.');
    }
  }
  $$('.share-button').forEach(button => button.addEventListener('click', shareListing));

  const saveButton = $('#save-button');
  let saved = false;
  try { saved = localStorage.getItem('coachella-parody-saved') === 'true'; } catch (_) { /* Storage can be disabled. */ }
  function renderSaved() { saveButton.setAttribute('aria-pressed', String(saved)); $('span', saveButton).textContent = saved ? 'Saved' : 'Save'; }
  renderSaved();
  saveButton.addEventListener('click', () => {
    saved = !saved;
    try { localStorage.setItem('coachella-parody-saved', String(saved)); } catch (_) { /* Remain functional without storage. */ }
    renderSaved();
    toast(saved ? 'Saved to questionable life choices.' : 'Removed. Sensible decision.');
  });

  const track = $('#gallery-track');
  for (let i = 5; i < photos.length; i++) {
    const button = document.createElement('button');
    button.className = 'gallery-tile mobile-extra-photo';
    button.dataset.photo = String(i);
    button.setAttribute('aria-label', `Open photo: ${photos[i].title}`);
    const img = document.createElement('img');
    img.src = photos[i].src;
    img.alt = photos[i].alt;
    img.loading = 'lazy';
    button.append(img);
    track.append(button);
  }
  const extraStyle = document.createElement('style');
  extraStyle.textContent = '.mobile-extra-photo{display:none}@media(max-width:575px){.mobile-extra-photo{display:block}}';
  document.head.append(extraStyle);
  let photoIndex = 0;
  const thumbnails = $('#gallery-thumbnails');
  photos.forEach((photo, index) => {
    const button = document.createElement('button');
    button.className = 'gallery-thumbnail';
    button.setAttribute('aria-label', `Show photo ${index + 1}: ${photo.title}`);
    button.setAttribute('aria-pressed', 'false');
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = '';
    img.loading = 'lazy';
    button.append(img);
    button.addEventListener('click', () => renderPhoto(index));
    thumbnails.append(button);
  });
  function renderPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    const photo = photos[photoIndex];
    $('#gallery-large-image').src = photo.src;
    $('#gallery-large-image').alt = photo.alt;
    $('#gallery-counter').textContent = `${photoIndex + 1} of ${photos.length}`;
    $('#gallery-caption-title').textContent = photo.title;
    $('#gallery-caption-description').textContent = photo.description;
    $$('.gallery-thumbnail').forEach((button, i) => button.setAttribute('aria-pressed', String(i === photoIndex)));
    const active = $$('.gallery-thumbnail')[photoIndex];
    active?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
  $$('[data-photo]').forEach(button => button.addEventListener('click', () => {
    renderPhoto(Number(button.dataset.photo));
    openDialog($('#gallery-dialog'));
  }));
  $('.modal-prev').addEventListener('click', () => renderPhoto(photoIndex - 1));
  $('.modal-next').addEventListener('click', () => renderPhoto(photoIndex + 1));
  $('#gallery-dialog').addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); renderPhoto(photoIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); renderPhoto(photoIndex + 1); }
  });
  let touchStart = null;
  $('#gallery-stage').addEventListener('touchstart', event => { touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }, { passive: true });
  $('#gallery-stage').addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) renderPhoto(photoIndex + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  let mobilePhoto = 0;
  function mobileStep(step) {
    mobilePhoto = (Math.round(track.scrollLeft / track.clientWidth) + step + photos.length) % photos.length;
    track.scrollTo({ left: mobilePhoto * track.clientWidth, behavior: 'smooth' });
  }
  $('.gallery-back').addEventListener('click', () => mobileStep(-1));
  $('.gallery-forward').addEventListener('click', () => mobileStep(1));
  track.addEventListener('scroll', () => {
    mobilePhoto = Math.round(track.scrollLeft / track.clientWidth);
    $('#mobile-photo-count').textContent = `${mobilePhoto + 1} / ${photos.length}`;
  }, { passive: true });

  $('#amenities-toggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    $('#extra-amenities').hidden = expanded;
    button.firstChild.textContent = expanded ? 'See all amenities ' : 'Show fewer amenities ';
  });

  let guests = 6;
  const guestToggle = $('#guest-toggle');
  function setGuestPopover(open) { $('#guest-popover').hidden = !open; guestToggle.setAttribute('aria-expanded', String(open)); }
  guestToggle.addEventListener('click', () => setGuestPopover($('#guest-popover').hidden));
  $('#guest-done').addEventListener('click', () => { setGuestPopover(false); guestToggle.focus(); });
  function renderGuests() {
    const label = `${guests} traveller${guests === 1 ? '' : 's'}`;
    $('#guest-count').value = guests;
    $('#guest-count').textContent = guests;
    $('#guest-summary').textContent = label;
    $('#search-guests').textContent = label;
    $('[data-guest-step="-1"]').disabled = guests <= 1;
    $('[data-guest-step="1"]').disabled = guests >= 6;
  }
  $$('[data-guest-step]').forEach(button => button.addEventListener('click', () => { guests = Math.max(1, Math.min(6, guests + Number(button.dataset.guestStep))); renderGuests(); }));
  renderGuests();
  document.addEventListener('click', event => { if (!event.target.closest('.guest-field-wrap')) setGuestPopover(false); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#guest-popover').hidden) { setGuestPopover(false); guestToggle.focus(); } });

  const checkIn = $('#check-in');
  const checkOut = $('#check-out');
  function isoDate(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
  const today = new Date();
  checkIn.min = isoDate(today);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1); checkOut.min = isoDate(tomorrow);
  function updateDates() {
    $('#date-message').textContent = '';
    if (checkIn.value) {
      const dayAfter = new Date(`${checkIn.value}T12:00:00`);
      dayAfter.setDate(dayAfter.getDate() + 1);
      checkOut.min = isoDate(dayAfter);
      if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = '';
    }
    const format = value => new Date(`${value}T12:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    $('#search-dates').textContent = checkIn.value && checkOut.value ? `${format(checkIn.value)} – ${format(checkOut.value)}` : checkIn.value ? `${format(checkIn.value)} – Check-out` : 'Select dates';
  }
  checkIn.addEventListener('change', updateDates);
  checkOut.addEventListener('change', updateDates);
  $('#booking-form').addEventListener('submit', event => {
    event.preventDefault();
    if (checkIn.value && checkOut.value && checkOut.value <= checkIn.value) { $('#date-message').textContent = 'Check-out must be after check-in. Even here.'; return; }
    setGuestPopover(false);
    showInfo('booking');
  });
  $('#search-form').addEventListener('submit', event => { event.preventDefault(); $('#booking').scrollIntoView({ behavior: 'smooth', block: 'center' }); checkIn.focus({ preventScroll: true }); });
  $$('[data-focus]').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.focus);
    $('#booking').scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
    if (target === guestToggle) setGuestPopover(true);
  }));

  const navLinks = $$('.section-nav a');
  navLinks.forEach(link => link.addEventListener('click', () => navLinks.forEach(item => item.setAttribute('aria-current', String(item === link)))));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) navLinks.forEach(link => link.setAttribute('aria-current', String(link.hash === `#${visible[0].target.id}`)));
    }, { rootMargin: '-65px 0px -58% 0px', threshold: [0, .1, .3] });
    ['overview', 'amenities', 'location', 'policies', 'reviews'].forEach(id => observer.observe(document.getElementById(id)));
  }
  $$('img').forEach(img => img.addEventListener('error', () => {
    if (img.closest('.map-picture')) { img.style.display = 'none'; return; }
    img.style.background = '#f6f3ee';
  }));
})();
