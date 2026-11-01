import { StarterStack } from '@/types/resource';

export const STARTER_STACKS: StarterStack[] = [
  {
    id: 'saas-builder',
    title: 'Zero-Cost Modern SaaS Stack',
    targetAudience: 'Developers & Founders',
    description: 'Ship a production-grade web application with real-time database, auth, email notifications, edge deployment, and clean accessible UI without paying $1 in infrastructure.',
    category: 'dev',
    resourceIds: ['nextjs', 'supabase', 'shadcn-ui', 'resend', 'cloudflare-workers', 'biome'],
  },
  {
    id: '3d-web-experience',
    title: 'Interactive 3D Web & Design System',
    targetAudience: 'Designers & Creative Devs',
    description: 'Design vector assets, create 3D WebGL assets, build typography hierarchies, and implement rich interactive canvas interfaces.',
    category: 'design',
    resourceIds: ['penpot', 'blender', 'spline', 'fontshare', 'lucide-icons', 'gltf-transform'],
  },
  {
    id: 'cinematic-video-studio',
    title: 'Hollywood-Grade Content Creation Studio',
    targetAudience: 'Video Editors & Filmmakers',
    description: 'Everything needed to edit 4K footage, master multichannel audio, source high-definition B-roll, and produce broadcast-ready videos.',
    category: 'video',
    resourceIds: ['davinci-resolve', 'freesound', 'pexels-video', 'mixkit', 'lossless-cut', 'handbrake'],
  },
  {
    id: 'local-ai-lab',
    title: 'Offline Sovereign AI & Model Workbench',
    targetAudience: 'AI Creators & Researchers',
    description: 'Run state-of-the-art LLMs, generative diffusion image workflows, vector semantic search, and speech synthesis entirely offline with zero cloud fees or data leaks.',
    category: 'ai',
    resourceIds: ['ollama', 'huggingface', 'comfyui', 'lm-studio', 'chromadb', 'jan'],
  },
];
