import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

void i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  resources: {
    fr: {
      translation: {
        appName: 'MarketPulse',
        tagline: 'Radar intelligent du marché marocain.',
      },
    },
  },
  interpolation: { escapeValue: false },
})

export default i18n
