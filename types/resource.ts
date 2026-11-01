export type ResourceCategory =
  | 'dev'
  | 'design'
  | 'video'
  | 'ai'
  | 'api'
  | 'asset';

export type PricingModel =
  | 'Free'
  | 'Freemium'
  | 'Free with Limits'
  | 'Free Trial'
  | 'Paid'
  | 'Pricing Unverified'
  | 'Self-Hosted'
  | 'Open Source';

export type AccessModel =
  | 'open-source'
  | 'free-no-account'
  | 'free-account-required'
  | 'free-tier'
  | 'freemium'
  | 'self-hosted'
  | 'paid'
  | 'unverified';

export type VerificationStatus =
  | 'verified'
  | 'unverified'
  | 'pending'
  | 'broken'
  | 'redirected'
  | 'duplicate'
  | 'discontinued'
  | 'needs-review';

export interface VerificationEvidence {
  verifiedAt: string;
  sourceUrlChecked?: string;
  scope?: ('pricing' | 'license' | 'availability' | 'docs')[];
  method?: 'manual-inspection' | 'automated-pipeline' | 'maintainer-submission';
  notes?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ResourceCategory;
  subcategory: string;
  url: string;
  docsUrl?: string;
  repoUrl?: string;
  pricingType: PricingModel;
  accessModel?: AccessModel;
  openSource: boolean;
  license: string;
  authRequired?: boolean;
  creditCardRequired?: boolean | 'unverified';
  tierQuota?: string;
  tags: string[];
  featured?: boolean;
  rating?: number;
  stars?: string;
  lastVerifiedAt?: string;
  verificationStatus?: VerificationStatus;
  verificationEvidence?: VerificationEvidence;
  apiAvailable?: boolean;
  apiKeyRequired?: boolean;
}

export interface WorkflowCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  category: ResourceCategory | 'all';
  resourceIds: string[];
  estimatedCost: string;
}

export interface UserCustomCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  resourceIds: string[];
}

export interface StarterStack {
  id: string;
  title: string;
  targetAudience: string;
  description: string;
  category: ResourceCategory;
  resourceIds: string[];
}
