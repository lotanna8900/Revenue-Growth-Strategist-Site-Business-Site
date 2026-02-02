'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SignInLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const pathname = usePathname();
  const redirectUrl = `/auth?redirect=${pathname}`;

  return (
    <Link href={redirectUrl} className={className}>
      {children}
    </Link>
  );
}