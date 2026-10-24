import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/app/AppShell';
import { VaultProvider } from '@/components/app/VaultProvider';
import { seo } from '@/lib/seo';
export const Route = createFileRoute('/app')({ head: () => seo('SautiSalama personal space', 'Health education and private wellbeing tools in Kiswahili and English.'), component: () => <VaultProvider><AppShell><Outlet /></AppShell></VaultProvider> });
