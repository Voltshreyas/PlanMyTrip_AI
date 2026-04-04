// ===== PAYMENT MODE SELECTION =====
let selectedPayment = null;

function selectPayment(method, animate) {
    selectedPayment = method;
    tripState.selectedPayment = method;
    
    const mapping = {
        card: 'pay-card-btn',
        netbanking: 'pay-netbank-btn',
        upi: 'pay-upi-btn'
    };

    Object.entries(mapping).forEach(([key, btnId]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        if (key === method) {
            btn.classList.add('border-2', 'border-blue-500', 'bg-blue-50');
            btn.classList.remove('border', 'border-gray-300', 'bg-white');
        } else {
            btn.classList.remove('border-2', 'border-blue-500', 'bg-blue-50');
            btn.classList.add('border', 'border-gray-300', 'bg-white');
        }
    });

    if (animate) {
        const btn = document.getElementById(mapping[method]);
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 150);
        }
    }
}

// ===== PAYMENT MODAL HANDLERS =====
function showNetBankingModal() {
    const modal = document.getElementById('netbanking-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('netbank-user')?.focus();
    }
}

function closeNetBankingModal() {
    const modal = document.getElementById('netbanking-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function confirmNetBanking() {
    const bank = document.getElementById('netbank-select').value;
    const user = document.getElementById('netbank-user').value;

    if (!user.trim()) {
        alert('Please enter your bank user ID');
        return;
    }

    alert(`Proceeding with ${bank.toUpperCase()} net banking...`);
    closeNetBankingModal();
    setTimeout(finalizeBooking, 500);
}

function showBhimModal() {
    const modal = document.getElementById('bhim-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('upi-id')?.focus();
    }
}

function closeBhimModal() {
    const modal = document.getElementById('bhim-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function confirmBhim() {
    const upi = document.getElementById('upi-id').value;

    if (!upi.trim() || !upi.includes('@')) {
        alert('Please enter a valid UPI ID (e.g., yourname@bank)');
        return;
    }

    alert(`Processing UPI payment from ${upi}...`);
    closeBhimModal();
    setTimeout(finalizeBooking, 500);
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeNetBankingModal();
        closeBhimModal();
    }
});

// ===== BOOKING FUNCTIONS =====
function handleBooking() {
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }

    if (selectedPayment === 'card') {
        alert('Processing card payment (demo)...');
        setTimeout(finalizeBooking, 800);
    }
}
