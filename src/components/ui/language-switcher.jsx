import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { useLanguage } from '@/utils/translation';

/**
 * Language Switcher Component
 * Allows users to switch between available languages
 */
export function LanguageSwitcher() {
  const { currentLocale, availableLocales, changeLanguage } = useLanguage();

  // Map of locale codes to full language names and flags
  const languageMap = {
    en: { name: 'English', flag: '🇬🇧' },
    ur: { name: 'اردو', flag: '🇵🇰' },
    hi: { name: 'हिंदी', flag: '🇮🇳' },
    ar: { name: 'العربية', flag: '🇸🇦' },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 px-2 py-1 text-sm rounded-md hover:bg-gray-100 transition-colors">
        <span>{languageMap[currentLocale]?.flag || '🌐'}</span>
        <span>{languageMap[currentLocale]?.name || currentLocale}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {availableLocales?.map((locale) => (
          <DropdownMenuItem
            key={locale}
            className={`flex items-center gap-2 ${
              locale === currentLocale ? 'font-bold bg-gray-50' : ''
            }`}
            onClick={() => changeLanguage(locale)}
          >
            <span>{languageMap[locale]?.flag || '🌐'}</span>
            <span>{languageMap[locale]?.name || locale}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 