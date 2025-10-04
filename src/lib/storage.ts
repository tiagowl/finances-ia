import { Transaction, MonthlyIncome, MonthlyExpense, Category, Wish, Notification, ShoppingItem } from "@/types"

const STORAGE_KEYS = {
  TRANSACTIONS: 'finances-transactions',
  MONTHLY_INCOMES: 'finances-monthly-incomes',
  MONTHLY_EXPENSES: 'finances-monthly-expenses',
  CATEGORIES: 'finances-categories',
  WISHES: 'finances-wishes',
  NOTIFICATIONS: 'finances-notifications',
  SHOPPING_LIST: 'finances-shopping-list'
}

// Generic storage functions
export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage:`, error)
  }
}

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading from localStorage:`, error)
    return defaultValue
  }
}

// Specific functions for each data type
export const saveTransactions = (transactions: Transaction[]): void => {
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions)
}

export const loadTransactions = (): Transaction[] => {
  return loadFromStorage(STORAGE_KEYS.TRANSACTIONS, [])
}

export const saveMonthlyIncomes = (monthlyIncomes: MonthlyIncome[]): void => {
  saveToStorage(STORAGE_KEYS.MONTHLY_INCOMES, monthlyIncomes)
}

export const loadMonthlyIncomes = (): MonthlyIncome[] => {
  const incomes = loadFromStorage(STORAGE_KEYS.MONTHLY_INCOMES, [])
  
  // Migração de dados antigos: adicionar dayOfMonth se não existir
  const migratedIncomes = incomes.map((income: any) => {
    if (!income.dayOfMonth) {
      // Se não tem dayOfMonth, usar o dia 5 como padrão (comum para salários)
      return {
        ...income,
        dayOfMonth: 5
      }
    }
    return income
  })
  
  // Salvar dados migrados se houve mudança
  const hasChanges = migratedIncomes.some((income: any, index) => {
    const originalIncome = incomes[index] as any
    return income.dayOfMonth !== originalIncome?.dayOfMonth
  })
  
  if (hasChanges) {
    saveToStorage(STORAGE_KEYS.MONTHLY_INCOMES, migratedIncomes)
  }
  
  return migratedIncomes
}

export const saveMonthlyExpenses = (monthlyExpenses: MonthlyExpense[]): void => {
  saveToStorage(STORAGE_KEYS.MONTHLY_EXPENSES, monthlyExpenses)
}

export const loadMonthlyExpenses = (): MonthlyExpense[] => {
  const expenses = loadFromStorage(STORAGE_KEYS.MONTHLY_EXPENSES, [])
  
  // Migração de dados antigos: adicionar dayOfMonth se não existir
  const migratedExpenses = expenses.map((expense: any) => {
    if (!expense.dayOfMonth) {
      // Se não tem dayOfMonth, usar o dia 15 como padrão
      return {
        ...expense,
        dayOfMonth: 15
      }
    }
    return expense
  })
  
  // Salvar dados migrados se houve mudança
  const hasChanges = migratedExpenses.some((expense: any, index) => {
    const originalExpense = expenses[index] as any
    return expense.dayOfMonth !== originalExpense?.dayOfMonth
  })
  
  if (hasChanges) {
    saveToStorage(STORAGE_KEYS.MONTHLY_EXPENSES, migratedExpenses)
  }
  
  return migratedExpenses
}

export const saveCategories = (categories: Category[]): void => {
  saveToStorage(STORAGE_KEYS.CATEGORIES, categories)
}

export const loadCategories = (): Category[] => {
  return loadFromStorage(STORAGE_KEYS.CATEGORIES, [])
}

export const saveWishes = (wishes: Wish[]): void => {
  saveToStorage(STORAGE_KEYS.WISHES, wishes)
}

export const loadWishes = (): Wish[] => {
  return loadFromStorage(STORAGE_KEYS.WISHES, [])
}

export const saveNotifications = (notifications: Notification[]): void => {
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications)
}

export const loadNotifications = (): Notification[] => {
  return loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, [])
}

export const saveShoppingList = (shoppingList: ShoppingItem[]): void => {
  saveToStorage(STORAGE_KEYS.SHOPPING_LIST, shoppingList)
}

export const loadShoppingList = (): ShoppingItem[] => {
  return loadFromStorage(STORAGE_KEYS.SHOPPING_LIST, [])
}

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
