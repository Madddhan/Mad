// Email Management System JavaScript

class EmailManager {
    constructor() {
        this.emails = [];
        this.filteredEmails = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadEmails();
    }

    bindEvents() {
        // Add email button
        document.getElementById('addEmailBtn').addEventListener('click', () => {
            this.addEmail();
        });

        // Enter key on email input
        document.getElementById('emailInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addEmail();
            }
        });

        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadEmails();
        });

        // Filter dropdown
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterEmails();
        });
    }

    async loadEmails() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/emails');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const emails = await response.json();
            this.emails = emails;
            this.filterEmails();
            this.updateStats();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading emails:', error);
            this.showError('Failed to load emails. Please try again.');
            this.showLoading(false);
        }
    }

    async addEmail() {
        const emailInput = document.getElementById('emailInput');
        const email = emailInput.value.trim();

        if (!email) {
            this.showError('Please enter an email address.');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.');
            return;
        }

        try {
            const response = await fetch('/api/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add email');
            }

            // Add to local array
            this.emails.unshift(data);
            this.filterEmails();
            this.updateStats();
            
            // Clear input and show success
            emailInput.value = '';
            this.showSuccess(`Email "${email}" added successfully!`);
        } catch (error) {
            console.error('Error adding email:', error);
            this.showError(error.message || 'Failed to add email. Please try again.');
        }
    }

    async activateEmail(emailId) {
        try {
            const response = await fetch(`/api/emails/${emailId}/activate`, {
                method: 'PUT'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to activate email');
            }

            // Update local array
            const emailIndex = this.emails.findIndex(e => e.id === emailId);
            if (emailIndex !== -1) {
                this.emails[emailIndex] = data;
                this.filterEmails();
                this.updateStats();
                this.showSuccess('Email activated successfully!');
            }
        } catch (error) {
            console.error('Error activating email:', error);
            this.showError(error.message || 'Failed to activate email. Please try again.');
        }
    }

    async deactivateEmail(emailId) {
        try {
            const response = await fetch(`/api/emails/${emailId}/deactivate`, {
                method: 'PUT'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to deactivate email');
            }

            // Update local array
            const emailIndex = this.emails.findIndex(e => e.id === emailId);
            if (emailIndex !== -1) {
                this.emails[emailIndex] = data;
                this.filterEmails();
                this.updateStats();
                this.showSuccess('Email deactivated successfully!');
            }
        } catch (error) {
            console.error('Error deactivating email:', error);
            this.showError(error.message || 'Failed to deactivate email. Please try again.');
        }
    }

    async deleteEmail(emailId) {
        if (!confirm('Are you sure you want to delete this email?')) {
            return;
        }

        try {
            const response = await fetch(`/api/emails/${emailId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete email');
            }

            // Remove from local array
            this.emails = this.emails.filter(e => e.id !== emailId);
            this.filterEmails();
            this.updateStats();
            this.showSuccess('Email deleted successfully!');
        } catch (error) {
            console.error('Error deleting email:', error);
            this.showError(error.message || 'Failed to delete email. Please try again.');
        }
    }

    filterEmails() {
        switch (this.currentFilter) {
            case 'active':
                this.filteredEmails = this.emails.filter(email => email.status === 'active');
                break;
            case 'inactive':
                this.filteredEmails = this.emails.filter(email => email.status === 'inactive');
                break;
            default:
                this.filteredEmails = [...this.emails];
        }
        this.renderEmails();
    }

    renderEmails() {
        const emailsList = document.getElementById('emailsList');
        const noEmailsMessage = document.getElementById('noEmailsMessage');

        if (this.filteredEmails.length === 0) {
            emailsList.innerHTML = '';
            noEmailsMessage.style.display = 'block';
            return;
        }

        noEmailsMessage.style.display = 'none';
        emailsList.innerHTML = this.filteredEmails.map(email => this.createEmailHTML(email)).join('');
    }

    createEmailHTML(email) {
        const createdAt = new Date(email.created_at).toLocaleDateString();
        const updatedAt = new Date(email.updated_at).toLocaleDateString();
        
        return `
            <div class="email-item ${email.status}" data-email-id="${email.id}">
                <div class="email-info">
                    <div class="email-address">${email.email}</div>
                    <div class="email-meta">
                        <span class="status-badge ${email.status}">
                            <i class="fas fa-${email.status === 'active' ? 'check' : 'times'}-circle"></i>
                            ${email.status}
                        </span>
                        <span><i class="fas fa-calendar-plus"></i> Added: ${createdAt}</span>
                        <span><i class="fas fa-calendar-alt"></i> Updated: ${updatedAt}</span>
                    </div>
                </div>
                <div class="email-actions">
                    ${email.status === 'active' 
                        ? `<button class="btn btn-warning btn-sm" onclick="emailManager.deactivateEmail(${email.id})">
                               <i class="fas fa-pause"></i> Deactivate
                           </button>`
                        : `<button class="btn btn-success btn-sm" onclick="emailManager.activateEmail(${email.id})">
                               <i class="fas fa-play"></i> Activate
                           </button>`
                    }
                    <button class="btn btn-danger btn-sm" onclick="emailManager.deleteEmail(${email.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalEmails = this.emails.length;
        const activeEmails = this.emails.filter(email => email.status === 'active').length;
        const inactiveEmails = this.emails.filter(email => email.status === 'inactive').length;

        document.getElementById('totalEmails').textContent = totalEmails;
        document.getElementById('activeEmails').textContent = activeEmails;
        document.getElementById('inactiveEmails').textContent = inactiveEmails;
    }

    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const emailsList = document.getElementById('emailsList');
        
        if (show) {
            loadingIndicator.style.display = 'block';
            emailsList.innerHTML = '<div class="loading" id="loadingIndicator"><i class="fas fa-spinner fa-spin"></i> Loading emails...</div>';
        } else {
            loadingIndicator.style.display = 'none';
        }
    }

    showError(message) {
        this.hideMessages();
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        this.hideMessages();
        const successDiv = document.getElementById('successMessage');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    hideMessages() {
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('successMessage').style.display = 'none';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize the email manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emailManager = new EmailManager();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Add loading states to buttons
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const button = document.activeElement;
        if (button && button.tagName === 'BUTTON') {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            button.disabled = true;
            
            return originalFetch.apply(this, args).finally(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            });
        }
        return originalFetch.apply(this, args);
    };

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter or Cmd+Enter to add email
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            document.getElementById('addEmailBtn').click();
        }
        
        // F5 or Ctrl+R to refresh (prevent default and use our refresh)
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
            e.preventDefault();
            document.getElementById('refreshBtn').click();
        }
    });

    // Add auto-focus to email input
    document.getElementById('emailInput').focus();
});