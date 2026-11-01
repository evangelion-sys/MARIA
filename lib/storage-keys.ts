/**
 * Centralized Local Storage Keys for MARIA Client Architecture
 * 
 * Kept strictly independent of dataset bundles to prevent unnecessary
 * JavaScript chunk bloat on static/informational routes.
 */
export const STORAGE_KEYS = {
  VERSION: 'maria_stack_version',
  SAVED_STACK: 'maria_stack_v1',
  LEGACY_SAVED_STACK: 'maria_saved_stack',
  RECENTLY_VIEWED: 'maria_recently_viewed_v1',
  LEGACY_RECENTLY_VIEWED: 'maria_recently_viewed',
  CUSTOM_COLLECTIONS: 'maria_custom_collections_v1',
  LEGACY_CUSTOM_COLLECTIONS: 'maria_custom_collections',
  USER_SUBMISSIONS: 'maria_user_submissions',
  EXTERNAL_LINK_PREF: 'maria_ext_link_pref',
} as const;

export const MAX_SAVED_STACK_ITEMS = 100;
export const MAX_RECENT_ITEMS = 15;
export const MAX_CUSTOM_COLLECTIONS = 50;
