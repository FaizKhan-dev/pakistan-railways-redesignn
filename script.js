const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {

    // Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active')
                ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }

    // Accessibility
    let currentFontSize = 1;
    const fontIncrease = document.getElementById('fontIncrease');
    const fontDecrease = document.getElementById('fontDecrease');
    const highContrast = document.getElementById('highContrast');
    const screenReader = document.getElementById('screenReader');

    if (fontIncrease) fontIncrease.addEventListener('click', () => {
        if (currentFontSize < 1.4) { currentFontSize += 0.1; document.body.style.fontSize = currentFontSize + 'em'; }
    });
    if (fontDecrease) fontDecrease.addEventListener('click', () => {
        if (currentFontSize > 0.8) { currentFontSize -= 0.1; document.body.style.fontSize = currentFontSize + 'em'; }
    });
    if (highContrast) {
        highContrast.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast-mode');
            localStorage.setItem('highContrast', document.body.classList.contains('high-contrast-mode'));
            highContrast.innerHTML = document.body.classList.contains('high-contrast-mode')
                ? '<i class="fas fa-adjust"></i> Normal' : '<i class="fas fa-adjust"></i>';
        });
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast-mode');
            highContrast.innerHTML = '<i class="fas fa-adjust"></i> Normal';
        }
    }
    if (screenReader) screenReader.addEventListener('click', () =>
        speakText("Pakistan Railways website. Use Tab key to navigate. Press Enter to select items."));

    // Date/Time
    function updateDateTime() {
        const now = new Date();
        const el = document.getElementById('currentDateTime');
        if (el) el.textContent = now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })
            + ' - ' + now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
    }
    updateDateTime(); setInterval(updateDateTime, 60000);

    // ─── LOGIN — real API ───
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            if (!username || !password) { showAlert('Please enter both username and password', 'error'); return; }
            showAlert('Logging in...', 'info');
            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('prToken', data.token);
                    localStorage.setItem('prUser', JSON.stringify(data.user));
                    showAlert('✅ ' + data.message, 'success');
                    loginForm.reset();
                } else { showAlert('❌ ' + data.message, 'error'); }
            } catch (err) { showAlert('❌ Cannot connect to server. Make sure it is running.', 'error'); }
        });
    }

    // Register link
    const registerLink = document.querySelector('.register-link a');
    if (registerLink) {
        registerLink.addEventListener('click', async function (e) {
            e.preventDefault();
            const username = prompt('Choose a username:');
            const email = prompt('Enter your email:');
            const password = prompt('Choose a password (min 6 chars):');
            const fullName = prompt('Enter your full name:');
            if (!username || !email || !password) { showAlert('Registration cancelled.', 'error'); return; }
            showAlert('Registering...', 'info');
            try {
                const res = await fetch(`${API_BASE}/auth/register`, {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ username, email, password, fullName })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('prToken', data.token);
                    localStorage.setItem('prUser', JSON.stringify(data.user));
                    showAlert('✅ ' + data.message + ' Welcome, ' + data.user.username + '!', 'success');
                } else { showAlert('❌ ' + data.message, 'error'); }
            } catch (err) { showAlert('❌ Cannot connect to server.', 'error'); }
        });
    }

    // ─── FIND TRAINS — real API ───
    const journeyDateInput = document.getElementById('journeyDate');
    if (journeyDateInput) {
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        journeyDateInput.min = new Date().toISOString().split('T')[0];
        journeyDateInput.value = tomorrow.toISOString().split('T')[0];
    }

    const findTrainsBtn = document.querySelector('.btn-find-trains');
    if (findTrainsBtn) {
        findTrainsBtn.addEventListener('click', async function () {
            const from = document.getElementById('fromStation').value;
            const to = document.getElementById('toStation').value;
            const date = document.getElementById('journeyDate').value;
            const trainClass = document.getElementById('trainClass').value;
            const passengers = document.getElementById('passengers').value;
            if (!from || !to || !date) { showAlert('Please select stations and journey date', 'error'); return; }
            if (from === to) { showAlert('From and To stations cannot be the same', 'error'); return; }
            const orig = findTrainsBtn.innerHTML;
            findTrainsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            findTrainsBtn.disabled = true;
            try {
                const res = await fetch(`${API_BASE}/trains/search?from=${from}&to=${to}&trainClass=${trainClass}`);
                const data = await res.json();
                findTrainsBtn.innerHTML = orig; findTrainsBtn.disabled = false;
                if (data.success) {
                    if (data.count === 0) showAlert('No trains found for this route. Try a different route.', 'error');
                    else showTrainResults(data.trains, from, to, date, passengers);
                } else { showAlert('❌ ' + data.message, 'error'); }
            } catch (err) {
                findTrainsBtn.innerHTML = orig; findTrainsBtn.disabled = false;
                showAlert('❌ Cannot connect to server. Make sure it is running.', 'error');
            }
        });
    }

    function showTrainResults(trains, from, to, date, passengers) {
        let existing = document.getElementById('trainResultsSection');
        if (existing) existing.remove();
        const section = document.createElement('div');
        section.id = 'trainResultsSection';
        section.style.cssText = 'background:#fff;border:1px solid #ddd;border-radius:8px;padding:20px;margin-top:20px;';
        section.innerHTML = `
            <h3 style="color:#006633;margin-bottom:15px;">
                <i class="fas fa-train"></i> ${trains.length} Train(s) Found &mdash; ${getStationName(from)} &rarr; ${getStationName(to)} on ${date}
            </h3>
            ${trains.map(t => `
                <div style="border:1px solid #eee;border-radius:6px;padding:15px;margin-bottom:12px;background:#f9f9f9;">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                        <div>
                            <strong style="font-size:1.05em;color:#006633;">${t.trainName}</strong>
                            <span style="color:#888;font-size:0.9em;margin-left:10px;">#${t.trainNumber}</span><br>
                            <span style="font-size:0.9em;">
                                <i class="fas fa-clock"></i> Departs: <strong>${t.departureTime}</strong>
                                &nbsp;|&nbsp;
                                <span style="color:${t.status==='On Time'?'green':'#c00'};">
                                    ${t.status}${t.delay>0?' ('+t.delay+' min)':''}
                                </span>
                            </span>
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:8px;">
                            ${t.classes.map(cls => `
                                <div style="background:#006633;color:white;padding:8px 12px;border-radius:5px;text-align:center;font-size:0.85em;">
                                    <div style="font-weight:600;">${cls.className}</div>
                                    <div>PKR ${(cls.fare*Number(passengers)).toLocaleString()}</div>
                                    <div style="font-size:0.8em;">${cls.availableSeats} seats</div>
                                    <button onclick="openBookingModal('${t._id}','${t.trainName}','${cls.className}',${cls.fare},${passengers},'${date}')"
                                        style="background:white;color:#006633;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;margin-top:4px;font-weight:600;font-size:0.85em;">
                                        Book
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}`;
        const bc = document.querySelector('.booking-container');
        if (bc) { bc.insertAdjacentElement('afterend', section); section.scrollIntoView({ behavior:'smooth', block:'start' }); }
    }

    // ─── BOOKING MODAL ───
    window.openBookingModal = function (trainId, trainName, className, fare, passengers, date) {
        let m = document.getElementById('bookingModal'); if (m) m.remove();
        m = document.createElement('div'); m.id = 'bookingModal';
        m.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
        const total = fare * passengers;
        m.innerHTML = `
            <div style="background:white;padding:30px;border-radius:10px;width:90%;max-width:480px;max-height:90vh;overflow-y:auto;position:relative;">
                <button onclick="document.getElementById('bookingModal').remove()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:22px;cursor:pointer;color:#888;">&#x2715;</button>
                <h3 style="color:#006633;margin-bottom:5px;"><i class="fas fa-ticket-alt"></i> Book Ticket</h3>
                <p style="color:#555;margin-bottom:15px;font-size:0.9em;">
                    ${trainName} | ${className} | ${date} | ${passengers} passenger(s)<br>
                    <strong>Total: PKR ${total.toLocaleString()}</strong>
                </p>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <input id="bk_name" type="text" placeholder="Full Name *" style="padding:10px;border:1px solid #ccc;border-radius:5px;font-size:0.95em;">
                    <input id="bk_cnic" type="text" placeholder="CNIC (e.g. 42101-1234567-1) *" style="padding:10px;border:1px solid #ccc;border-radius:5px;font-size:0.95em;">
                    <input id="bk_email" type="email" placeholder="Email Address *" style="padding:10px;border:1px solid #ccc;border-radius:5px;font-size:0.95em;">
                    <input id="bk_phone" type="text" placeholder="Phone Number (optional)" style="padding:10px;border:1px solid #ccc;border-radius:5px;font-size:0.95em;">
                    <button id="confirmBookingBtn" onclick="submitBooking('${trainId}','${className}',${fare},${passengers},'${date}')"
                        style="background:#006633;color:white;border:none;padding:12px;border-radius:5px;font-size:1em;cursor:pointer;font-weight:600;margin-top:5px;">
                        <i class="fas fa-check-circle"></i> Confirm Booking &mdash; PKR ${total.toLocaleString()}
                    </button>
                </div>
            </div>`;
        document.body.appendChild(m);
    };

    window.submitBooking = async function (trainId, selectedClass, fare, passengers, journeyDate) {
        const name = document.getElementById('bk_name').value.trim();
        const cnic = document.getElementById('bk_cnic').value.trim();
        const email = document.getElementById('bk_email').value.trim();
        const phone = document.getElementById('bk_phone').value.trim();
        if (!name || !cnic || !email) { showAlert('Please fill name, CNIC and email', 'error'); return; }
        const btn = document.getElementById('confirmBookingBtn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; btn.disabled = true;
        try {
            const res = await fetch(`${API_BASE}/bookings`, {
                method:'POST', headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ passengerName:name, passengerCnic:cnic, passengerEmail:email,
                    passengerPhone:phone, trainId, journeyDate, selectedClass, passengers, quota:'General' })
            });
            const data = await res.json();
            if (data.success) {
                document.getElementById('bookingModal').remove();
                showBookingSuccess(data.booking);
            } else {
                showAlert('❌ ' + data.message, 'error');
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Booking'; btn.disabled = false;
            }
        } catch (err) {
            showAlert('❌ Cannot connect to server.', 'error');
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Confirm Booking'; btn.disabled = false;
        }
    };

    function showBookingSuccess(b) {
        let e = document.getElementById('bookingSuccessCard'); if (e) e.remove();
        const card = document.createElement('div'); card.id = 'bookingSuccessCard';
        card.style.cssText = 'background:#d4edda;border:2px solid #28a745;border-radius:10px;padding:20px;margin:20px 0;text-align:center;';
        card.innerHTML = `
            <div style="font-size:2em;color:#28a745;">&#x2705;</div>
            <h3 style="color:#155724;margin:10px 0;">Booking Confirmed!</h3>
            <p style="font-size:1.1em;">PNR: <strong style="font-size:1.2em;color:#006633;">${b.pnr}</strong></p>
            <p>${b.trainName} | ${b.class} | ${b.passengers} passenger(s)</p>
            <p>Date: ${new Date(b.date).toDateString()}</p>
            <p><strong>Total: PKR ${b.totalFare.toLocaleString()}</strong></p>
            <p style="font-size:0.85em;color:#555;margin-top:10px;">Keep your PNR safe for booking verification.</p>`;
        const rs = document.getElementById('trainResultsSection');
        const target = rs || document.querySelector('.booking-container');
        target.insertAdjacentElement('afterend', card);
        card.scrollIntoView({ behavior:'smooth' });
    }

    // ─── FEEDBACK — real API ───
    const stars = document.querySelectorAll('.stars i');
    let currentRating = 0;
    function updateStars(r) {
        stars.forEach((s,i) => {
            s.style.color = i < r ? '#FFC107' : '#ddd';
            if (i < r) { s.classList.add('fas'); s.classList.remove('far'); }
            else { s.classList.add('far'); s.classList.remove('fas'); }
        });
    }
    stars.forEach(star => {
        star.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-rating'));
            updateStars(currentRating);
            const rt = document.getElementById('ratingText'); if (rt) rt.textContent = currentRating + '/5';
        });
        star.addEventListener('mouseover', function () {
            const r = parseInt(this.getAttribute('data-rating'));
            stars.forEach((s,i) => { s.style.color = i < r ? '#FFC107' : '#ddd'; });
        });
        star.addEventListener('mouseout', () => updateStars(currentRating));
    });

    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('feedbackEmail').value.trim();
            const message = document.getElementById('feedbackMessage').value.trim();
            if (!email || !message || currentRating === 0) { showAlert('Please fill email, message and rating', 'error'); return; }
            if (!isValidEmail(email)) { showAlert('Please enter a valid email address', 'error'); return; }
            const btn = feedbackForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...'; btn.disabled = true;
            try {
                const res = await fetch(`${API_BASE}/feedback`, {
                    method:'POST', headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({ email, message, rating: currentRating })
                });
                const data = await res.json();
                if (data.success) {
                    showAlert('✅ ' + data.message, 'success');
                    feedbackForm.reset(); updateStars(0); currentRating = 0;
                    const rt = document.getElementById('ratingText'); if (rt) rt.textContent = '0/5';
                } else { showAlert('❌ ' + data.message, 'error'); }
            } catch (err) { showAlert('❌ Cannot connect to server.', 'error'); }
            finally { btn.innerHTML = orig; btn.disabled = false; }
        });
    }

    // Book Now scroll
    const bookNowBtn = document.querySelector('.btn-book-now');
    if (bookNowBtn) bookNowBtn.addEventListener('click', () =>
        document.getElementById('fromStation').scrollIntoView({ behavior:'smooth' }));

    // Dropdown mobile
    document.querySelectorAll('.dropdown > a').forEach(d => {
        d.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const m = this.nextElementSibling;
                m.style.display = m.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    document.addEventListener('click', function (e) {
        if (!e.target.matches('.dropdown > a'))
            document.querySelectorAll('.dropdown-menu').forEach(m => { if (window.innerWidth <= 768) m.style.display = 'none'; });
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') document.body.classList.add('keyboard-navigation');
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
            document.querySelectorAll('.custom-alert').forEach(a => a.remove());
            const modal = document.getElementById('bookingModal'); if (modal) modal.remove();
        }
    });
    document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-navigation'));

    simulateCounter();

    // Helpers
    function showAlert(message, type) {
        const existing = document.querySelector('.custom-alert'); if (existing) existing.remove();
        const a = document.createElement('div'); a.className = 'custom-alert alert-' + type;
        const bg = type==='error'?'#DC3545':type==='success'?'#28a745':'#17a2b8';
        a.style.cssText = `position:fixed;top:20px;right:20px;padding:15px 20px;border-radius:5px;color:white;font-weight:500;z-index:10000;display:flex;align-items:center;justify-content:space-between;min-width:300px;max-width:420px;background:${bg};`;
        a.innerHTML = `<span>${message}</span><button style="background:none;border:none;color:white;font-size:20px;cursor:pointer;margin-left:15px;">&times;</button>`;
        a.querySelector('button').addEventListener('click', () => a.remove());
        if (!document.getElementById('alert-styles')) {
            const s = document.createElement('style'); s.id = 'alert-styles';
            s.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
            document.head.appendChild(s);
        }
        document.body.appendChild(a);
        setTimeout(() => { if (a.parentElement) a.remove(); }, 6000);
    }
    function speakText(t) { if ('speechSynthesis' in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance(t)); }
    function getStationName(code) {
        return {'KHI':'Karachi City','LHE':'Lahore Junction','ISB':'Islamabad','RWP':'Rawalpindi',
                'FSD':'Faisalabad','MUX':'Multan Cantt','PWR':'Peshawar Cantt','QTA':'Quetta'}[code] || code;
    }
    function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
    function simulateCounter() {
        const digits = document.querySelectorAll('.counter-digit'); if (!digits.length) return;
        setInterval(() => {
            const i = Math.floor(Math.random() * digits.length);
            digits[i].textContent = (parseInt(digits[i].textContent) + 1) % 10;
            digits[i].style.transform = 'scale(1.2)';
            setTimeout(() => { digits[i].style.transform = 'scale(1)'; }, 300);
        }, 5000);
    }

    const hcStyle = document.createElement('style');
    hcStyle.textContent = `.high-contrast-mode{background:#000!important;color:#FFF!important}.high-contrast-mode a{color:#FFD700!important}.high-contrast-mode .nav-menu a{color:#FFF!important;background:#333!important}.high-contrast-mode .btn-login,.high-contrast-mode .btn-find-trains,.high-contrast-mode .btn-submit-feedback{background:#FFD700!important;color:#000!important;font-weight:bold}`;
    document.head.appendChild(hcStyle);
});
