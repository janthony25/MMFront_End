// ===== MOBMEK ONLINE BOOKING =====
//
// Talks to the workshop API's anonymous booking endpoints. Set this to wherever the API is
// hosted — it is the only thing that needs changing when the backend moves off localhost.
// Local Docker stack: http://localhost:8080/api
const API_BASE_URL = 'http://localhost:8080/api';

const el = {
    booking: document.getElementById('booking'),
    dayStrip: document.getElementById('dayStrip'),
    slotGrid: document.getElementById('slotGrid'),
    weekLabel: document.getElementById('weekLabel'),
    prevWeek: document.getElementById('prevWeek'),
    nextWeek: document.getElementById('nextWeek'),
    detailsStep: document.getElementById('detailsStep'),
    chosenSummary: document.getElementById('chosenSummary'),
    form: document.getElementById('bookingForm'),
    formError: document.getElementById('formError'),
    slotTaken: document.getElementById('slotTaken'),
    submit: document.getElementById('submitBooking'),
    success: document.getElementById('bookingSuccess'),
    successTime: document.getElementById('successTime'),
    successRef: document.getElementById('successRef'),
};

// The earliest bookable day, as the *server* sees it — the workshop is in New Zealand and the
// visitor may not be, so "today" is never taken from the browser clock.
let earliestDate = null;
let currentFrom = null;
let availability = null;
let selectedDate = null;
let selectedSlot = null;

// ---------- date helpers ----------
// Dates are handled as plain "YYYY-MM-DD" strings, parsed at UTC noon so that no local
// timezone or daylight-saving shift can roll one onto the neighbouring day.

function parseDate(text) {
    const [year, month, day] = text.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, 12));
}

function formatDate(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(text, count) {
    const date = parseDate(text);
    date.setUTCDate(date.getUTCDate() + count);
    return formatDate(date);
}

function labelFor(text, options) {
    return parseDate(text).toLocaleDateString('en-NZ', { timeZone: 'UTC', ...options });
}

// ---------- rendering ----------

function showMessage(container, message, isError) {
    container.innerHTML = '';
    const notice = document.createElement('p');
    notice.className = 'booking-notice' + (isError ? ' booking-notice--error' : '');
    notice.textContent = message;
    container.appendChild(notice);
}

// Sunday trading isn't guaranteed, so it's never a bookable day on the grid (the API always
// reports it closed) — but rather than a dead-end "Closed" label, point the visitor at the
// phone. Built with the DOM API rather than showMessage()'s textContent, since this one
// needs a clickable tel: link.
function isSunday(dateText) {
    return parseDate(dateText).getUTCDay() === 0;
}

function showSundayNotice(container) {
    container.innerHTML = '';
    const notice = document.createElement('p');
    notice.className = 'booking-notice';

    notice.append(
        "We're not always open on Sundays, so it's not bookable online. Call or text us on ",
    );
    const link = document.createElement('a');
    link.href = 'tel:+64224261587';
    link.textContent = '(+64) 22 426 1587';
    notice.append(link, ' and we\'ll let you know if we can fit you in.');

    container.appendChild(notice);
}

function renderWeekLabel() {
    const from = availability.fromDate;
    const to = availability.toDate;
    const sameMonth = from.slice(0, 7) === to.slice(0, 7);

    el.weekLabel.textContent =
        labelFor(from, { day: 'numeric', month: sameMonth ? undefined : 'short' }) +
        ' – ' +
        labelFor(to, { day: 'numeric', month: 'short', year: 'numeric' });

    el.prevWeek.disabled = currentFrom <= earliestDate;
    el.nextWeek.disabled = addDays(currentFrom, 7) > addDays(earliestDate, 56);
}

function renderDays() {
    el.dayStrip.innerHTML = '';

    availability.days.forEach((day) => {
        const openSlots = day.slots.filter((slot) => slot.available).length;
        const sunday = isSunday(day.date);
        const button = document.createElement('button');

        button.type = 'button';
        button.className = 'booking-day' + (sunday ? ' booking-day--maybe' : '');
        // Sunday stays clickable even though it's never bookable — clicking it is how the
        // visitor reaches the "call us" notice, rather than a dead, disabled tile.
        button.disabled = !sunday && (!day.open || openSlots === 0);
        button.setAttribute('aria-pressed', String(day.date === selectedDate));
        if (day.date === selectedDate) {
            button.classList.add('is-selected');
        }

        const weekday = document.createElement('span');
        weekday.className = 'booking-day-name';
        weekday.textContent = labelFor(day.date, { weekday: 'short' });

        const number = document.createElement('span');
        number.className = 'booking-day-num';
        number.textContent = labelFor(day.date, { day: 'numeric' });

        const note = document.createElement('span');
        note.className = 'booking-day-note';
        if (sunday) {
            note.textContent = 'Call to check';
        } else if (!day.open) {
            note.textContent = 'Closed';
        } else if (openSlots === 0) {
            note.textContent = 'Full';
        } else {
            note.textContent = 'Available';
        }

        button.append(weekday, number, note);
        button.addEventListener('click', () => selectDay(day.date));
        el.dayStrip.appendChild(button);
    });
}

function renderSlots() {
    if (!selectedDate) {
        showMessage(el.slotGrid, 'Pick a day above to see available times.', false);
        return;
    }

    if (isSunday(selectedDate)) {
        showSundayNotice(el.slotGrid);
        return;
    }

    const day = availability.days.find((d) => d.date === selectedDate);
    if (!day || !day.open) {
        showMessage(el.slotGrid, 'We are closed that day. Please choose another.', false);
        return;
    }

    const open = day.slots.filter((slot) => slot.available);
    if (open.length === 0) {
        showMessage(el.slotGrid, 'That day is fully booked. Please choose another.', false);
        return;
    }

    el.slotGrid.innerHTML = '';
    open.forEach((slot) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'booking-slot';
        button.textContent = slot.startLocal;
        button.setAttribute('aria-pressed', String(slot.startUtc === selectedSlot?.startUtc));
        if (slot.startUtc === selectedSlot?.startUtc) {
            button.classList.add('is-selected');
        }
        button.addEventListener('click', () => selectSlot(slot));
        el.slotGrid.appendChild(button);
    });
}

