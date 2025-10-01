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
  
  // Monthly Income methods
  addMonthlyIncome: (monthlyIncome: Omit<MonthlyIncome, 'id'>) => void
  
  // Monthly Expense methods
  addMonthlyExpense: (monthlyExpense: Omit<MonthlyExpense, 'id'>) => void
  
  // Category methods
  addCategory: (category: Omit<Category, 'id'>) => void
  
  // Wish methods
  addWish: (wish: Omit<Wish, 'id'>) => void
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id'>) => void
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



  // Monthly Income methods
  const addMonthlyIncome = (monthlyIncome: Omit<MonthlyIncome, 'id'>) => {
    const newMonthlyIncome: MonthlyIncome = {
      ...monthlyIncome,
      id: generateId()
    }
    setMonthlyIncomes(prev => [...prev, newMonthlyIncome])
  }



  // Monthly Expense methods
  const addMonthlyExpense = (monthlyExpense: Omit<MonthlyExpense, 'id'>) => {
    const newMonthlyExpense: MonthlyExpense = {
      ...monthlyExpense,
      id: generateId()
    }
    setMonthlyExpenses(prev => [...prev, newMonthlyExpense])
  }



  // Category methods
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId()
    }
    setCategories(prev => [...prev, newCategory])
  }



  // Wish methods
  const addWish = (wish: Omit<Wish, 'id'>) => {
    const newWish: Wish = {
      ...wish,
      id: generateId()
    }
    setWishes(prev => [...prev, newWish])
  }



  // Notification methods
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId()
    }
    setNotifications(prev => [...prev, newNotification])
  }


  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
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
    
    // Monthly Income methods
    addMonthlyIncome,
    
    // Monthly Expense methods
    addMonthlyExpense,
    
    // Category methods
    addCategory,
    
    // Wish methods
    addWish,
    
    // Notification methods
    addNotification,
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
