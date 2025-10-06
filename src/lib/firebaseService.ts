import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db } from './firebase'
import { 
  Transaction, 
  MonthlyIncome, 
  MonthlyExpense, 
  Category, 
  Wish, 
  Notification, 
  ShoppingItem 
} from '@/types'

// Coleções do Firestore
const COLLECTIONS = {
  TRANSACTIONS: 'transactions',
  MONTHLY_INCOMES: 'monthlyIncomes',
  MONTHLY_EXPENSES: 'monthlyExpenses',
  CATEGORIES: 'categories',
  WISHES: 'wishes',
  NOTIFICATIONS: 'notifications',
  SHOPPING_LIST: 'shoppingList'
}

// Função para gerar ID único
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// ===== TRANSACTIONS =====
export const saveTransactions = async (transactions: Transaction[]): Promise<void> => {
  try {
    const batch = transactions.map(transaction => 
      setDoc(doc(db, COLLECTIONS.TRANSACTIONS, transaction.id), transaction)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving transactions:', error)
    throw error
  }
}

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.TRANSACTIONS), orderBy('date', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as Transaction)
  } catch (error) {
    console.error('Error loading transactions:', error)
    return []
  }
}

export const subscribeToTransactions = (callback: (transactions: Transaction[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.TRANSACTIONS), orderBy('date', 'desc'))
  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map(doc => doc.data() as Transaction)
    callback(transactions)
  })
}

// ===== MONTHLY INCOMES =====
export const saveMonthlyIncomes = async (monthlyIncomes: MonthlyIncome[]): Promise<void> => {
  try {
    const batch = monthlyIncomes.map(income => 
      setDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, income.id), income)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving monthly incomes:', error)
    throw error
  }
}

export const loadMonthlyIncomes = async (): Promise<MonthlyIncome[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.MONTHLY_INCOMES))
    return querySnapshot.docs.map(doc => doc.data() as MonthlyIncome)
  } catch (error) {
    console.error('Error loading monthly incomes:', error)
    return []
  }
}

export const subscribeToMonthlyIncomes = (callback: (incomes: MonthlyIncome[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, COLLECTIONS.MONTHLY_INCOMES), (querySnapshot) => {
    const incomes = querySnapshot.docs.map(doc => doc.data() as MonthlyIncome)
    callback(incomes)
  })
}

// ===== MONTHLY EXPENSES =====
export const saveMonthlyExpenses = async (monthlyExpenses: MonthlyExpense[]): Promise<void> => {
  try {
    const batch = monthlyExpenses.map(expense => 
      setDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, expense.id), expense)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving monthly expenses:', error)
    throw error
  }
}

export const loadMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.MONTHLY_EXPENSES))
    return querySnapshot.docs.map(doc => doc.data() as MonthlyExpense)
  } catch (error) {
    console.error('Error loading monthly expenses:', error)
    return []
  }
}

export const subscribeToMonthlyExpenses = (callback: (expenses: MonthlyExpense[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, COLLECTIONS.MONTHLY_EXPENSES), (querySnapshot) => {
    const expenses = querySnapshot.docs.map(doc => doc.data() as MonthlyExpense)
    callback(expenses)
  })
}

// ===== CATEGORIES =====
export const saveCategories = async (categories: Category[]): Promise<void> => {
  try {
    const batch = categories.map(category => 
      setDoc(doc(db, COLLECTIONS.CATEGORIES, category.id), category)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving categories:', error)
    throw error
  }
}

export const loadCategories = async (): Promise<Category[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES))
    return querySnapshot.docs.map(doc => doc.data() as Category)
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export const subscribeToCategories = (callback: (categories: Category[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, COLLECTIONS.CATEGORIES), (querySnapshot) => {
    const categories = querySnapshot.docs.map(doc => doc.data() as Category)
    callback(categories)
  })
}

// ===== WISHES =====
export const saveWishes = async (wishes: Wish[]): Promise<void> => {
  try {
    const batch = wishes.map(wish => 
      setDoc(doc(db, COLLECTIONS.WISHES, wish.id), wish)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving wishes:', error)
    throw error
  }
}

export const loadWishes = async (): Promise<Wish[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.WISHES))
    return querySnapshot.docs.map(doc => doc.data() as Wish)
  } catch (error) {
    console.error('Error loading wishes:', error)
    return []
  }
}

