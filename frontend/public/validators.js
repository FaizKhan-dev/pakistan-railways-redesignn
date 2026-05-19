/**
 * Frontend Validation Utilities for Pakistan Railways
 * Comprehensive validation for forms including CNIC, phone, email, dates
 */

const Validators = {
    // Regex patterns
    PATTERNS: {
        CNIC: /^\d{5}-\d{7}-\d{1}$/,  // Format: 12345-1234567-1
        PHONE: /^(\+92|0)?[1-9]\d{1,14}$/,  // Pakistani phone
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // Standard email
        USERNAME: /^[a-zA-Z0-9_-]+$/,  // Username
        TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/  // HH:MM format
    },

    /**
     * Validate email
     */
    validateEmail: function(email) {
        if (!email || email.trim() === '') {
            return { valid: false, error: 'Email is required' };
        }
        if (!this.PATTERNS.EMAIL.test(email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }
        return { valid: true };
    },

    /**
     * Validate CNIC (Pakistani format: 12345-1234567-1)
     */
    validateCNIC: function(cnic) {
        if (!cnic || cnic.trim() === '') {
            return { valid: false, error: 'CNIC is required' };
        }
        if (!this.PATTERNS.CNIC.test(cnic.trim())) {
            return { 
                valid: false, 
                error: 'CNIC must be in format: 12345-1234567-1 (digits only)' 
            };
        }
        return { valid: true };
    },

    /**
     * Validate Pakistani phone number
     */
    validatePhone: function(phone) {
        if (!phone || phone.trim() === '') {
            return { valid: false, error: 'Phone number is required' };
        }
        if (!this.PATTERNS.PHONE.test(phone.trim())) {
            return { 
                valid: false, 
                error: 'Please enter a valid Pakistani phone number' 
            };
        }
        return { valid: true };
    },

    /**
     * Validate passenger name
     */
    validatePassengerName: function(name) {
        if (!name || name.trim() === '') {
            return { valid: false, error: 'Passenger name is required' };
        }
        if (name.trim().length < 3) {
            return { valid: false, error: 'Name must be at least 3 characters' };
        }
        if (name.trim().length > 100) {
            return { valid: false, error: 'Name cannot exceed 100 characters' };
        }
        if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
            return { 
                valid: false, 
                error: 'Name can only contain letters and spaces' 
            };
        }
        return { valid: true };
    },

    /**
     * Validate username
     */
    validateUsername: function(username) {
        if (!username || username.trim() === '') {
            return { valid: false, error: 'Username is required' };
        }
        if (username.trim().length < 3) {
            return { valid: false, error: 'Username must be at least 3 characters' };
        }
        if (username.trim().length > 30) {
            return { valid: false, error: 'Username cannot exceed 30 characters' };
        }
        if (!this.PATTERNS.USERNAME.test(username.trim())) {
            return { 
                valid: false, 
                error: 'Username can only contain letters, numbers, underscore, and hyphen' 
            };
        }
        return { valid: true };
    },

    /**
     * Validate password
     */
    validatePassword: function(password) {
        if (!password || password === '') {
            return { valid: false, error: 'Password is required' };
        }
        if (password.length < 6) {
            return { valid: false, error: 'Password must be at least 6 characters' };
        }
        // Check for at least one uppercase, one lowercase, one number (optional but recommended)
        const hasStrength = /[A-Z]/.test(password) && /[a-z]/.test(password);
        if (!hasStrength) {
            return { 
                valid: true, 
                warning: 'Consider using uppercase and lowercase letters for stronger password' 
            };
        }
        return { valid: true };
    },

    /**
     * Validate journey date
     */
    validateJourneyDate: function(date) {
        if (!date || date.trim() === '') {
            return { valid: false, error: 'Journey date is required' };
        }
        const journeyDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Reset to start of day

        if (isNaN(journeyDate.getTime())) {
            return { valid: false, error: 'Invalid date format' };
        }
        if (journeyDate < today) {
            return { valid: false, error: 'Journey date must be in the future' };
        }
        return { valid: true };
    },

    /**
     * Validate number of passengers
     */
    validatePassengers: function(passengers) {
        if (!passengers || passengers === '') {
            return { valid: false, error: 'Number of passengers is required' };
        }
        const count = parseInt(passengers);
        if (isNaN(count) || count < 1) {
            return { valid: false, error: 'At least 1 passenger is required' };
        }
        if (count > 10) {
            return { valid: false, error: 'Maximum 10 passengers per booking' };
        }
        return { valid: true };
    },

    /**
     * Validate stations (from and to)
     */
    validateStations: function(from, to) {
        if (!from || from.trim() === '') {
            return { valid: false, error: 'From station is required' };
        }
        if (!to || to.trim() === '') {
            return { valid: false, error: 'To station is required' };
        }
        if (from.toUpperCase() === to.toUpperCase()) {
            return { valid: false, error: 'From and To stations cannot be the same' };
        }
        return { valid: true };
    },

    /**
     * Validate feedback
     */
    validateFeedback: function(email, message, rating) {
        // Validate email
        const emailValidation = this.validateEmail(email);
        if (!emailValidation.valid) {
            return emailValidation;
        }

        // Validate message
        if (!message || message.trim() === '') {
            return { valid: false, error: 'Message is required' };
        }
        if (message.trim().length < 5) {
            return { valid: false, error: 'Message must be at least 5 characters' };
        }
        if (message.trim().length > 1000) {
            return { valid: false, error: 'Message cannot exceed 1000 characters' };
        }

        // Validate rating
        const ratingNum = parseInt(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return { valid: false, error: 'Please select a rating between 1 and 5' };
        }

        return { valid: true };
    },

    /**
     * Validate registration form
     */
    validateRegistration: function(formData) {
        // Check username
        const usernameValidation = this.validateUsername(formData.username);
        if (!usernameValidation.valid) {
            return usernameValidation;
        }

        // Check email
        const emailValidation = this.validateEmail(formData.email);
        if (!emailValidation.valid) {
            return emailValidation;
        }

        // Check password
        const passwordValidation = this.validatePassword(formData.password);
        if (!passwordValidation.valid) {
            return passwordValidation;
        }

        return { valid: true };
    },

    /**
     * Validate booking form
     */
    validateBooking: function(formData) {
        // Validate passenger name
        const nameValidation = this.validatePassengerName(formData.passengerName);
        if (!nameValidation.valid) return nameValidation;

        // Validate CNIC
        const cnicValidation = this.validateCNIC(formData.passengerCnic);
        if (!cnicValidation.valid) return cnicValidation;

        // Validate email
        const emailValidation = this.validateEmail(formData.passengerEmail);
        if (!emailValidation.valid) return emailValidation;

        // Validate phone (optional, but if provided should be valid)
        if (formData.passengerPhone && formData.passengerPhone.trim() !== '') {
            const phoneValidation = this.validatePhone(formData.passengerPhone);
            if (!phoneValidation.valid) return phoneValidation;
        }

        return { valid: true };
    }
};

// Export for browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
}
