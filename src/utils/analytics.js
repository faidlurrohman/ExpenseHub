import analytics from '@react-native-firebase/analytics';

export const logEvent = async (eventName, params = {}) => {
  await analytics().logEvent(eventName, params);
};

export const trackScreenView = async screenName => {
  await analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenName,
  });
};

export const trackExpenseAdded = async (amount, category, merchant) => {
  await logEvent('expense_added', {
    amount: amount,
    category: category,
    merchant: merchant || 'unknown',
    currency: 'IDR',
    value: amount / 1000, // Convert to thousands for analytics
  });
};

export const trackOCRUsed = async success => {
  await logEvent('ocr_scan', {
    success: success,
    method: 'receipt',
  });
};

export const trackBudgetSet = async budgetAmount => {
  await logEvent('budget_set', {
    amount: budgetAmount,
    currency: 'IDR',
    value: budgetAmount / 1000,
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
