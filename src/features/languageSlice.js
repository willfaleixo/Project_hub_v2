import { createSlice } from '@reduxjs/toolkit';
import { translations } from '../i18n/translations';

const savedLang = localStorage.getItem('hub_language') || 'pt';

const initialState = {
  currentLanguage: savedLang,
  translations: translations[savedLang] || translations.pt
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      const lang = action.payload;
      if (translations[lang]) {
        state.currentLanguage = lang;
        state.translations = translations[lang];
        localStorage.setItem('hub_language', lang);
      }
    }
  }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
