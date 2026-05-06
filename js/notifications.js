/**
 * PlanMyTrip — Professional Notification System
 */

function _injectNotificationStyles() {
    if (document.getElementById('pmt-notif-styles')) return;
    const style = document.createElement('style');
    style.id = 'pmt-notif-styles';
    style.textContent = `
        .pmt-notification-container {
            position: fixed;
            top: 1.5rem;
            right: 1.5rem;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            pointer-events: none;
        }

        .pmt-notification {
            min-width: 320px;
            max-width: 450px;
            background: white;
            border-radius: 1rem;
            padding: 1rem 1.25rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border-left: 6px solid #6366f1;
            display: flex;
            align-items: center;
            gap: 1rem;
            pointer-events: auto;
            transform: translateX(120%);
            transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
        }

        .pmt-notification.show { transform: translateX(0); }

        .pmt-notif-icon {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 0.75rem;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .notif-success { border-left-color: #10b981; }
        .notif-success .pmt-notif-icon { background: #dcfce7; color: #059669; }

        .notif-error { border-left-color: #ef4444; }
        .notif-error .pmt-notif-icon { background: #fee2e2; color: #dc2626; }

        .notif-info { border-left-color: #3b82f6; }
        .notif-info .pmt-notif-icon { background: #eff6ff; color: #2563eb; }

        .pmt-notif-body { flex: 1; }
        .pmt-notif-title {
            font-weight: 800;
            color: #1e293b;
            font-size: 0.95rem;
            margin-bottom: 0.15rem;
        }
        .pmt-notif-msg {
            color: #64748b;
            font-size: 0.85rem;
            font-weight: 500;
            line-height: 1.4;
        }

        .pmt-notif-close {
            color: #94a3b8;
            cursor: pointer;
            padding: 0.25rem;
            transition: color 0.2s;
        }
        .pmt-notif-close:hover { color: #1e293b; }

        .pmt-notif-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(0,0,0,0.05);
            width: 100%;
        }
        .pmt-notif-progress-bar {
            height: 100%;
            width: 100%;
            background: currentColor;
            opacity: 0.3;
            transform-origin: left;
        }

        @keyframes progress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
    `;
    document.head.appendChild(style);
}

function showNotification(title, message, type = 'success', duration = 5000) {
    _injectNotificationStyles();

    let container = document.querySelector('.pmt-notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'pmt-notification-container';
        document.body.appendChild(container);
    }

    const notif = document.createElement('div');
    notif.className = `pmt-notification notif-${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'alert-circle';
    if (type === 'info') icon = 'info';

    notif.innerHTML = `
        <div class="pmt-notif-icon">
            <i data-lucide="${icon}"></i>
        </div>
        <div class="pmt-notif-body">
            <div class="pmt-notif-title">${title}</div>
            <div class="pmt-notif-msg">${message}</div>
        </div>
        <i data-lucide="x" class="pmt-notif-close"></i>
        <div class="pmt-notif-progress">
            <div class="pmt-notif-progress-bar" style="animation: progress ${duration}ms linear forwards; color: inherit;"></div>
        </div>
    `;

    container.appendChild(notif);
    if (window.lucide) lucide.createIcons();

    // Trigger animation
    setTimeout(() => notif.classList.add('show'), 10);

    const close = () => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
    };

    notif.querySelector('.pmt-notif-close').onclick = close;
    setTimeout(close, duration);
}

window.pmtNotif = {
    success: (title, msg) => showNotification(title, msg, 'success'),
    error: (title, msg) => showNotification(title, msg, 'error'),
    info: (title, msg) => showNotification(title, msg, 'info')
};
