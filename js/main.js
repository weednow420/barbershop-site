/**
 * ПРОСТАЯ ПАРИКМАХЕРСКАЯ — «КАК НА ЛИСТОЧКЕ»
 * Логика тетрадного листочка и голубиной почты 🕊️
 */

document.addEventListener('DOMContentLoaded', () => {
  initTelegram();
  initPigeonBooking();
  initAutoDate();
});

// 1. Инициализация Telegram Mini App
function initTelegram() {
  if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    // Автоподстановка имени из профиля Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      const u = tg.initDataUnsafe.user;
      const nameField = document.getElementById('clientName');
      if (nameField && !nameField.value) {
        nameField.value = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.username || '';
      }
    }
  }
}

// 2. Установка сегодняшней даты в штамп на листочке
function initAutoDate() {
  const dateStamp = document.getElementById('dateStamp');
  const dateInput = document.getElementById('visitDate');

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  if (dateStamp) {
    dateStamp.textContent = `«${day}» / ${month} / ${year} г.`;
  }
  if (dateInput) {
    dateInput.min = `${year}-${month}-${day}`;
    dateInput.value = `${year}-${month}-${day}`;
  }
}

// 3. Отправка записи голубем 🕊️
function initPigeonBooking() {
  const form = document.getElementById('pigeonForm');
  const pigeonBtn = document.getElementById('pigeonBtn');
  const stamp = document.getElementById('deliveredStamp');
  const successCard = document.getElementById('successCard');
  const summaryDetails = document.getElementById('summaryDetails');
  const skyOverlay = document.getElementById('skyOverlay');

  if (!form || !pigeonBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const date = document.getElementById('visitDate').value;
    const time = document.getElementById('visitTime').value;

    // Сбор выбранных услуг
    const checkedBoxes = document.querySelectorAll('input[name="services"]:checked');
    const selectedServices = Array.from(checkedBoxes).map(cb => cb.value);

    if (!name || !phone) {
      alert('Черкните, пожалуйста, имя и телефончик на листочке!');
      return;
    }

    if (selectedServices.length === 0) {
      alert('Поставьте галочку хотя бы напротив одной услуги :)');
      return;
    }

    // Блокируем кнопку на время полёта
    pigeonBtn.disabled = true;
    pigeonBtn.innerHTML = '<span>Голубь взлетает... 🕊️</span>';

    // Telegram Haptic Feedback (вибрация смартфона)
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }

    // Запуск анимации голубя
    launchPigeon(skyOverlay, () => {
      // По прилёту голубя
      if (stamp) stamp.style.display = 'block';

      if (summaryDetails) {
        summaryDetails.innerHTML = `
          <strong>Гость:</strong> ${escapeHtml(name)} (${escapeHtml(phone)})<br>
          <strong>Что делаем:</strong> ${escapeHtml(selectedServices.join(', '))}<br>
          <strong>Когда ждём:</strong> ${escapeHtml(date)} в ${escapeHtml(time)}
        `;
      }

      if (successCard) successCard.style.display = 'block';

      pigeonBtn.style.display = 'none';

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      // Плавный скролл к подтверждению
      successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

// 4. Отрисовка и полёт голубя через экран
function launchPigeon(container, onComplete) {
  if (!container) {
    if (onComplete) onComplete();
    return;
  }

  container.innerHTML = `
    <div class="pigeon-flight flying" id="animatedPigeon">
      <svg viewBox="0 0 120 100" width="130" height="110" style="filter: drop-shadow(0 8px 12px rgba(0,0,0,0.25));">
        <!-- Тело голубя -->
        <path d="M20,60 Q45,35 70,45 Q95,45 105,35 Q110,40 100,55 Q85,75 55,75 Q30,75 20,60 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
        <!-- Крыло взмахивающееся -->
        <path d="M45,50 Q60,10 85,15 Q65,40 50,55 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2">
          <animateTransform attributeName="transform" type="rotate" values="0 50 55; -35 50 55; 0 50 55" dur="0.25s" repeatCount="indefinite"/>
        </path>
        <!-- Хвост -->
        <path d="M10,65 L25,58 L22,70 Z" fill="#94a3b8"/>
        <!-- Глаз -->
        <circle cx="98" cy="42" r="2.5" fill="#1e293b"/>
        <!-- Клюв -->
        <polygon points="105,42 118,46 106,49" fill="#f59e0b"/>
        <!-- Письмо в клюве -->
        <g transform="translate(108, 46) rotate(15)">
          <rect width="18" height="13" rx="2" fill="#fffdfa" stroke="#b91c1c" stroke-width="1.2"/>
          <line x1="0" y1="0" x2="9" y2="7" stroke="#b91c1c" stroke-width="1"/>
          <line x1="18" y1="0" x2="9" y2="7" stroke="#b91c1c" stroke-width="1"/>
        </g>
      </svg>
    </div>
  `;

  // Звук хлопанья крыльев через Web Audio API
  playFlapSound();

  setTimeout(() => {
    container.innerHTML = '';
    if (onComplete) onComplete();
  }, 2700);
}

// 5. Синтез легкого звукового эффекта шелеста / хлопанья крыльев
function playFlapSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // 3 легких хлопка крыльев
    [0, 0.25, 0.5, 0.75].forEach(time => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime + time);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + time + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + time + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + time);
      osc.stop(ctx.currentTime + time + 0.13);
    });
  } catch (_) {}
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
