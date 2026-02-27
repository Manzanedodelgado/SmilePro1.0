/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: '#4ccce6',          // ← NEW Teal Primary
                secondary: '#38b2c9',        // Darker teal
                accent: '#00bcd4',           // Bright cyan
                corporate: '#0e7490',        // Deep teal
                surface: '#ffffff',
                'clinical': {
                    'navy': '#0e4a5a',         // Deep teal-navy
                    'teal': '#4ccce6',         // Primary teal
                    'soft': '#f6f8f8',         // Light warm gray background
                    'glass': 'rgba(255, 255, 255, 0.95)',
                },
                'border-strong': '#cbd5e1',
            },
            boxShadow: {
                'premium': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                'premium-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
                'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 0.15), 0 2px 8px 0 rgba(0, 0, 0, 0.04)',
            },
            borderRadius: {
                'none': '0',
                'sm': '4px',
                'md': '6px',
                'lg': '8px',
                'xl': '12px',
                '2xl': '16px',
                '3xl': '20px',
                'full': '9999px',
            }
        },
    },
    plugins: [],
};
