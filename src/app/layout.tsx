import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TranslationProvider } from '@/components/TranslationProvider';

export const metadata: Metadata = {
  title: 'RoeCybersecurity - Formation et Équipement',
  description: "Formations en cybersécurité et boutique d'équipements spécialisés",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body className="bg-gray-900 text-white min-h-screen">
        <LanguageProvider>
          <TranslationProvider>
            <Header />
            <main>{children}</main>
            <footer className="bg-gray-800 py-10 mt-16 text-sm text-slate-300">
              <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                
                {/* Copyright */}
                <div className="text-center md:text-left">
                  <p>
                    © 2025 RoeCybersecurity. Tous droits réservés. Développé par <span className="text-white font-semibold">BLACK-DEV Software</span>
                  </p>
                </div>

                {/* Liens légaux */}
                <div className="flex flex-wrap justify-center md:justify-end gap-4">
                  <Link href="/rgpd/confidentalite" className="hover:text-white transition-colors duration-300">
                    Politique de confidentialité
                  </Link>
                  <Link href="/rgpd/conditions" className="hover:text-white transition-colors duration-300">
                    Conditions d’utilisation
                  </Link>
                  <Link href="/rgpd/mentions_legales" className="hover:text-white transition-colors duration-300">
                    Mentions légales
                  </Link>
                </div>
              </div>
            </footer>
          </TranslationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