export const subscribeToWishes = (callback: (wishes: Wish[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, COLLECTIONS.WISHES), (querySnapshot) => {
    const wishes = querySnapshot.docs.map(doc => doc.data() as Wish)
    callback(wishes)
  })
}

// ===== NOTIFICATIONS =====
export const saveNotifications = async (notifications: Notification[]): Promise<void> => {
  try {
    const batch = notifications.map(notification => 
      setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notification.id), notification)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving notifications:', error)
    throw error
  }
}

export const loadNotifications = async (): Promise<Notification[]> => {
  try {
    const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => doc.data() as Notification)
  } catch (error) {
    console.error('Error loading notifications:', error)
    return []
  }
}

export const subscribeToNotifications = (callback: (notifications: Notification[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('timestamp', 'desc'))
  return onSnapshot(q, (querySnapshot) => {
    const notifications = querySnapshot.docs.map(doc => doc.data() as Notification)
    callback(notifications)
  })
}

// ===== SHOPPING LIST =====
export const saveShoppingList = async (shoppingList: ShoppingItem[]): Promise<void> => {
  try {
    const batch = shoppingList.map(item => 
      setDoc(doc(db, COLLECTIONS.SHOPPING_LIST, item.id), item)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving shopping list:', error)
    throw error
  }
}

export const loadShoppingList = async (): Promise<ShoppingItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.SHOPPING_LIST))
    return querySnapshot.docs.map(doc => doc.data() as ShoppingItem)
  } catch (error) {
    console.error('Error loading shopping list:', error)
    return []
  }
}

export const subscribeToShoppingList = (callback: (shoppingList: ShoppingItem[]) => void): Unsubscribe => {
  return onSnapshot(collection(db, COLLECTIONS.SHOPPING_LIST), (querySnapshot) => {
    const shoppingList = querySnapshot.docs.map(doc => doc.data() as ShoppingItem)
    callback(shoppingList)
  })
}

// ===== OPERAÇÕES INDIVIDUAIS =====

// Adicionar item individual
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
  const newTransaction: Transaction = {
    ...transaction,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, newTransaction.id), newTransaction)
}

export const addMonthlyIncome = async (income: Omit<MonthlyIncome, 'id'>): Promise<void> => {
  const newIncome: MonthlyIncome = {
    ...income,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, newIncome.id), newIncome)
}

export const addMonthlyExpense = async (expense: Omit<MonthlyExpense, 'id'>): Promise<void> => {
  const newExpense: MonthlyExpense = {
    ...expense,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, newExpense.id), newExpense)
}

export const addCategory = async (category: Omit<Category, 'id'>): Promise<void> => {
  const newCategory: Category = {
    ...category,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.CATEGORIES, newCategory.id), newCategory)
}

export const addWish = async (wish: Omit<Wish, 'id'>): Promise<void> => {
  const newWish: Wish = {
    ...wish,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.WISHES, newWish.id), newWish)
}

export const addNotification = async (notification: Omit<Notification, 'id'>): Promise<void> => {
  const newNotification: Notification = {
    ...notification,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, newNotification.id), newNotification)
}

export const addShoppingItem = async (item: Omit<ShoppingItem, 'id'>): Promise<void> => {
  const newItem: ShoppingItem = {
    ...item,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.SHOPPING_LIST, newItem.id), newItem)
}

// Atualizar item individual
export const updateMonthlyIncome = async (id: string, data: Partial<Omit<MonthlyIncome, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, id), data)
}

export const updateMonthlyExpense = async (id: string, data: Partial<Omit<MonthlyExpense, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, id), data)
}

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), data)
}

export const updateShoppingItem = async (id: string, data: Partial<Omit<ShoppingItem, 'id'>>): Promise<void> => {
  await updateDoc(doc(db, COLLECTIONS.SHOPPING_LIST, id), data)
}

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { isRead: true })
}

// Deletar item individual
export const deleteMonthlyIncome = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, id))
}

export const deleteMonthlyExpense = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, id))
}

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id))
}

export const deleteNotification = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id))
}

export const deleteShoppingItem = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, COLLECTIONS.SHOPPING_LIST, id))
}
