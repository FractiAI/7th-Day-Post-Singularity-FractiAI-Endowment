/**
 * Commercial Catalog Button
 * Button to open/display the commercial product/service catalog
 */

export interface CatalogButtonConfig {
  id: string;
  label: string;
  icon: string;
  action: 'open-catalog' | 'view-catalog' | 'download-catalog';
  target?: 'modal' | 'page' | 'new-tab' | 'download';
  style?: 'primary' | 'secondary' | 'outline' | 'gradient';
}

export class CommercialCatalogButton {
  private config: CatalogButtonConfig;

  constructor(config?: Partial<CatalogButtonConfig>) {
    this.config = {
      id: config?.id || 'commercial-catalog-button',
      label: config?.label || '💼 View Commercial Catalog',
      icon: config?.icon || '💼',
      action: config?.action || 'open-catalog',
      target: config?.target || 'modal',
      style: config?.style || 'gradient'
    };
  }

  /**
   * Generate catalog button HTML
   */
  generateButtonHTML(): string {
    const style = this.getButtonStyle();
    
    return `
<button 
  id="${this.config.id}"
  onclick="openCommercialCatalog('${this.config.target}')"
  style="${style}"
  onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)'"
  onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'"
>
  ${this.config.icon} ${this.config.label}
</button>

<script>
  function openCommercialCatalog(target) {
    if (target === 'modal') {
      // Open catalog in modal
      const modal = document.createElement('div');
      modal.id = 'catalog-modal';
      modal.style.cssText = \`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: auto;
      \`;
      
      modal.innerHTML = \`
        <div style="
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        ">
          <button 
            onclick="document.getElementById('catalog-modal').remove()"
            style="
              position: absolute;
              top: 20px;
              right: 20px;
              background: #ef4444;
              color: white;
              border: none;
              border-radius: 8px;
              padding: 8px 16px;
              cursor: pointer;
              font-size: 18px;
            "
          >
            ✕ Close
          </button>
          <iframe 
            src="/COMMERCIAL_PRODUCT_SERVICE_CATALOG_BUTTON_SNAPSHOT.html"
            style="
              width: 100%;
              height: 80vh;
              border: none;
              border-radius: 8px;
            "
          ></iframe>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
    } else if (target === 'page') {
      // Navigate to catalog page
      window.location.href = '/commercial-catalog';
      
    } else if (target === 'new-tab') {
      // Open in new tab
      window.open('/commercial-catalog', '_blank');
      
    } else if (target === 'download') {
      // Download catalog PDF
      window.open('/commercial-catalog.pdf', '_blank');
    }
  }
</script>
    `.trim();
  }

  /**
   * Get button style based on config
   */
  private getButtonStyle(): string {
    const baseStyle = `
      border: none;
      border-radius: 12px;
      color: white;
      cursor: pointer;
      font-size: 18px;
      font-weight: 700;
      padding: 20px 40px;
      margin: 10px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    `;

    switch (this.config.style) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          ${baseStyle}
        `;
      
      case 'secondary':
        return `
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          ${baseStyle}
        `;
      
      case 'outline':
        return `
          background: transparent;
          border: 2px solid #667eea;
          color: #667eea;
          ${baseStyle}
          box-shadow: none;
        `;
      
      case 'gradient':
      default:
        return `
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          ${baseStyle}
        `;
    }
  }

  /**
   * Generate markdown button
   */
  generateMarkdownButton(): string {
    return `[${this.config.icon} ${this.config.label}](#commercial-catalog)`;
  }

  /**
   * Generate simple button (minimal HTML)
   */
  generateSimpleButton(): string {
    return `
<button 
  onclick="window.open('/commercial-catalog', '_blank')"
  style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
  "
>
  ${this.config.icon} ${this.config.label}
</button>
    `.trim();
  }

  /**
   * Generate button for email
   */
  generateEmailButton(): string {
    return `
<a 
  href="https://nspfrp.vercel.app/commercial-catalog"
  style="
    display: inline-block;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    padding: 12px 24px;
    margin: 10px 0;
  "
>
  ${this.config.icon} ${this.config.label}
</a>
    `.trim();
  }
}









