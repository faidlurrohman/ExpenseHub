import {
  getAnalytics,
  logEvent as logEventFirebase,
} from '@react-native-firebase/analytics';

export const logEvent = async (eventName, params = {}) => {
  const analytics = getAnalytics();
  await logEventFirebase(analytics, eventName, params);
};

export const trackScreenView = async screenName => {
  const analytics = getAnalytics();
  await logEventFirebase(analytics, 'screen_view', {
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const trackExpenseAdded = async (
  amount,
  category,
  merchant,
  currency = 'IDR',
) => {
  await logEvent('expense_added', {
    amount: amount,
    category: category,
    merchant: merchant || 'unknown',
    currency: currency,
    value: parseFloat((amount / 1000).toFixed(2)),
  });
};

export const trackOCRUsed = async success => {
  await logEvent('ocr_scan', {
    success: success,
    method: 'receipt',
  });
};

export const trackBudgetSet = async (budgetAmount, currency = 'IDR') => {
  await logEvent('budget_set', {
    amount: budgetAmount,
    currency: currency,
    value: parseFloat((budgetAmount / 1000).toFixed(2)),
  });
};

export const trackDataExport = async format => {
  await logEvent('data_export', {
    format: format,
  });
};

export const trackOnboardingComplete = async () => {
  await logEvent('onboarding_complete', {
    timestamp: new Date().toISOString(),
  });
};

export const trackSearch = async (query, resultsCount) => {
  await logEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
};
