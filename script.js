// Initialize Supabase client
const supabaseUrl = 'https://jziellrwzjhstppcnckr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWVsbHJ3empoc3RwcGNuY2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MjU2NDQsImV4cCI6MjA1NzQwMTY0NH0.rYgxT_PCGgHUlD4L_WdhNwBgP0V_BmK78G-qKHcsNRI';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Analytics tracking
async function trackEvent(eventType, eventData = {}) {
    try {
        const { data, error } = await supabase
            .from('site_analytics')
            .insert([{
                event_type: eventType,
                event_data: eventData,
                created_at: new Date().toISOString(),
                user_agent: navigator.userAgent,
                referrer: document.referrer
            }]);

        if (error) {
            console.error('Analytics error:', error);
        }
    } catch (error) {
        console.error('Failed to track event:', error);
    }
}

// Track page view on load
window.addEventListener('load', () => {
    trackEvent('page_view', {
        path: window.location.pathname,
        url: window.location.href
    });
});

// Check if the table exists and create it if it doesn't
async function ensureTableExists() {
    try {
        const { data, error } = await supabase
            .from('waitlist_emails')
            .select('email')
            .limit(1);
        
        if (error && error.code === 'PGRST116') {
            console.error('Table does not exist:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking table:', error);
        return false;
    }
}

// Smooth scrolling functions
function scrollToSignup() {
    document.getElementById('signup').scrollIntoView({ behavior: 'smooth' });
    trackEvent('button_click', { action: 'scroll_to_signup' });
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    trackEvent('button_click', { action: 'scroll_to_features' });
}

function scrollToPrototype() {
    document.getElementById('prototype').scrollIntoView({ behavior: 'smooth' });
    trackEvent('button_click', { action: 'scroll_to_prototype' });
}

// Handle form submission
async function handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const messageElement = document.getElementById('formMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    if (!isValidEmail(email)) {
        messageElement.textContent = 'Please enter a valid email address.';
        messageElement.className = 'form-message error';
        return;
    }

    try {
        // Disable submit button while processing
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Check if table exists
        const tableExists = await ensureTableExists();
        if (!tableExists) {
            throw new Error('Database not properly configured. Please contact support.');
        }

        // Track waitlist signup attempt
        trackEvent('button_click', { action: 'waitlist_signup_attempt' });

        // Insert email into Supabase
        console.log('Attempting to insert email:', email);
        const { data, error } = await supabase
            .from('waitlist_emails')
            .insert([{ 
                email: email, 
                created_at: new Date().toISOString(),
                source: 'landing_page'
            }]);

        if (error) {
            console.error('Supabase error:', error);
            if (error.code === '23505') { // Unique violation
                throw new Error('This email is already registered!');
            } else if (error.code === '42501') { // RLS violation
                console.error('Row Level Security policy violation. Please ensure proper policies are set.');
                throw new Error('Unable to save your email at this time. Please try again later.');
            }
            throw error;
        }
        console.log('Success:', data);

        // Track successful signup
        trackEvent('button_click', { action: 'waitlist_signup_success' });

        // Success message
        messageElement.textContent = 'Thank you for joining our waitlist! We\'ll keep you updated.';
        messageElement.className = 'form-message success';
        document.getElementById('email').value = '';
    } catch (error) {
        console.error('Error:', error);
        messageElement.textContent = 'Something went wrong. Please try again later.';
        messageElement.className = 'form-message error';
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Join Waitlist';
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add scroll animation for nav
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});
