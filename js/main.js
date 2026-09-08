/* ==========================================
   UNDANGAN DIGITAL ISLAMI & CERAH - JAVASCRIPT
   (Standard Script — Bekerja di file:// dan http://)
   ========================================== */

// --------------------------------------------------
// 1. FIREBASE INITIALIZATION (COMPAT MODE)
// --------------------------------------------------
const firebaseConfig = {
  apiKey:            "AIzaSyCfIe5JXI68YoGrKhaosWJaFtOo3XMmrq4",
  authDomain:        "undangan-riya-rima-50138.firebaseapp.com",
  projectId:         "undangan-riya-rima-50138",
  storageBucket:     "undangan-riya-rima-50138.firebasestorage.app",
  messagingSenderId: "1045223422157",
  appId:             "1:1045223422157:web:ae524cb2e4aa9a5a799184"
};

const COLLECTION_NAME = 'ucapan_riya_rima';

let db = null;
if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
  } catch (e) {
    console.warn('Firebase init warning:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------
   * 2. FALLING PETALS CANVAS ANIMATION
   * -------------------------------------------------- */
  function initFallingPetals() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numPetals = 22;
    const petals = [];

    const colors = [
      'rgba(212, 175, 55, 0.45)',  // Gold
      'rgba(240, 230, 210, 0.55)', // Warm Cream
      'rgba(82, 183, 136, 0.35)',  // Sage Green
      'rgba(255, 215, 0, 0.4)'    // Light Gold
    ];

    for (let i = 0; i < numPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: Math.random() * 8 + 6,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 0.8 - 0.4,
        angle: Math.random() * 360,
        spin: Math.random() * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function drawPetal(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.angle * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size / 2, -p.size, p.size / 3, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, -p.size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin((p.y / 40)) * p.speedX;
        p.angle += p.spin;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        drawPetal(p);
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  initFallingPetals();

  /* --------------------------------------------------
   * 3. SCROLL REVEAL (60FPS ULTRA SMOOTH)
   * -------------------------------------------------- */
  let isTicking = false;

  function handleScrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    if (reveals.length === 0) return;

    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 60) {
        el.classList.add('active');
      }
    });
  }

  function onScrollThrottled() {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        handleScrollReveal();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  window.addEventListener('scroll', onScrollThrottled, { passive: true });
  // Jalankan pemeriksaan awal
  handleScrollReveal();

  // Paksa langsung aktifkan elemen hero & cover
  document.querySelectorAll('#cover-gate .reveal, #hero .reveal').forEach(el => el.classList.add('active'));

  /* --------------------------------------------------
   * 4. URL PARAMETER GUEST NAME DETECTOR (?to=Nama+Tamu)
   * -------------------------------------------------- */
  function setupGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('tamu');

    const guestNameCover = document.getElementById('guest-name-cover');
    const guestNameHero  = document.getElementById('guest-name-hero');
    const rsvpInputName  = document.getElementById('rsvp-nama');

    if (guestParam) {
      const cleanName = decodeURIComponent(guestParam.replace(/\+/g, ' '));
      if (guestNameCover) guestNameCover.textContent = cleanName;
      if (guestNameHero)  guestNameHero.textContent = cleanName;
      if (rsvpInputName)  rsvpInputName.value = cleanName;
    } else {
      if (guestNameCover) guestNameCover.textContent = "Tamu Undangan";
      if (guestNameHero)  guestNameHero.textContent = "Tamu Undangan";
    }
  }
  setupGuestName();

  /* --------------------------------------------------
   * 5. COVER GATE & AUDIO PLAYER
   * -------------------------------------------------- */
  const coverGate   = document.getElementById('cover-gate');
  const btnOpen     = document.getElementById('btn-open-invitation');
  const audio       = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying     = false;

  document.body.classList.add('lock-scroll');

  function openInvitation() {
    if (coverGate) coverGate.classList.add('opened');
    document.body.classList.remove('lock-scroll');

    // Aktifkan elemen hero & periksa scroll reveal
    document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('active'));
    handleScrollReveal();

    playAudio();

    const heroSec = document.getElementById('hero');
    if (heroSec) {
      heroSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Expose global agar tombol onclick HTML juga bisa panggil
  window.openEnvelopeDirectly = openInvitation;

  if (btnOpen) {
    btnOpen.addEventListener('click', openInvitation);
  }

  function playAudio() {
    if (audio) {
      audio.play().then(() => {
        isPlaying = true;
        if (musicToggle) {
          musicToggle.classList.add('playing');
          musicToggle.querySelector('i').className = 'fas fa-compact-disc fa-spin';
        }
      }).catch(() => {
        isPlaying = false;
      });
    }
  }

  function pauseAudio() {
    if (audio) {
      audio.pause();
      isPlaying = false;
      if (musicToggle) {
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('i').className = 'fas fa-music';
      }
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });
  }

  /* --------------------------------------------------
   * 6. COUNTDOWN TIMER (TANGGAL 04 OKTOBER 2026)
   * -------------------------------------------------- */
  const targetDate = new Date('2026-10-04T08:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    const daysEl    = document.getElementById('timer-days')    || document.getElementById('cd-days');
    const hoursEl   = document.getElementById('timer-hours')   || document.getElementById('cd-hours');
    const minutesEl = document.getElementById('timer-minutes') || document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('timer-seconds') || document.getElementById('cd-seconds');

    if (difference <= 0) {
      if (daysEl)    daysEl.textContent = '00';
      if (hoursEl)   hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days    = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    if (daysEl)    daysEl.textContent    = String(days).padStart(2, '0');
    if (hoursEl)   hoursEl.textContent   = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Google Calendar Click Event Listener
  const btnCalendar = document.getElementById('btn-add-calendar');
  if (btnCalendar) {
    btnCalendar.addEventListener('click', (e) => {
      const gcalUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Riya+%26+Rima+(Riyadhus+%26+Ukrimatul)&dates=20261004T080000/20261004T130000&details=Undangan+Pernikahan+Riya+%26+Rima+(Riyadhus+Solikhin+%26+Ukrimatul+Azizah).+Minggu,+04+Oktober+2026.+Lokasi:+Klampok+lor+Rt03/Rw02+Kebonagung,+Demak.&location=Klampok+lor+Rt03/Rw02+Kebonagung,+Demak&ctz=Asia/Jakarta";
      if (!btnCalendar.getAttribute('href') || btnCalendar.tagName === 'BUTTON') {
        e.preventDefault();
        window.open(gcalUrl, '_blank');
      }
    });
  }

  /* --------------------------------------------------
   * 7. COPY TO CLIPBOARD & TOAST NOTIFICATION
   * -------------------------------------------------- */
  window.copyText = function (text, message) {
    const successMsg = message || 'No. Rekening ' + text + ' berhasil disalin!';
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopyText(text, successMsg);
      });
    } else {
      fallbackCopyText(text, successMsg);
    }
  };

  function fallbackCopyText(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(message || 'Berhasil disalin!');
    } catch (err) {
      showToast('No. Rekening berhasil disalin: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // Pasang listener untuk semua tombol .btn-copy
  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const num = btn.getAttribute('data-copy') || '1877259288';
      window.copyText(num, 'No. Rekening BNI (' + num + ') berhasil disalin!');
    });
  });

  function showToast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle text-gold me-2"></i> ${msg}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  /* --------------------------------------------------
   * 8. RSVP & UCAPAN FEED (FIREBASE FIRESTORE + FALLBACK)
   * -------------------------------------------------- */
  const rsvpForm   = document.getElementById('rsvp-form');
  const ucapanList = document.getElementById('ucapan-list');
  const submitBtn  = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;

  function formatWaktu(ts) {
    if (!ts) return 'Baru saja';
    let date = ts;
    if (ts.toDate) date = ts.toDate();
    else if (ts.seconds) date = new Date(ts.seconds * 1000);
    else date = new Date(ts);

    const now  = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60)   return 'Baru saja';
    if (diff < 3600) return Math.floor(diff / 60) + ' menit lalu';
    if (diff < 86400) return Math.floor(diff / 3600) + ' jam lalu';
    return Math.floor(diff / 86400) + ' hari lalu';
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }

  function buildUcapanEl(item) {
    const el = document.createElement('div');
    el.className = 'ucapan-item ucapan-new';
    el.innerHTML = `
      <div class="ucapan-header">
        <span class="ucapan-author"><i class="fas fa-user-circle text-gold me-1"></i> ${escapeHtml(item.nama)}</span>
      </div>
      <p class="ucapan-msg">${escapeHtml(item.pesan)}</p>
      <div class="ucapan-time"><i class="far fa-clock"></i> ${formatWaktu(item.createdAt)}</div>
    `;
    setTimeout(() => el.classList.remove('ucapan-new'), 600);
    return el;
  }

  const defaultGreetings = [
    { nama: "Ustadz H. Abdul Malik",    pesan: "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fii khair. Selamat untuk Mas Riya dan Mbak Rima.", createdAt: new Date() },
    { nama: "Keluarga Besar Soko Kidul", pesan: "Selamat atas pernikahan Riya & Rima. Semoga lancar acaranya dan bahagia selalu dunia akhirat.", createdAt: new Date() },
    { nama: "Teman-teman Kebonagung",    pesan: "Masya Allah, ucapan selamat hangat untuk kedua mempelai! Semoga sakinah mawaddah warahmah.", createdAt: new Date() }
  ];

  function renderOfflineFallback() {
    if (!ucapanList) return;
    ucapanList.innerHTML = '';
    defaultGreetings.forEach(item => ucapanList.appendChild(buildUcapanEl(item)));
  }

  // Load Firestore Realtime Listener jika Firebase terhubung
  if (db) {
    try {
      if (ucapanList) {
        ucapanList.innerHTML = `
          <div class="ucapan-loading">
            <i class="fas fa-spinner fa-spin text-gold"></i>
            <span>Memuat ucapan & doa...</span>
          </div>`;
      }

      db.collection(COLLECTION_NAME)
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          if (!ucapanList) return;

          if (snapshot.empty) {
            ucapanList.innerHTML = `
              <div class="ucapan-empty">
                <i class="fas fa-comment-dots text-gold"></i>
                <p>Jadilah yang pertama memberikan ucapan & doa!</p>
              </div>`;
            return;
          }

          ucapanList.innerHTML = '';
          snapshot.forEach(doc => {
            ucapanList.appendChild(buildUcapanEl(doc.data()));
          });
        }, (err) => {
          console.warn('Firestore fallback offline:', err);
          renderOfflineFallback();
        });
    } catch (e) {
      renderOfflineFallback();
    }
  } else {
    renderOfflineFallback();
  }

  // Form Submit Handler
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nama  = document.getElementById('rsvp-nama').value.trim();
      const pesan = document.getElementById('rsvp-pesan').value.trim();

      if (!nama || !pesan) {
        showToast('Mohon lengkapi Nama dan Ucapan Anda.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
      }

      const newUcapan = {
        nama: nama,
        pesan: pesan,
        createdAt: db ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
      };

      if (db) {
        try {
          await db.collection(COLLECTION_NAME).add(newUcapan);
          rsvpForm.reset();
          showToast('✨ Terima kasih! Ucapan & doa Anda telah tersimpan.');
        } catch (err) {
          console.error('Firestore save error:', err);
          showToast('Gagal mengirim ke database online.');
        }
      } else {
        defaultGreetings.unshift(newUcapan);
        renderOfflineFallback();
        rsvpForm.reset();
        showToast('Terima kasih! Ucapan Anda berhasil dikirim.');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Kirim Ucapan & Doa';
      }
    });
  }

  /* --------------------------------------------------
   * 9. SCROLLSPY BOTTOM NAVIGATION
   * -------------------------------------------------- */
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateScrollspy() {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop    = current.offsetTop - 120;
      const sectionId     = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateScrollspy);

});
