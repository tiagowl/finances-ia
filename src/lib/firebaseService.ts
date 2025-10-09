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
import * as LocalStorage from './storage'

// Flag para verificar se o Firebase está disponível
let isFirebaseAvailable = true

// Verificar se o Firebase está configurado corretamente
try {
  if (!db) {
    isFirebaseAvailable = false
    console.warn('Firebase não está configurado. Usando localStorage como fallback.')
  }
} catch (error) {
  isFirebaseAvailable = false
  console.warn('Firebase não está disponível. Usando localStorage como fallback.', error)
}

// Função helper para disparar evento customizado quando localStorage muda
const dispatchStorageChangeEvent = (key: string) => {
  window.dispatchEvent(new CustomEvent('localStorageChange', { detail: { key } }))
}

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
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = transactions.map(transaction => 
      setDoc(doc(db!, COLLECTIONS.TRANSACTIONS, transaction.id), transaction)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving transactions:', error)
    throw error
  }
}

export const loadTransactions = async (): Promise<Transaction[]> => {
  if (!db) {
    return []
  }
  
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
  if (!db) {
    return () => {}
  }
  
  try {
    const q = query(collection(db, COLLECTIONS.TRANSACTIONS), orderBy('date', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => doc.data() as Transaction)
      callback(transactions)
    })
  } catch (error) {
    console.error('Error subscribing to transactions:', error)
    return () => {}
  }
}

// ===== MONTHLY INCOMES =====
export const saveMonthlyIncomes = async (monthlyIncomes: MonthlyIncome[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = monthlyIncomes.map(income => 
      setDoc(doc(db!, COLLECTIONS.MONTHLY_INCOMES, income.id), income)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving monthly incomes:', error)
    throw error
  }
}

export const loadMonthlyIncomes = async (): Promise<MonthlyIncome[]> => {
  if (!isFirebaseAvailable || !db) {
    return LocalStorage.loadMonthlyIncomes()
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.MONTHLY_INCOMES))
    return querySnapshot.docs.map(doc => doc.data() as MonthlyIncome)
  } catch (error) {
    console.error('Error loading monthly incomes from Firebase, using localStorage:', error)
    return LocalStorage.loadMonthlyIncomes()
  }
}

export const subscribeToMonthlyIncomes = (callback: (incomes: MonthlyIncome[]) => void): Unsubscribe => {
  if (!isFirebaseAvailable || !db) {
    // Para localStorage, retornar uma função vazia de unsubscribe
    // já que os dados serão carregados via load
    return () => {}
  }
  
  try {
    return onSnapshot(collection(db, COLLECTIONS.MONTHLY_INCOMES), (querySnapshot) => {
      const incomes = querySnapshot.docs.map(doc => doc.data() as MonthlyIncome)
      callback(incomes)
    })
  } catch (error) {
    console.error('Erro ao se inscrever no Firebase:', error)
    return () => {}
  }
}

// ===== MONTHLY EXPENSES =====
export const saveMonthlyExpenses = async (monthlyExpenses: MonthlyExpense[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = monthlyExpenses.map(expense => 
      setDoc(doc(db!, COLLECTIONS.MONTHLY_EXPENSES, expense.id), expense)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving monthly expenses:', error)
    throw error
  }
}

export const loadMonthlyExpenses = async (): Promise<MonthlyExpense[]> => {
  if (!isFirebaseAvailable || !db) {
    return LocalStorage.loadMonthlyExpenses()
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.MONTHLY_EXPENSES))
    return querySnapshot.docs.map(doc => doc.data() as MonthlyExpense)
  } catch (error) {
    console.error('Error loading monthly expenses from Firebase, using localStorage:', error)
    return LocalStorage.loadMonthlyExpenses()
  }
}

export const subscribeToMonthlyExpenses = (callback: (expenses: MonthlyExpense[]) => void): Unsubscribe => {
  if (!isFirebaseAvailable || !db) {
    // Para localStorage, retornar uma função vazia de unsubscribe
    return () => {}
  }
  
  try {
    return onSnapshot(collection(db, COLLECTIONS.MONTHLY_EXPENSES), (querySnapshot) => {
      const expenses = querySnapshot.docs.map(doc => doc.data() as MonthlyExpense)
      callback(expenses)
    })
  } catch (error) {
    console.error('Erro ao se inscrever no Firebase:', error)
    return () => {}
  }
}

// ===== CATEGORIES =====
export const saveCategories = async (categories: Category[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = categories.map(category => 
      setDoc(doc(db!, COLLECTIONS.CATEGORIES, category.id), category)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving categories:', error)
    throw error
  }
}

export const loadCategories = async (): Promise<Category[]> => {
  if (!db) {
    return []
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES))
    return querySnapshot.docs.map(doc => doc.data() as Category)
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export const subscribeToCategories = (callback: (categories: Category[]) => void): Unsubscribe => {
  if (!db) {
    return () => {}
  }
  
  try {
    return onSnapshot(collection(db, COLLECTIONS.CATEGORIES), (querySnapshot) => {
      const categories = querySnapshot.docs.map(doc => doc.data() as Category)
      callback(categories)
    })
  } catch (error) {
    console.error('Error subscribing to categories:', error)
    return () => {}
  }
}

// ===== WISHES =====
export const saveWishes = async (wishes: Wish[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = wishes.map(wish => 
      setDoc(doc(db!, COLLECTIONS.WISHES, wish.id), wish)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving wishes:', error)
    throw error
  }
}

export const loadWishes = async (): Promise<Wish[]> => {
  if (!db) {
    return []
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.WISHES))
    return querySnapshot.docs.map(doc => doc.data() as Wish)
  } catch (error) {
    console.error('Error loading wishes:', error)
    return []
  }
}

