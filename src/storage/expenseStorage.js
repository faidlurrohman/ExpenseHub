import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PROFILE = 'sps_profile';
const KEY_EXPENSES = 'sps_expenses';

export const getProfile = async () => {
  try {
    const val = await AsyncStorage.getItem(KEY_PROFILE);
    return val ? JSON.parse(val) : { name: 'Teman', budget: 2000000 };
  } catch (e) {
    return { name: 'Teman', budget: 2000000 };
  }
};

export const saveProfile = async data => {
  await AsyncStorage.setItem(KEY_PROFILE, JSON.stringify(data));
};

export const getExpenses = async () => {
  try {
    const val = await AsyncStorage.getItem(KEY_EXPENSES);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
};

export const addExpense = async expense => {
  const list = await getExpenses();
  const newExpense = { ...expense, id: Date.now().toString() };
  await AsyncStorage.setItem(
    KEY_EXPENSES,
    JSON.stringify([newExpense, ...list]),
  );
  return newExpense;
};