// ---------- interactions ----------

function selectDay(date) {
    selectedDate = date;
    selectedSlot = null;
    el.detailsStep.hidden = true;
    el.slotTaken.hidden = true;
    renderDays();
    renderSlots();
}

function selectSlot(slot) {
    selectedSlot = slot;
    renderSlots();

    el.chosenSummary.textContent =
        labelFor(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' }) +
        ' at ' + slot.startLocal;

    el.detailsStep.hidden = false;
    el.detailsStep.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- data ----------

async function readError(response) {
    try {
        const body = await response.json();
        if (body && body.detail) {
            return body.detail;
        }
    } catch {
        // Non-JSON error body (a proxy error page, say) — fall through to the generic text.
    }
    if (response.status === 429) {
        return 'Too many requests just now. Please wait a moment and try again.';
    }
    return 'Something went wrong. Please try again, or call us on (+64) 22 426 1587.';
}

async function loadAvailability(from) {
    showMessage(el.slotGrid, 'Loading available times…', false);

    const query = from ? '?from=' + from + '&to=' + addDays(from, 6) : '';

    let response;
    try {
        response = await fetch(API_BASE_URL + '/public/booking/availability' + query);
    } catch {
        // Network-level failure: wrong API URL, server down, or CORS refusing the origin.
        showMessage(
            el.slotGrid,
            "We couldn't load available times. Please call us on (+64) 22 426 1587.",
            true,
        );
        el.dayStrip.innerHTML = '';
        el.weekLabel.textContent = 'Unavailable';
        return;
    }

    if (!response.ok) {
        showMessage(el.slotGrid, await readError(response), true);
        return;
    }

    availability = await response.json();
    currentFrom = availability.fromDate;
    if (!earliestDate) {
        earliestDate = availability.fromDate;
    }

    // The chosen day may not exist in the newly loaded week.
    if (!availability.days.some((day) => day.date === selectedDate)) {
        selectedDate = null;
        selectedSlot = null;
        el.detailsStep.hidden = true;
    }

    renderWeekLabel();
    renderDays();
    renderSlots();
}

// Deliberately loose: one @, a dot-separated domain, no spaces. Anything stricter starts
// rejecting addresses that are perfectly valid, and the server validates too.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function upper(id) {
    return document.getElementById(id).value.trim().toUpperCase();
}

async function submitBooking(event) {
    event.preventDefault();
    if (!selectedSlot) {
        return;
    }

    const firstName = upper('booking-firstname');
    const lastName = upper('booking-lastname');
    const email = document.getElementById('booking-email').value.trim();

    const payload = {
        startUtc: selectedSlot.startUtc,
        // The API keeps a single contact name, so the two fields are joined back together.
        contactName: (firstName + ' ' + lastName).trim(),
        contactPhone: document.getElementById('booking-phone').value.trim(),
        contactEmail: email,
        vehicleDescription: upper('booking-rego'),
        serviceNeeded: document.getElementById('booking-service').value,
        notes: upper('booking-notes') || null,
    };

    if (!firstName || !lastName || !payload.contactPhone || !email ||
        !payload.vehicleDescription || !payload.serviceNeeded) {
        el.formError.textContent = 'Please fill in every field except the last one.';
        el.formError.hidden = false;
        return;
    }

    if (!EMAIL_PATTERN.test(email)) {
        el.formError.textContent = 'Please enter a valid email address, e.g. you@example.com.';
        el.formError.hidden = false;
        document.getElementById('booking-email').focus();
        return;
    }

    el.formError.hidden = true;
    el.submit.disabled = true;
    el.submit.textContent = 'Sending…';

    try {
        const response = await fetch(API_BASE_URL + '/public/booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            // 409 means someone else booked this exact time while the form was being filled in.
            // Send them back to the grid with a clear reason rather than leaving an error
            // buried under a form whose chosen time no longer exists.
            if (response.status === 409) {
                const taken = selectedSlot.startLocal;
                selectedSlot = null;
                el.formError.hidden = true;
                el.detailsStep.hidden = true;

                await loadAvailability(currentFrom);

                el.slotTaken.textContent =
                    'Sorry — someone else booked ' + taken + ' just before you. ' +
                    'That time has been taken off the list. Please pick another time below.';
                el.slotTaken.hidden = false;
                el.slotTaken.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            el.formError.textContent = await readError(response);
            el.formError.hidden = false;
            return;
        }

        const booking = await response.json();
        el.successTime.textContent =
            labelFor(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' }) +
            ' at ' + booking.startLocal;
        el.successRef.textContent = 'Reference: ' + booking.referenceId.slice(0, 8).toUpperCase();

        el.booking.hidden = true;
        el.success.hidden = false;
        el.success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch {
        el.formError.textContent =
            "We couldn't send your booking. Please call us on (+64) 22 426 1587.";
        el.formError.hidden = false;
    } finally {
        el.submit.disabled = false;
        el.submit.textContent = 'Confirm This Booking';
    }
}

// ---------- wire up ----------

el.prevWeek.addEventListener('click', () => loadAvailability(addDays(currentFrom, -7)));
el.nextWeek.addEventListener('click', () => loadAvailability(addDays(currentFrom, 7)));
el.form.addEventListener('submit', submitBooking);

el.booking.hidden = false;
loadAvailability(null);
