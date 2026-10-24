import { createFileRoute, Outlet } from '@tanstack/react-router';
import { AppShell } from '@/components/app/AppShell';
import { VaultProvider } from '@/components/app/VaultProvider';
export const Route = createFileRoute('/app')({ component: () => <VaultProvider><AppShell><Outlet /></AppShell></VaultProvider> });
