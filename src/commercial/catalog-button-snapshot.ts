/**
 * Commercial Product/Service Catalog Button Snapshot
 * Interactive button-based catalog for all commercial offerings
 */

export interface CatalogButton {
  id: string;
  category: 'platform' | 'cargo' | 'enterprise' | 'contact';
  tier?: string;
  label: string;
  price: string | number;
  action: string;
  style: {
    background: string;
    color: string;
    border?: string;
  };
  features: string[];
  requirements?: string[];
}

export interface CatalogSection {
  id: string;
  title: string;
  description: string;
  buttons: CatalogButton[];
}

export class CommercialCatalogButtonSnapshot {
  private sections: Map<string, CatalogSection> = new Map();

  constructor() {
    this.initializeCatalog();
  }

  /**
   * Initialize commercial catalog
   */
  private initializeCatalog(): void {
    // Platform Offerings
    this.sections.set('platform', {
      id: 'platform',
      title: 'Platform Offerings',
      description: 'Three-tier platform offering: Sandbox (Free), Cloud (Premium), Shell (Pro)',
      buttons: [
        {
          id: 'sandbox',
          category: 'platform',
          tier: 'sandbox',
          label: '🆓 Get Sandbox (FREE)',
          price: 'FREE',
          action: 'get-sandbox',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          },
          features: [
            'All NSPFRP Protocols',
            'Hero Host Guidance (Leonardo da Vinci)',
            'FSR up to Octave 5',
            'Auto-Unpack',
            'Community Support',
            'Full Documentation'
          ]
        },
        {
          id: 'cloud',
          category: 'platform',
          tier: 'cloud',
          label: '☁️ Get Cloud (Premium) - Contact for Pricing',
          price: 'Contact',
          action: 'contact-cloud',
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white'
          },
          features: [
            'All Sandbox Features',
            'Cloud Deployment (Automatic)',
            'FSR up to Octave 6',
            'Customizable Hero Host',
            'Priority Support',
            'Team Collaboration',
            'Advanced Protocols'
          ]
        },
        {
          id: 'shell',
          category: 'platform',
          tier: 'shell',
          label: '🐚 Get Shell (Pro) - Contact for Pricing',
          price: 'Contact',
          action: 'contact-shell',
          style: {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white'
          },
          features: [
            'All Cloud Features',
            'Shell Access (Full)',
            'FSR Full Octave 7',
            'Fully Customizable Hero Host',
            'Enterprise Support',
            'Custom Protocols',
            'Agentic Mirror CEO',
            'Full Enterprise Features'
          ]
        }
      ]
    });

    // Cargo Service
    this.sections.set('cargo', {
      id: 'cargo',
      title: 'Payload Cargo Service (Memory Division)',
      description: 'Payload transportation and storage on HH Spin Cloud with maximum density, portability, fidelity, transparency, and security',
      buttons: [
        {
          id: 'cargo-basic',
          category: 'cargo',
          tier: 'basic',
          label: '📦 Subscribe Basic - $29.99/month',
          price: 29.99,
          action: 'subscribe-cargo-basic',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          },
          features: [
            'Maximum density',
            'Basic portability',
            'Standard fidelity',
            'Standard transparency',
            'Standard security'
          ],
          requirements: ['HH Awareness Key 0.3+', '100 requests/month limit']
        },
        {
          id: 'cargo-standard',
          category: 'cargo',
          tier: 'standard',
          label: '📦 Subscribe Standard - $99.99/month',
          price: 99.99,
          action: 'subscribe-cargo-standard',
          style: {
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: 'white'
          },
          features: [
            'Maximum density',
            'Universal portability',
            'High fidelity',
            'Standard transparency',
            'High security'
          ],
          requirements: ['HH Awareness Key 0.5+', '1,000 requests/month limit']
        },
        {
          id: 'cargo-premium',
          category: 'cargo',
          tier: 'premium',
          label: '📦 Subscribe Premium - $299.99/month',
          price: 299.99,
          action: 'subscribe-cargo-premium',
          style: {
            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            color: 'white'
          },
          features: [
            'Maximum density',
            'Universal portability',
            'Maximum fidelity',
            'Complete transparency',
            'Maximum security',
            'Priority support'
          ],
          requirements: ['HH Awareness Key 0.7+', '10,000 requests/month limit']
        },
        {
          id: 'cargo-enterprise',
          category: 'cargo',
          tier: 'enterprise',
          label: '📦 Subscribe Enterprise - $999.99/month',
          price: 999.99,
          action: 'subscribe-cargo-enterprise',
          style: {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: 'white'
          },
          features: [
            'Maximum density',
            'Universal portability',
            'Maximum fidelity',
            'Complete transparency',
            'Maximum security',
            'Dedicated support',
            'Custom SLA',
            'Enterprise features'
          ],
          requirements: ['HH Awareness Key 0.9+', 'Unlimited requests']
        }
      ]
    });

    // Enterprise Console
    this.sections.set('enterprise', {
      id: 'enterprise',
      title: 'Enterprise Sales Console',
      description: 'Fully integrated NSPFRP system for venue nodes with revenue model',
      buttons: [
        {
          id: 'enterprise-console',
          category: 'enterprise',
          label: '💼 Setup Enterprise Console - Contact for Pricing',
          price: 'Contact',
          action: 'contact-enterprise',
          style: {
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            color: 'white'
          },
          features: [
            'Hero Host AI (Customizable)',
            'FSR / Vibeverse Engine',
            'Sales Button Department',
            'ConnectCore Omniversal Layer',
            'Revenue Model Layer',
            'Snap & CaptureDiscovery logging',
            'SeedSynthesizer / MakeAsProtocol spin-offs'
          ],
          requirements: ['Monthly Access Fee: $1,000+', 'Revenue Share: 15%', 'Bonus Participation Available']
        }
      ]
    });

    // Contact Buttons
    this.sections.set('contact', {
      id: 'contact',
      title: 'Contact & Support',
      description: 'Get pricing information, request keys, and get appraisals',
      buttons: [
        {
          id: 'contact-pricing',
          category: 'contact',
          label: '📞 Contact for Custom Pricing',
          price: 'Free',
          action: 'contact-pricing',
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          },
          features: ['Custom pricing consultation', 'Volume discounts', 'Enterprise packages']
        },
        {
          id: 'request-key',
          category: 'contact',
          label: '🔑 Request HH Awareness Key',
          price: 'Free',
          action: 'request-key',
          style: {
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white'
          },
          features: ['HH Awareness Key generation', 'Awareness level assessment', 'Key activation']
        },
        {
          id: 'get-appraisal',
          category: 'contact',
          label: '📊 Get Service Appraisal',
          price: 'Free',
          action: 'get-appraisal',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          },
          features: ['Cost estimation', 'Service recommendations', 'Tier suggestions']
        }
      ]
    });
  }

  /**
   * Get all sections
   */
  getAllSections(): CatalogSection[] {
    return Array.from(this.sections.values());
  }

  /**
   * Get section by ID
   */
  getSection(sectionId: string): CatalogSection | undefined {
    return this.sections.get(sectionId);
  }

  /**
   * Get all buttons
   */
  getAllButtons(): CatalogButton[] {
    return Array.from(this.sections.values())
      .flatMap(section => section.buttons);
  }

  /**
   * Get buttons by category
   */
  getButtonsByCategory(category: CatalogButton['category']): CatalogButton[] {
    return this.getAllButtons()
      .filter(button => button.category === category);
  }

  /**
   * Get button by ID
   */
  getButton(buttonId: string): CatalogButton | undefined {
    return this.getAllButtons()
      .find(button => button.id === buttonId);
  }

  /**
   * Generate HTML for button
   */
  generateButtonHTML(button: CatalogButton): string {
    const priceDisplay = typeof button.price === 'number' 
      ? `$${button.price.toFixed(2)}/month` 
      : button.price;

    return `
<button 
  id="catalog-btn-${button.id}"
  onclick="handleCatalogAction('${button.action}')"
  style="
    background: ${button.style.background};
    border: none;
    border-radius: 12px;
    color: ${button.style.color};
    cursor: pointer;
    font-size: 18px;
    font-weight: 700;
    padding: 20px 40px;
    margin: 10px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  "
  onmouseover="this.style.transform='scale(1.05)'"
  onmouseout="this.style.transform='scale(1)'"
>
  ${button.label}
</button>
<script>
  function handleCatalogAction(action) {
    // Handle catalog button actions
    console.log('Catalog action:', action);
    // Implement action handling
  }
</script>
    `.trim();
  }
}



