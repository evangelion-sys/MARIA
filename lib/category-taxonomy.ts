import { ResourceCategory } from '@/types/resource';

export interface CategoryMeta {
  id: ResourceCategory;
  name: string;
  shortName: string;
  description: string;
  subcategories: string[];
}

export const CANONICAL_CATEGORIES: Record<ResourceCategory, CategoryMeta> = {
  dev: {
    id: 'dev',
    name: 'Development & Engineering',
    shortName: 'Development',
    description: 'Frameworks, runtimes, databases, code editors, testing tools, and deployment platforms.',
    subcategories: [
      'Frameworks & Libraries',
      'Database & BaaS',
      'Developer Essentials',
      'IDEs & Editors',
      'Hosting & Edge',
      'API Tools & Testing',
      'CI/CD & DevOps',
      'Terminal & Git',
      'Security & Auth',
      'Monitoring & Observability',
      'Vector & Search',
    ],
  },
  design: {
    id: 'design',
    name: 'Design & UI/UX',
    shortName: 'Design',
    description: 'Interface design tools, icon sets, fonts, palettes, and wireframing utilities.',
    subcategories: [
      'UI & Visual Design',
      'Design Systems & Tokens',
      'Icons & Symbols',
      'Typography & Fonts',
      'Wireframing & Mockups',
      'Color & Palettes',
      'Motion & Interaction',
      '3D & Spatial',
      'Shaders & Creative Coding',
      'Photo & Vector Editing',
      'Design Inspiration',
    ],
  },
  ai: {
    id: 'ai',
    name: 'AI & Machine Learning',
    shortName: 'AI & ML',
    description: 'Local model runners, inference servers, voice models, image generation, and workflow automation.',
    subcategories: [
      'Local LLMs & Inference',
      'AI Platforms & Tools',
      'Agents & Orchestration',
      'Generative Media & Images',
      'Audio & Speech AI',
      'Video & Motion AI',
      'LLMOps & Prompt Engineering',
    ],
  },
  video: {
    id: 'video',
    name: 'Video & Audio Production',
    shortName: 'Video & Audio',
    description: 'Video editors, motion graphics, screen recording, audio tools, and media transcoders.',
    subcategories: [
      'Video Editors',
      'Motion & VFX',
      'Transcoding & Codecs',
      'Video Production',
      'Media Players & Utilities',
      'Stock Footage & LUTs',
      'Streaming & Capture',
    ],
  },
  asset: {
    id: 'asset',
    name: '3D & Creative Assets',
    shortName: 'Creative Assets',
    description: '3D assets, textures, photos, vectors, audio samples, and site templates.',
    subcategories: [
      '3D Models & Textures',
      'Creative Assets',
      'Typography & Fonts',
      'Audio, SFX & DAWs',
      'Stock Photography',
      'Illustrations & Vectors',
      'Patterns & Gradients',
      'Templates & Themes',
    ],
  },
  api: {
    id: 'api',
    name: 'Public APIs & Open Data',
    shortName: 'Public APIs',
    description: 'Free public APIs and open datasets for weather, maps, science, finance, and testing.',
    subcategories: [
      'Developer Testing & Mocks',
      'Public REST APIs',
      'Weather & Environment',
      'Open Data & Science',
      'Geospatial & IP',
      'Finance & Cryptocurrency',
      'News & Media',
      'Jobs & Demographics',
      'Entertainment & Pop Culture',
    ],
  },
};

/**
 * Mapping table to consolidate any raw subcategory variations
 * into their canonical subcategory.
 */
export const SUBCATEGORY_CONSOLIDATION_MAP: Record<string, string> = {
  // dev consolidation
  'Frameworks': 'Frameworks & Libraries',
  'UI Libraries': 'Frameworks & Libraries',
  'Compilers & Linters': 'Developer Essentials',
  'Build Systems': 'Developer Essentials',
  'Package Managers': 'Developer Essentials',
  'Runtimes': 'Hosting & Edge',
  'Desktop Runtimes': 'Developer Essentials',
  'Validation & Schemas': 'Developer Essentials',
  'Communication & APIs': 'API Tools & Testing',
  'Self-Hosted & Analytics': 'CI/CD & DevOps',
  'Self-Hosted & Automation': 'CI/CD & DevOps',
  'Self-Hosted & Database': 'Database & BaaS',
  'Self-Hosted & DevOps': 'CI/CD & DevOps',

  // design consolidation
  'Vector & UI Design': 'UI & Visual Design',
  'Wireframing & Diagrams': 'Wireframing & Mockups',
  '3D & WebGL': '3D & Spatial',
  'Motion & Sequencing': 'Motion & Interaction',

  // video consolidation
  'Video Editing & VFX': 'Motion & VFX',
  'Transcoding & Tools': 'Transcoding & Codecs',
  'Audio & Music': 'Media Players & Utilities',

  // ai consolidation
  'Local Inference': 'Local LLMs & Inference',
  'Generative Media & UI': 'Generative Media & Images',
  'Cloud Inference': 'AI Platforms & Tools',
  'Model Serving': 'AI Platforms & Tools',
  'Model Hubs': 'AI Platforms & Tools',

  // api consolidation
  'Developer Testing': 'Developer Testing & Mocks',
  'Science & Astronomy': 'Open Data & Science',
  'Open Data & Health': 'Open Data & Science',
  'Civic & Geospatial': 'Geospatial & IP',
  'Weather & Geospatial': 'Weather & Environment',
  'Financial & Civic Data': 'Finance & Cryptocurrency',
  'Gaming & Educational': 'Entertainment & Pop Culture',
  'Media & Literature': 'Entertainment & Pop Culture',

  // asset consolidation
  '3D Textures & HDRIs': '3D Models & Textures',
  'Audio & Sound Effects': 'Audio, SFX & DAWs',
  'Video & Audio Templates': 'Templates & Themes',
  'Stock Footage': 'Stock Photography',
  'Patterns & Textures': 'Patterns & Gradients',
  'Game & UI Assets': 'Creative Assets',
};

/**
 * Normalizes raw subcategory strings into their canonical form.
 */
export function normalizeSubcategory(rawSub: string, category?: ResourceCategory): string {
  if (!rawSub) return 'all';
  if (category === 'asset' && rawSub === 'Color & Palettes') {
    return 'Patterns & Gradients';
  }
  return SUBCATEGORY_CONSOLIDATION_MAP[rawSub] || rawSub;
}
