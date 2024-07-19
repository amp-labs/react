// src/types/custom-elements.d.ts
import { AmpersandInstallIntegrationProps } from '../webComponents/webcomponent';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'web-install-integration':
      React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      & AmpersandInstallIntegrationProps;
    }
  }
}

// Ensure this file is treated as a module
export {};
