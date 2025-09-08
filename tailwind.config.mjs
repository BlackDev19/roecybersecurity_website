// tailwind.config.mjs
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

const tailwindConfig = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
    // Retiré './lib/**/*.{ts,tsx}', './hooks/**/*.{ts,tsx}' pour optimisation
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'ui-monospace',
          'SFMono-Regular',
          'Monaco',
          'Cascadia Code',
          'Roboto Mono',
          'monospace'
        ]
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 8vw, 4.5rem)', {
          lineHeight: '1.1',
          fontWeight: '800',
          letterSpacing: '-0.04em'
        }],
        'display-xl': ['clamp(2.5rem, 6vw, 3.5rem)', {
          lineHeight: '1.15',
          fontWeight: '800',
          letterSpacing: '-0.035em'
        }],
        'display-lg': ['clamp(2rem, 5vw, 3rem)', {
          lineHeight: '1.2',
          fontWeight: '700',
          letterSpacing: '-0.03em'
        }],
        h1: ['clamp(1.875rem, 4vw, 2.5rem)', {
          lineHeight: '1.25',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }],
        h2: ['clamp(1.5rem, 3.5vw, 2rem)', {
          lineHeight: '1.3',
          fontWeight: '600',
          letterSpacing: '-0.02em'
        }],
        h3: ['clamp(1.25rem, 3vw, 1.5rem)', {
          lineHeight: '1.35',
          fontWeight: '600',
          letterSpacing: '-0.015em'
        }],
        h4: ['clamp(1.125rem, 2.5vw, 1.25rem)', {
          lineHeight: '1.4',
          fontWeight: '600',
          letterSpacing: '-0.01em'
        }],
        h5: ['1.125rem', {
          lineHeight: '1.45',
          fontWeight: '500',
          letterSpacing: '0'
        }],
        h6: ['1rem', {
          lineHeight: '1.5',
          fontWeight: '500',
          letterSpacing: '0.025em'
        }],
        'body-xl': ['clamp(1.125rem, 2.5vw, 1.25rem)', {
          lineHeight: '1.7',
          fontWeight: '400'
        }],
        'body-lg': ['clamp(1.063rem, 2vw, 1.125rem)', {
          lineHeight: '1.65',
          fontWeight: '400'
        }],
        body: ['clamp(1rem, 1.5vw, 1.063rem)', {
          lineHeight: '1.6',
          fontWeight: '400'
        }],
        'body-sm': ['clamp(0.9375rem, 1.25vw, 1rem)', {
          lineHeight: '1.55',
          fontWeight: '400'
        }],
        lead: ['clamp(1.125rem, 2.5vw, 1.375rem)', {
          lineHeight: '1.6',
          fontWeight: '400',
          letterSpacing: '-0.01em'
        }],
        caption: ['clamp(0.875rem, 1.25vw, 0.9375rem)', {
          lineHeight: '1.45',
          fontWeight: '400'
        }],
        overline: ['0.75rem', {
          lineHeight: '1.35',
          fontWeight: '500',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }],
        micro: ['0.6875rem', {
          lineHeight: '1.3',
          fontWeight: '500',
          letterSpacing: '0.1em'
        }],
        accent: ['1.125rem', { fontWeight: '700', color: '#3b82f6' }]
      },
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        success: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d'
        },
        warning: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        error: {
          50: '#fef2f2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        info: {
          50: '#f0f9ff',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490'
        },
        focus: {
          500: '#3b82f6',
          700: '#2563eb'
        },
        disabled: {
          500: '#d1d5db'
        },
        text: {
          primary: {
            light: '#0f172a',
            dark: '#f8fafc'
          },
          secondary: {
            light: '#334155',
            dark: '#cbd5e1'
          },
          tertiary: {
            light: '#64748b',
            dark: '#94a3b8'
          },
          muted: {
            light: '#94a3b8',
            dark: '#64748b'
          },
          disabled: {
            light: '#cbd5e1',
            dark: '#475569'
          }
        },
        surface: {
          primary: {
            light: '#ffffff',
            dark: '#0f172a'
          },
          secondary: {
            light: '#f8fafc',
            dark: '#1e293b'
          },
          tertiary: {
            light: '#f1f5f9',
            dark: '#334155'
          }
        },
        border: {
          light: '#e2e8f0',
          DEFAULT: '#cbd5e1',
          dark: '#475569'
        }
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        '15': '3.75rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glow': '0 0 0 1px rgb(59 130 246 / 0.15), 0 0 0 4px rgb(59 130 246 / 0.1)',
        'glow-lg': '0 0 0 1px rgb(59 130 246 / 0.15), 0 0 0 8px rgb(59 130 246 / 0.1)',
      },
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in-down': 'fadeInDown 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left': 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'stagger-1': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both',
        'stagger-2': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'stagger-3': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both',
        'dark-fade': 'darkFade 0.5s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        bounceSubtle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0,-8px,0)' },
          '70%': { transform: 'translate3d(0,-4px,0)' },
          '90%': { transform: 'translate3d(0,-2px,0)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' }
        },
        darkFade: {
          '0%': { background: '#fff' },
          '100%': { background: '#0f172a' }
        }
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms'
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-circ': 'cubic-bezier(0.08, 0.82, 0.17, 1)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
        '4xl': '1920px',
      }
    }
  },
  plugins: [
    tailwindcssAnimate,
    typography,
    function({ addUtilities, theme }) {
      const utilities = {
        '.text-balance': {
          'text-wrap': 'balance'
        },
        '.text-pretty': {
          'text-wrap': 'pretty'
        },
        '.bg-surface': {
          'background-color': 'rgb(var(--color-surface-primary) / <alpha-value>)'
        },
        '.text-primary': {
          'color': 'rgb(var(--color-text-primary) / <alpha-value>)'
        },
        '.border-glow': {
          'box-shadow': '0 0 8px 2px rgb(59 130 246 / 0.3)'
        }
      }
      addUtilities(utilities)
    }
  ]
}

export default tailwindConfig