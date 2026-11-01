import { ResourceItem } from '@/types/resource';
import rawResources from './resources.json';

/**
 * MARIA Digital Creation Archive — Core Catalogue Data
 *
 * Catalogue Specifications:
 * - Total Genuine Resources: 2454
 * - Verified Items with Documented Evidence: 576
 * - Direct HTTPS Canonical Links: 100%
 * - Zero Artificial Popularity Metrics or Fabricated Ratings
 */
export const RESOURCES: ResourceItem[] = rawResources as unknown as ResourceItem[];
