'use client';

import Link from 'next/link';
import { useMessages } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { BrandLogo } from './layout/BrandLogo';
import { useAuth } from '@/lib/auth/context';

// The shared public navbar (foundation component), upgraded with the
// product's brand mark, the landing's section anchors and auth-aware
// calls to action, and restyled to the Liquid Glass theme. It is the
// header of the public landing page.
export function SiteNavbar() {
  const messages = useMessages() as unknown as {
    landing: {
      navProduct: string;
      navPipeline: string;
      navWorkflow: string;
      signIn: string;
      openDashboard: string;
    };
  };
  const copy = messages.landing;
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 sm:gap-4"
      aria-label="Main navigation"
    >
      <Link href="/" className="group flex items-center gap-3">
        <BrandLogo
          priority
          className="h-10 w-10"
        />
        <span className="hidden min-[480px]:block">
          <span className="block text-sm font-bold tracking-tight text-white">
            SMART MARKETING
          </span>
          <span className="hidden text-[11px] text-txt-secondary sm:block">
            AI Marketing Workspace
          </span>
        </span>
      </Link>

      <div className="hidden items-center gap-7 text-xs font-medium text-txt-secondary lg:flex">
        <a href="#studio-frame" className="transition-colors hover:text-white">
          {copy.navProduct}
        </a>
        <a href="#pipeline" className="transition-colors hover:text-white">
          {copy.navPipeline}
        </a>
        <a href="#dealt-moment" className="transition-colors hover:text-white">
          {copy.navWorkflow}
        </a>
      </div>

      <div className="flex items-center gap-2.5">
        <LanguageSwitcher />
        <ThemeToggle />
        <Link
          href={isAuthenticated ? '/dashboard' : '/login'}
          className="glass-button-secondary hidden shrink-0 whitespace-nowrap px-4 py-2 text-xs sm:block"
        >
          {isAuthenticated ? copy.openDashboard : copy.signIn}
        </Link>
        <Link href="/dashboard" className="glass-button-primary shrink-0 whitespace-nowrap px-4 py-2 text-xs">
          {copy.openDashboard}
        </Link>
      </div>
    </nav>
  );
}
