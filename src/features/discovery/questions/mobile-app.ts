import type { DiscoverySection } from '../types';

/**
 * Mobile application discovery sections.
 */
export const MOBILE_APP_SECTIONS: DiscoverySection[] = [
  {
    id: 'app_platform',
    title: 'Platform & App Type',
    icon: 'smartphone',
    description: 'Tell us about which platforms and the type of app.',
    questions: [
      {
        id: 'app_platforms',
        label: 'Which platforms do you need?',
        type: 'checkbox',
        required: true,
        options: [
          'iOS (iPhone / iPad)',
          'Android',
          'Both iOS & Android',
          'Web app (mobile-responsive)',
          'Progressive Web App (PWA)',
        ],
      },
      {
        id: 'app_type',
        label: 'What type of mobile app is this?',
        type: 'checkbox',
        required: true,
        options: [
          'Consumer app (B2C)',
          'Business / enterprise app (B2B)',
          'Internal / employee app',
          'E-commerce / marketplace',
          'Social / community',
          'Health & fitness',
          'On-demand / delivery',
          'Educational / e-learning',
          'Utility / productivity',
          'Other',
        ],
      },
      {
        id: 'app_problem',
        label: 'What problem does this app solve for users?',
        type: 'textarea',
        placeholder: 'Our users currently struggle with… the app will allow them to…',
        required: true,
      },
      {
        id: 'app_has_designs',
        label: 'Do you already have designs / wireframes?',
        type: 'radio',
        options: [
          'Yes — full designs ready (Figma / XD)',
          'Yes — wireframes / rough sketches',
          'No — design is part of the project scope',
        ],
      },
    ],
  },

  {
    id: 'app_features',
    title: 'Core Features',
    icon: 'widgets',
    description: 'Help us understand what the app needs to do.',
    questions: [
      {
        id: 'app_must_have',
        label: 'What are the must-have features (MVP)?',
        type: 'textarea',
        placeholder: 'User registration, profile, product listing, cart, checkout, order tracking…',
        required: true,
      },
      {
        id: 'app_common_features',
        label: 'Which features does the app need?',
        type: 'checkbox',
        options: [
          'User registration / login',
          'User profiles',
          'Push notifications',
          'In-app messaging / chat',
          'Maps / geolocation',
          'Camera / photo upload',
          'In-app purchases',
          'Subscriptions / payments',
          'Offline mode',
          'Audio / video playback',
          'Real-time updates',
          'Social sharing',
          'QR code / barcode scanner',
          'Biometric authentication (Face ID / Touch ID)',
        ],
      },
      {
        id: 'app_backend',
        label: 'Does the app need a backend / server?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'app_backend_existing',
        label: 'Do you have an existing backend/API?',
        type: 'boolean',
        showWhen: { questionId: 'app_backend', value: true },
      },
    ],
  },

  {
    id: 'app_launch',
    title: 'Launch & Distribution',
    icon: 'rocket_launch',
    description: 'Help us plan the release and distribution strategy.',
    questions: [
      {
        id: 'app_store_submission',
        label: 'Do you need App Store / Play Store submission?',
        type: 'boolean',
        required: true,
      },
      {
        id: 'app_store_account',
        label: 'Do you have developer accounts already?',
        type: 'radio',
        showWhen: { questionId: 'app_store_submission', value: true },
        options: [
          'Yes — Apple Developer & Google Play both',
          'Yes — Apple Developer only',
          'Yes — Google Play only',
          'No — need to create them',
        ],
      },
      {
        id: 'app_monetisation',
        label: 'What is the monetisation model?',
        type: 'radio',
        options: [
          'Free (no monetisation)',
          'Freemium (free + paid features)',
          'Subscription',
          'One-time purchase',
          'In-app purchases',
          'Ads',
          'Not decided yet',
        ],
      },
      {
        id: 'app_expected_users',
        label: 'How many users do you expect at launch?',
        type: 'select',
        options: [
          'Under 100 (beta / pilot)',
          '100 – 1,000',
          '1,000 – 10,000',
          '10,000+',
          'Unknown — depends on marketing',
        ],
      },
    ],
  },
];
