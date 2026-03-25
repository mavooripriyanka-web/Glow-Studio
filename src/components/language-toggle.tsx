'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

import { usePathname } from 'next/navigation';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const pathname = usePathname();

  // Condition removed to allow toggle on dashboard routes
  // if (pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')) {
  //   return null;
  // }

  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg bg-secondary/90 backdrop-blur-md shadow-sm border border-border/50">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={cn(
          'relative text-foreground/80 hover:text-foreground',
          language === 'en' &&
          "font-semibold text-foreground after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-foreground"
        )}
      >
        English
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('fr')}
        className={cn(
          'relative text-foreground/80 hover:text-foreground',
          language === 'fr' &&
          "font-semibold text-foreground after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-foreground"
        )}
      >
        French
      </Button>
    </div>
  );
}
