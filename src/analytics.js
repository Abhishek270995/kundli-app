/**
 * Google Analytics (GA4) Event Dispatcher for Jyotish Paramarsh
 */

export function trackEvent(action, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, params);
    }
  } catch (err) {
    console.debug('Analytics error:', err);
  }
}

/**
 * Common App Event Trackers
 */
export const Analytics = {
  // When user switches top level tools (Kundli, Panchang, Muhurat, Milan, Horoscope, Festivals)
  toolSwitch: (toolName) => {
    trackEvent('tool_switch', {
      tool_name: toolName,
      timestamp: new Date().toISOString()
    });
  },

  // When a user generates a Kundli
  generateKundli: (isSample = false) => {
    trackEvent('generate_kundli', {
      is_sample_demo: isSample,
      event_category: 'Calculation'
    });
  },

  // When user downloads / prints the 50-page Dossier PDF
  printReport: (type = 'dossier') => {
    trackEvent('print_report', {
      report_type: type,
      event_category: 'Engagement'
    });
  },

  // When user clicks voluntary Dakshina / Seva Bhent
  dakshinaClick: (currency, amount) => {
    trackEvent('dakshina_click', {
      currency,
      value: amount,
      event_category: 'Offering'
    });
  },

  // When user changes language or currency
  preferenceChange: (prefType, value) => {
    trackEvent('preference_change', {
      preference_type: prefType,
      value: value
    });
  }
};
