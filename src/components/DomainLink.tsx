import { Link } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode, type MouseEventHandler } from 'react';
import { domainHref } from '@/lib/domains';

type Props = {
  children?: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  'aria-label'?: string;
  to: '/' | '/app' | '/privacy' | '/terms' | '/learn';
  destination: 'site' | 'app';
};

// Relative SSR/first-render links remain functional through host redirects;
// hydration selects the cross-origin href without a hydration mismatch.
export function DomainLink({ to, destination, ...props }: Props) {
  const [host, setHost] = useState('');
  useEffect(() => { setHost(window.location.hostname); }, []);
  const href = domainHref(to, destination, host);
  return href === to ? <Link to={to} {...props} /> : <a href={href} {...props} />;
}