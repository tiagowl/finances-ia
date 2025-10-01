import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Transaction, MonthlyIncome, MonthlyExpense, Category, Wish, Notification } from '@/types'
import {
  saveTransactions,
  loadTransactions,
  saveMonthlyIncomes,
  loadMonthlyIncomes,
  saveMonthlyExpenses,
  loadMonthlyExpenses,
  saveCategories,
  loadCategories,
  saveWishes,
  loadWishes,
  saveNotifications,
  loadNotifications,
  generateId
} from '@/lib/storage'

interface FinanceContextType {
  // Data
  transactions: Transaction[]
  monthlyIncomes: MonthlyIncome[]
  monthlyExpenses: MonthlyExpense[]
  categories: Category[]
  wishes: Wish[]
  notifications: Notification[]
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  
  // Monthly Income methods
  addMonthlyIncome: (monthlyIncome: Omit<MonthlyIncome, 'id'>) => void
  updateMonthlyIncome: (id: string, monthlyIncome: Partial<MonthlyIncome>) => void
  deleteMonthlyIncome: (id: string) => void
  
  // Monthly Expense methods
  addMonthlyExpense: (monthlyExpense: Omit<MonthlyExpense, 'id'>) => void
  updateMonthlyExpense: (id: string, monthlyExpense: Partial<MonthlyExpense>) => void
  deleteMonthlyExpense: (id: string) => void
  
  // Category methods
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Wish methods
  addWish: (wish: Omit<Wish, 'id'>) => void
  updateWish: (id: string, wish: Partial<Wish>) => void
  deleteWish: (id: string) => void
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id'>) => void
  updateNotification: (id: string, notification: Partial<Notification>) => void
  deleteNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  
  // Computed values
  getTotalIncomes: () => number
  getTotalExpenses: () => number
  getTotalMonthlyIncomes: () => number
  getTotalMonthlyExpenses: () => number
  getTotalWishes: () => number
  getUnreadNotificationsCount: () => number
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

interface FinanceProviderProps {
  children: ReactNode
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyIncomes, setMonthlyIncomes] = useState<MonthlyIncome[]>([])
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [wishes, setWishes] = useState<Wish[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    setTransactions(loadTransactions())
    setMonthlyIncomes(loadMonthlyIncomes())
    setMonthlyExpenses(loadMonthlyExpenses())
    setCategories(loadCategories())
    setWishes(loadWishes())
    setNotifications(loadNotifications())
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  useEffect(() => {
    saveMonthlyIncomes(monthlyIncomes)
  }, [monthlyIncomes])

  useEffect(() => {
    saveMonthlyExpenses(monthlyExpenses)
  }, [monthlyExpenses])

  useEffect(() => {
    saveCategories(categories)
  }, [categories])

  useEffect(() => {
    saveWishes(wishes)
  }, [wishes])

  useEffect(() => {
    saveNotifications(notifications)
  }, [notifications])

  // Transaction methods
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId()
    }
    setTransactions(prev => [...prev, newTransaction])
  }

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...transaction } : t))
  }

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // Monthly Income methods
  const addMonthlyIncome = (monthlyIncome: Omit<MonthlyIncome, 'id'>) => {
    const newMonthlyIncome: MonthlyIncome = {
      ...monthlyIncome,
      id: generateId()
    }
    setMonthlyIncomes(prev => [...prev, newMonthlyIncome])
  }

  const updateMonthlyIncome = (id: string, monthlyIncome: Partial<MonthlyIncome>) => {
    setMonthlyIncomes(prev => prev.map(mi => mi.id === id ? { ...mi, ...monthlyIncome } : mi))
  }

  const deleteMonthlyIncome = (id: string) => {
    setMonthlyIncomes(prev => prev.filter(mi => mi.id !== id))
  }

  // Monthly Expense methods
  const addMonthlyExpense = (monthlyExpense: Omit<MonthlyExpense, 'id'>) => {
    const newMonthlyExpense: MonthlyExpense = {
      ...monthlyExpense,
      id: generateId()
    }
    setMonthlyExpenses(prev => [...prev, newMonthlyExpense])
  }

  const updateMonthlyExpense = (id: string, monthlyExpense: Partial<MonthlyExpense>) => {
    setMonthlyExpenses(prev => prev.map(me => me.id === id ? { ...me, ...monthlyExpense } : me))
  }

  const deleteMonthlyExpense = (id: string) => {
    setMonthlyExpenses(prev => prev.filter(me => me.id !== id))
  }

  // Category methods
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId()
    }
    setCategories(prev => [...prev, newCategory])
  }

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c))
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  // Wish methods
  const addWish = (wish: Omit<Wish, 'id'>) => {
    const newWish: Wish = {
      ...wish,
      id: generateId()
    }
    setWishes(prev => [...prev, newWish])
  }

  const updateWish = (id: string, wish: Partial<Wish>) => {
    setWishes(prev => prev.map(w => w.id === id ? { ...w, ...wish } : w))
  }

  const deleteWish = (id: string) => {
    setWishes(prev => prev.filter(w => w.id !== id))
  }

  // Notification methods
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId()
    }
    setNotifications(prev => [...prev, newNotification])
  }

  const updateNotification = (id: string, notification: Partial<Notification>) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...notification } : n))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markNotificationAsRead = (id: string) => {
    updateNotification(id, { isRead: true })
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  // Computed values
  const getTotalIncomes = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getTotalMonthlyIncomes = () => {
    return monthlyIncomes
      .filter(mi => mi.isActive)
      .reduce((sum, mi) => sum + mi.amount, 0)
  }

  const getTotalMonthlyExpenses = () => {
    return monthlyExpenses
      .filter(me => me.isActive)
      .reduce((sum, me) => sum + me.amount, 0)
  }

  const getTotalWishes = () => {
    return wishes.reduce((sum, w) => sum + w.estimatedPrice, 0)
  }

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.isRead).length
  }

  const value: FinanceContextType = {
    // Data
    transactions,
    monthlyIncomes,
    monthlyExpenses,
    categories,
    wishes,
    notifications,
    
    // Transaction methods
    addTransaction,
    updateTransaction,
    deleteTransaction,
    
    // Monthly Income methods
    addMonthlyIncome,
    updateMonthlyIncome,
    deleteMonthlyIncome,
    
    // Monthly Expense methods
    addMonthlyExpense,
    updateMonthlyExpense,
    deleteMonthlyExpense,
    
    // Category methods
    addCategory,
    updateCategory,
    deleteCategory,
    
    // Wish methods
    addWish,
    updateWish,
    deleteWish,
    
    // Notification methods
    addNotification,
    updateNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    // Computed values
    getTotalIncomes,
    getTotalExpenses,
    getTotalMonthlyIncomes,
    getTotalMonthlyExpenses,
    getTotalWishes,
    getUnreadNotificationsCount
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}
