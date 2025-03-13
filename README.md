# BinderChain Landing Page

A modern landing page for BinderChain - a blockchain-based system for secure and verifiable document authentication.

## Features

- Responsive design
- Email collection form with Supabase integration
- Modern UI with smooth animations
- Mobile-friendly layout

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Supabase (for email storage)

## Local Development

1. Clone the repository
2. No dependencies needed - pure HTML/CSS/JS
3. Start a local server:
   ```bash
   python3 -m http.server 8000
   ```
4. Visit `http://localhost:8000` in your browser

## Environment Setup

To enable email collection, you'll need to:

1. Create a Supabase project
2. Create a `waitlist_emails` table with columns:
   - `email` (text, primary key)
   - `created_at` (timestamptz)
   - `source` (text)
3. Enable Row Level Security (RLS) policy for anonymous inserts

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
