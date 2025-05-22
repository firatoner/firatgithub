"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { content } from "@/context/language-content";
import { FaTwitterSquare, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <footer className="bg-gray-300 border-t-1 dark:border-white dark:bg-gray-950 text-gray-900 dark:text-white py-5 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Hakkımızda */}
        <div>
          <h3 className="text-lg font-bold mb-4">{t.about}</h3>
          <p className="text-sm">
            PortfoyPro, yatırımlarınızı kolayca takip etmenizi, analiz etmenizi
            ve finansal hedeflerinize ulaşmanızı sağlar.
          </p>
        </div>

        {/* Hızlı Bağlantılar */}
        <div>
          <h3 className="text-lg font-bold mb-4">{t.quickLinks}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/auth/login" className="hover:underline">
                {t.signIn}
              </Link>
            </li>
            <li>
              <Link href="/auth/register" className="hover:underline">
                {t.signUp}
              </Link>
            </li>
          </ul>
        </div>

        {/* Destek */}
        <div>
          <h3 className="text-lg font-bold mb-4">{t.support}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/faq" className="hover:underline">
                {t.faq}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                {t.contact}
              </Link>
            </li>
            <li>
              <Link href="/guides" className="hover:underline">
                {t.guides}
              </Link>
            </li>
          </ul>
        </div>

        {/* Yasal */}
        <div>
          <h3 className="text-lg font-bold mb-4">{t.legal}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                {t.privacyPolicy}
              </Link>
            </li>
            <li>
              <Link href="/terms-of-use" className="hover:underline">
                {t.termsOfUse}
              </Link>
            </li>
            <li>
              <Link href="/cookie-policy" className="hover:underline">
                {t.cookiePolicy}
              </Link>
            </li>
            <li>
              <Link href="/gdpr" className="hover:underline">
                {t.kvkk}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t dark:border-gray-700 pt-6 text-sm text-center">
        <p className="mb-6">{t.footerText}</p>
        <div className="flex justify-center gap-4 text-lg text-gray-600 dark:text-gray-400">
          <a href="#" aria-label="Facebook" className="hover:text-blue-500">
            <FaGithub />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400">
            <FaTwitterSquare />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-pink-500">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
