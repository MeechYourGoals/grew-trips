

import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			// Mobile-first breakpoints for native app experience
			'xs': '480px',  // small phones
			'sm': '600px',  // large phones  
			'md': '900px',  // tablets
			'lg': '1200px', // desktop
			'xl': '1400px', // large desktop
			'2xl': '1600px',
		},
		extend: {
			fontFamily: {
				// Enterprise-grade font stack
				'sans': [
					'Inter', 
					'-apple-system', 
					'BlinkMacSystemFont', 
					'"SF Pro Display"', 
					'"SF Pro Text"', 
					'"Segoe UI"', 
					'Roboto', 
					'system-ui', 
					'sans-serif'
				],
			},
			fontSize: {
				// Enterprise typography scale with mobile optimization
				'h1': ['22px', { lineHeight: '28px', fontWeight: '700' }], // Mobile: 22px
				'h1-desktop': ['24px', { lineHeight: '32px', fontWeight: '700' }], // Desktop: 24px
				'h2': ['18px', { lineHeight: '24px', fontWeight: '600' }], // Mobile: 18px
				'h2-desktop': ['20px', { lineHeight: '28px', fontWeight: '600' }], // Desktop: 20px
				'h3': ['16px', { lineHeight: '20px', fontWeight: '600' }], // Mobile: 16px
				'h3-desktop': ['18px', { lineHeight: '24px', fontWeight: '600' }], // Desktop: 18px
				'body': ['15px', { lineHeight: '22px', fontWeight: '400' }], // Mobile: 15px
				'body-desktop': ['16px', { lineHeight: '24px', fontWeight: '400' }], // Desktop: 16px
				'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
				'caption': ['13px', { lineHeight: '18px', fontWeight: '500' }], // Mobile: 13px min
			},
			colors: {
				// Enterprise color system
				glass: {
					// Updated enterprise colors
					'enterprise-blue': 'hsl(223, 56%, 53%)', // #3A60D0
					'enterprise-blue-light': 'hsl(223, 50%, 60%)', // Lighter variant
					'accent-orange': 'hsl(32, 95%, 48%)', // #F57C00
					'accent-orange-light': 'hsl(32, 85%, 58%)', // #FFA726
					'slate-bg': 'hsl(223, 25%, 12%)', // #181A21
					'slate-card': 'hsl(223, 25%, 18%)', // #232B3B
					'slate-border': 'hsl(223, 15%, 25%)', // #383C4A
					'light-bg': 'hsl(223, 25%, 97%)', // #F7F8FA
					'light-border': 'hsl(223, 15%, 90%)', // #E3E7ED
					'text-primary': 'hsl(223, 35%, 20%)', // #252F4A
					green: '#62D621',
					dark: '#000000',
					light: '#FFFFFF',
					// Events theme colors
					'navy-blue': 'hsl(217, 91%, 25%)', // Deep navy for Events
					'navy-blue-light': 'hsl(217, 80%, 35%)', // Lighter navy
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			spacing: {
				// Enterprise spacing scale with mobile optimization
				'page-gutter-mobile': '16px',
				'page-gutter-desktop': '24px',
				'section-gap': '20px',
				'card-padding': '20px',
				'button-padding-y': '16px',
				'button-padding-x': '24px',
				'touch-target': '44px', // Minimum touch target size
				'mobile-nav-height': '80px', // Height for bottom navigation
				'safe-area-bottom': 'env(safe-area-inset-bottom)', // iOS safe area
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				// Enterprise border radius
				'enterprise': '8px',
				'enterprise-sm': '6px',
			},
			boxShadow: {
				// Enterprise shadows
				'enterprise': '0px 2px 16px rgba(50, 50, 93, 0.07)',
				'enterprise-md': '0px 4px 24px rgba(50, 50, 93, 0.12)',
				'enterprise-lg': '0px 8px 32px rgba(50, 50, 93, 0.18)',
				// Mobile-specific shadows
				'mobile-nav': '0px -2px 16px rgba(0, 0, 0, 0.1)',
				'mobile-sheet': '0px -8px 32px rgba(0, 0, 0, 0.15)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'slide-in-bottom': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' }
				},
				'slide-out-bottom': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100%)' }
				},
				'slide-in-up': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100%)' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'slide-in-bottom': 'slide-in-bottom 0.3s ease-out',
				'slide-out-bottom': 'slide-out-bottom 0.3s ease-out',
				'slide-in-up': 'slide-in-up 0.3s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			},
			backdropBlur: {
				xs: '2px',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

