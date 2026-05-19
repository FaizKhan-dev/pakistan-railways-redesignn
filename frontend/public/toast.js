/**
 * Toast Notification System
 * Provides user-friendly toast notifications with auto-dismiss
 */

const Toast = {
    container: null,
    notificationCount: 0,

    /**
     * Initialize toast container
     */
    init: function() {
        if (!this.container) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 99999;
                max-width: 400px;
                font-family: 'Inter', sans-serif;
            `;
            document.body.appendChild(container);
            this.container = container;
        }
    },

    /**
     * Create and show a toast notification
     */
    show: function(options) {
        this.init();

        const {
            message = '',
            type = 'info',  // 'success', 'error', 'warning', 'info'
            duration = 4000,  // milliseconds
            autoClose = true,
            action = null
        } = options;

        const toastId = `toast-${this.notificationCount++}`;
        const toast = document.createElement('div');
        
        // Color scheme based on type
        const colors = {
            success: { bg: '#d4edda', border: '#28a745', text: '#155724', icon: '✓' },
            error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24', icon: '✕' },
            warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404', icon: '!' },
            info: { bg: '#d1ecf1', border: '#17a2b8', text: '#0c5460', icon: 'ℹ' }
        };

        const color = colors[type] || colors.info;

        toast.id = toastId;
        toast.style.cssText = `
            background-color: ${color.bg};
            border-left: 4px solid ${color.border};
            color: ${color.text};
            padding: 16px;
            margin-bottom: 12px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: flex-start;
            gap: 12px;
            animation: slideInRight 0.3s ease-out;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        `;

        // Toast HTML
        let toastHTML = `
            <div style="flex-shrink: 0; font-weight: bold; font-size: 18px; margin-top: 2px;">
                ${color.icon}
            </div>
            <div style="flex: 1;">
                <p style="margin: 0; font-weight: 500;">${this.escapeHtml(message)}</p>
        `;

        if (action) {
            toastHTML += `
                <button style="
                    background: transparent;
                    border: none;
                    color: ${color.border};
                    cursor: pointer;
                    text-decoration: underline;
                    padding: 0;
                    margin-top: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    padding: 4px 0;
                " id="${toastId}-action">
                    ${action.text}
                </button>
            `;
        }

        toastHTML += `
            </div>
            <button style="
                background: transparent;
                border: none;
                color: ${color.text};
                cursor: pointer;
                padding: 0;
                font-size: 20px;
                flex-shrink: 0;
                opacity: 0.6;
                transition: opacity 0.2s;
            " id="${toastId}-close" aria-label="Close notification">
                ×
            </button>
        `;

        toast.innerHTML = toastHTML;
        this.container.appendChild(toast);

        // Close button handler
        const closeBtn = document.getElementById(`${toastId}-close`);
        closeBtn.addEventListener('click', () => this.remove(toastId));
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.opacity = '1');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.opacity = '0.6');

        // Action button handler
        if (action && action.callback) {
            const actionBtn = document.getElementById(`${toastId}-action`);
            if (actionBtn) {
                actionBtn.addEventListener('click', () => {
                    action.callback();
                    this.remove(toastId);
                });
            }
        }

        // Auto-close
        if (autoClose && duration > 0) {
            setTimeout(() => this.remove(toastId), duration);
        }

        return toastId;
    },

    /**
     * Remove a toast
     */
    remove: function(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => toast.remove(), 300);
        }
    },

    /**
     * Show success toast
     */
    success: function(message, duration = 3000) {
        return this.show({
            message,
            type: 'success',
            duration
        });
    },

    /**
     * Show error toast
     */
    error: function(message, duration = 5000) {
        return this.show({
            message,
            type: 'error',
            duration
        });
    },

    /**
     * Show warning toast
     */
    warning: function(message, duration = 4000) {
        return this.show({
            message,
            type: 'warning',
            duration
        });
    },

    /**
     * Show info toast
     */
    info: function(message, duration = 3000) {
        return this.show({
            message,
            type: 'info',
            duration
        });
    },

    /**
     * Show loading toast (with no auto-close)
     */
    loading: function(message) {
        return this.show({
            message: message || 'Processing...',
            type: 'info',
            autoClose: false
        });
    },

    /**
     * Clear all toasts
     */
    clearAll: function() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: function(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

// Add CSS animations
function addToastStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        /* Mobile responsive */
        @media (max-width: 576px) {
            #toastContainer {
                left: 10px !important;
                right: 10px !important;
                max-width: none !important;
                top: 10px !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToastStyles);
} else {
    addToastStyles();
}

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Toast;
}
