import type { CarbonProject } from '@/lib/types/carbon';

export const mockCarbonProjects: CarbonProject[] = [
  {
    id: 'proj-001',
    name: 'Amazon Rainforest Reforestation',
    description: 'Large-scale reforestation project in the Brazilian Amazon',
    vintageYear: 2023,
    pricePerTon: 45.5,
    availableSupply: 1250.75,
    isOutOfStock: false,
  },
  {
    id: 'proj-002',
    name: 'Wind Energy Farm - Texas',
    description: 'Renewable wind energy generation in West Texas',
    vintageYear: 2024,
    pricePerTon: 38.25,
    availableSupply: 850.3,
    isOutOfStock: false,
  },
  {
    id: 'proj-003',
    name: 'Solar Power Initiative - India',
    description: 'Community solar installations across rural India',
    vintageYear: 2023,
    pricePerTon: 42.0,
    availableSupply: 0,
    isOutOfStock: true,
  },
  {
    id: 'proj-004',
    name: 'Mangrove Restoration - Indonesia',
    description: 'Coastal mangrove restoration and protection program',
    vintageYear: 2024,
    pricePerTon: 55.75,
    availableSupply: 2100.5,
    isOutOfStock: false,
  },
  {
    id: 'proj-005',
    name: 'Sustainable Agriculture - Kenya',
    description: 'Regenerative farming practices in East Africa',
    vintageYear: 2022,
    pricePerTon: 35.0,
    availableSupply: 450.2,
    isOutOfStock: false,
  },
];
