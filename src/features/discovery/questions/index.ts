import type { ServiceType } from '@/src/features/projects';
import type { DiscoverySection } from '../types';
import { COMMON_SECTIONS } from './common';
import { WEBSITE_SECTIONS } from './website';
import { SOFTWARE_SECTIONS } from './software';
import { MOBILE_APP_SECTIONS } from './mobile-app';
import { BRANDING_SECTIONS } from './branding';
import { LOGO_DESIGN_SECTIONS } from './logo-design';

/**
 * Service-specific sections, appended after the common sections.
 * To add questions for a service: edit the relevant file above.
 * To add a new service: add its file, import it, and add an entry below.
 */
const SERVICE_SECTIONS: Record<ServiceType, DiscoverySection[]> = {
  website:      WEBSITE_SECTIONS,
  software:     SOFTWARE_SECTIONS,
  'mobile-app': MOBILE_APP_SECTIONS,
  branding:     BRANDING_SECTIONS,
  'logo-design': LOGO_DESIGN_SECTIONS,
};

/** Returns the full ordered list of sections for a given service. */
export function getDiscoverySections(service: ServiceType): DiscoverySection[] {
  return [...COMMON_SECTIONS, ...(SERVICE_SECTIONS[service] ?? [])];
}

/** Total question count for a service (useful for progress). */
export function getDiscoveryQuestionCount(service: ServiceType): number {
  return getDiscoverySections(service).reduce((n, s) => n + s.questions.length, 0);
}
