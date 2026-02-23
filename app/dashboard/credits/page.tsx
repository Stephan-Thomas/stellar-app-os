'use client';

import { Text } from '@/components/atoms/Text';
import { CreditPortfolio } from '@/components/organisms/CreditPortfolio';

export default function DashboardCreditsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-6">
        <div>
          <Text variant="h2" as="h1" className="mb-2">
            My Carbon Credits
          </Text>
          <Text variant="muted" as="p">
            View and manage your carbon credit portfolio in real-time.
          </Text>
        </div>

        <CreditPortfolio />
      </div>
    </div>
  );
}