export const subscribeToWishes = (callback: (wishes: Wish[]) => void): Unsubscribe => {
  if (!db) {
    return () => {}
  }
  
  try {
    return onSnapshot(collection(db, COLLECTIONS.WISHES), (querySnapshot) => {
      const wishes = querySnapshot.docs.map(doc => doc.data() as Wish)
      callback(wishes)
    })
  } catch (error) {
    console.error('Error subscribing to wishes:', error)
    return () => {}
  }
}

// ===== NOTIFICATIONS =====
export const saveNotifications = async (notifications: Notification[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = notifications.map(notification => 
      setDoc(doc(db!, COLLECTIONS.NOTIFICATIONS, notification.id), notification)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving notifications:', error)
    throw error
  }
}

export const loadNotifications = async (): Promise<Notification[]> => {
  if (!db) {
    return []
  }
  
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
  if (!db) {
    return () => {}
  }
  
  try {
    const q = query(collection(db, COLLECTIONS.NOTIFICATIONS), orderBy('timestamp', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => doc.data() as Notification)
      callback(notifications)
    })
  } catch (error) {
    console.error('Error subscribing to notifications:', error)
    return () => {}
  }
}

// ===== SHOPPING LIST =====
export const saveShoppingList = async (shoppingList: ShoppingItem[]): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  try {
    const batch = shoppingList.map(item => 
      setDoc(doc(db!, COLLECTIONS.SHOPPING_LIST, item.id), item)
    )
    await Promise.all(batch)
  } catch (error) {
    console.error('Error saving shopping list:', error)
    throw error
  }
}

export const loadShoppingList = async (): Promise<ShoppingItem[]> => {
  if (!db) {
    return []
  }
  
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.SHOPPING_LIST))
    return querySnapshot.docs.map(doc => doc.data() as ShoppingItem)
  } catch (error) {
    console.error('Error loading shopping list:', error)
    return []
  }
}

export const subscribeToShoppingList = (callback: (shoppingList: ShoppingItem[]) => void): Unsubscribe => {
  if (!db) {
    return () => {}
  }
  
  try {
    return onSnapshot(collection(db, COLLECTIONS.SHOPPING_LIST), (querySnapshot) => {
      const shoppingList = querySnapshot.docs.map(doc => doc.data() as ShoppingItem)
      callback(shoppingList)
    })
  } catch (error) {
    console.error('Error subscribing to shopping list:', error)
    return () => {}
  }
}

// ===== OPERAÇÕES INDIVIDUAIS =====

// Adicionar item individual
export const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível para transactions')
    return
  }
  
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
  
  if (!isFirebaseAvailable || !db) {
    // Fallback para localStorage
    const incomes = LocalStorage.loadMonthlyIncomes()
    incomes.push(newIncome)
    LocalStorage.saveMonthlyIncomes(incomes)
    dispatchStorageChangeEvent('finances-monthly-incomes')
    return
  }
  
  try {
    await setDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, newIncome.id), newIncome)
  } catch (error) {
    console.error('Erro ao salvar no Firebase, usando localStorage:', error)
    // Fallback para localStorage em caso de erro
    const incomes = LocalStorage.loadMonthlyIncomes()
    incomes.push(newIncome)
    LocalStorage.saveMonthlyIncomes(incomes)
    dispatchStorageChangeEvent('finances-monthly-incomes')
  }
}

export const addMonthlyExpense = async (expense: Omit<MonthlyExpense, 'id'>): Promise<void> => {
  const newExpense: MonthlyExpense = {
    ...expense,
    id: generateId()
  }
  
  if (!isFirebaseAvailable || !db) {
    // Fallback para localStorage
    const expenses = LocalStorage.loadMonthlyExpenses()
    expenses.push(newExpense)
    LocalStorage.saveMonthlyExpenses(expenses)
    dispatchStorageChangeEvent('finances-monthly-expenses')
    return
  }
  
  try {
    await setDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, newExpense.id), newExpense)
  } catch (error) {
    console.error('Erro ao salvar no Firebase, usando localStorage:', error)
    // Fallback para localStorage em caso de erro
    const expenses = LocalStorage.loadMonthlyExpenses()
    expenses.push(newExpense)
    LocalStorage.saveMonthlyExpenses(expenses)
    dispatchStorageChangeEvent('finances-monthly-expenses')
  }
}

export const addCategory = async (category: Omit<Category, 'id'>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  const newCategory: Category = {
    ...category,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.CATEGORIES, newCategory.id), newCategory)
}

