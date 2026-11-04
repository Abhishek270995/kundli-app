/**
 * Google Analytics (GA4) Event Dispatcher for Jyotish Paramarsh
 * Instruments Funnel Conversions & Key Events
 */

/**
 * Safe, universal GA4 event tracking helper
 * @param {string} eventName - GA4 event name (e.g. kundli_generated, tool_calculated)
 * @param {object} params - Semantic parameters payload
 */
export function trackJyotishEvent(eventName, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.debug(`[GA4 Event: ${eventName}]`, params);
      }
    }
  } catch (err) {
    console.debug('Analytics error:', err);
  }
}

// Backward compatibility alias
export const trackEvent = trackJyotishEvent;

/**
 * Key Action Trackers for Jyotish Paramarsh Funnel
 */
export const Analytics = {
  // 1. Kundli Generated
  kundliGenerated: ({ language = "en", usedSampleCity = false, hasCustomName = false }) => {
    trackJyotishEvent('kundli_generated', {
      language,
      used_sample_city: Boolean(usedSampleCity),
      has_custom_name: Boolean(hasCustomName)
    });
  },

  // 2. Sample Kundli Clicked
  sampleKundliClicked: ({ language = "en", buttonLocation = "hero" } = {}) => {
    trackJyotishEvent('sample_kundli_clicked', {
      language,
      button_location: buttonLocation
    });
  },

  // 3. Dossier Downloaded / Printed
  dossierDownloaded: ({ language = "en", reportType = "all" } = {}) => {
    trackJyotishEvent('dossier_downloaded', {
      language,
      report_type: reportType
    });
  },

  // 4. Tool Calculated
  toolCalculated: ({ toolName, language = "en" }) => {
    trackJyotishEvent('tool_calculated', {
      tool_name: toolName,
      language
    });
  },

  // 5. Dakshina Initiated
  dakshinaInitiated: ({ regionTab = "USD", amount = "$1.99" }) => {
    trackJyotishEvent('dakshina_initiated', {
      region_tab: regionTab,
      amount: String(amount)
    });
  },

  // Supporting preference / switch events
  toolSwitch: (toolName) => {
    trackJyotishEvent('tool_switch', {
      tool_name: toolName,
      timestamp: new Date().toISOString()
    });
  },

  preferenceChange: (prefType, value) => {
    trackJyotishEvent('preference_change', {
      preference_type: prefType,
      value: value
    });
  }
};