export const addWish = async (wish: Omit<Wish, 'id'>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  const newWish: Wish = {
    ...wish,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.WISHES, newWish.id), newWish)
}

export const addNotification = async (notification: Omit<Notification, 'id'>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  const newNotification: Notification = {
    ...notification,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, newNotification.id), newNotification)
}

export const addShoppingItem = async (item: Omit<ShoppingItem, 'id'>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  
  const newItem: ShoppingItem = {
    ...item,
    id: generateId()
  }
  await setDoc(doc(db, COLLECTIONS.SHOPPING_LIST, newItem.id), newItem)
}

// Atualizar item individual
export const updateMonthlyIncome = async (id: string, data: Partial<Omit<MonthlyIncome, 'id'>>): Promise<void> => {
  if (!isFirebaseAvailable || !db) {
    const incomes = LocalStorage.loadMonthlyIncomes()
    const index = incomes.findIndex(i => i.id === id)
    if (index !== -1) {
      incomes[index] = { ...incomes[index], ...data }
      LocalStorage.saveMonthlyIncomes(incomes)
      dispatchStorageChangeEvent('finances-monthly-incomes')
    }
    return
  }
  
  try {
    await updateDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, id), data)
  } catch (error) {
    console.error('Erro ao atualizar no Firebase, usando localStorage:', error)
    const incomes = LocalStorage.loadMonthlyIncomes()
    const index = incomes.findIndex(i => i.id === id)
    if (index !== -1) {
      incomes[index] = { ...incomes[index], ...data }
      LocalStorage.saveMonthlyIncomes(incomes)
      dispatchStorageChangeEvent('finances-monthly-incomes')
    }
  }
}

export const updateMonthlyExpense = async (id: string, data: Partial<Omit<MonthlyExpense, 'id'>>): Promise<void> => {
  if (!isFirebaseAvailable || !db) {
    const expenses = LocalStorage.loadMonthlyExpenses()
    const index = expenses.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...data }
      LocalStorage.saveMonthlyExpenses(expenses)
      dispatchStorageChangeEvent('finances-monthly-expenses')
    }
    return
  }
  
  try {
    await updateDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, id), data)
  } catch (error) {
    console.error('Erro ao atualizar no Firebase, usando localStorage:', error)
    const expenses = LocalStorage.loadMonthlyExpenses()
    const index = expenses.findIndex(e => e.id === id)
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...data }
      LocalStorage.saveMonthlyExpenses(expenses)
      dispatchStorageChangeEvent('finances-monthly-expenses')
    }
  }
}

export const updateCategory = async (id: string, data: Partial<Omit<Category, 'id'>>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await updateDoc(doc(db, COLLECTIONS.CATEGORIES, id), data)
}

export const updateShoppingItem = async (id: string, data: Partial<Omit<ShoppingItem, 'id'>>): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await updateDoc(doc(db, COLLECTIONS.SHOPPING_LIST, id), data)
}

export const markNotificationAsRead = async (id: string): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { isRead: true })
}

// Deletar item individual
export const deleteMonthlyIncome = async (id: string): Promise<void> => {
  if (!isFirebaseAvailable || !db) {
    const incomes = LocalStorage.loadMonthlyIncomes()
    const filtered = incomes.filter(i => i.id !== id)
    LocalStorage.saveMonthlyIncomes(filtered)
    dispatchStorageChangeEvent('finances-monthly-incomes')
    return
  }
  
  try {
    await deleteDoc(doc(db, COLLECTIONS.MONTHLY_INCOMES, id))
  } catch (error) {
    console.error('Erro ao deletar no Firebase, usando localStorage:', error)
    const incomes = LocalStorage.loadMonthlyIncomes()
    const filtered = incomes.filter(i => i.id !== id)
    LocalStorage.saveMonthlyIncomes(filtered)
    dispatchStorageChangeEvent('finances-monthly-incomes')
  }
}

export const deleteMonthlyExpense = async (id: string): Promise<void> => {
  if (!isFirebaseAvailable || !db) {
    const expenses = LocalStorage.loadMonthlyExpenses()
    const filtered = expenses.filter(e => e.id !== id)
    LocalStorage.saveMonthlyExpenses(filtered)
    dispatchStorageChangeEvent('finances-monthly-expenses')
    return
  }
  
  try {
    await deleteDoc(doc(db, COLLECTIONS.MONTHLY_EXPENSES, id))
  } catch (error) {
    console.error('Erro ao deletar no Firebase, usando localStorage:', error)
    const expenses = LocalStorage.loadMonthlyExpenses()
    const filtered = expenses.filter(e => e.id !== id)
    LocalStorage.saveMonthlyExpenses(filtered)
    dispatchStorageChangeEvent('finances-monthly-expenses')
  }
}

export const deleteCategory = async (id: string): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id))
}

export const deleteNotification = async (id: string): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id))
}

export const deleteShoppingItem = async (id: string): Promise<void> => {
  if (!db) {
    console.warn('Firebase não disponível')
    return
  }
  await deleteDoc(doc(db, COLLECTIONS.SHOPPING_LIST, id))
}
