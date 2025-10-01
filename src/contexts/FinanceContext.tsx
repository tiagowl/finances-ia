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
  
  // Monitoring methods
  checkBudgetAlerts: () => void
  checkCategoryBudgetAlerts: () => void
  checkWishAchievements: () => void
  checkMonthlyExpenseDueDates: () => void
  testDueDateNotifications: () => void
  testCategoryBudgetNotifications: () => void
  
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

  // Check monthly expense due dates when app loads and when monthly expenses change
  useEffect(() => {
    if (monthlyExpenses.length > 0) {
      // Small delay to ensure all data is loaded
      const timer = setTimeout(() => {
        checkMonthlyExpenseDueDates()
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [monthlyExpenses])

  // Transaction methods
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId()
    }
    setTransactions(prev => [...prev, newTransaction])
    
    // Trigger: Notificação de transação criada
    addNotification({
      title: transaction.type === 'income' ? 'Receita Adicionada' : 'Despesa Adicionada',
      message: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toFixed(2)} adicionada em ${transaction.category}`,
      type: transaction.type === 'income' ? 'success' : 'info',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    // Trigger: Verificar alertas de orçamento para despesas
    if (transaction.type === 'expense') {
      setTimeout(() => {
        checkBudgetAlerts()
        checkCategoryBudgetAlerts()
      }, 100)
    }
    
    // Trigger: Verificar conquistas de desejos para receitas
    if (transaction.type === 'income') {
      setTimeout(() => checkWishAchievements(), 100)
    }
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
    
    // Trigger: Notificação de despesa mensal criada
    addNotification({
      title: '💳 Nova Despesa Mensal',
      message: `Despesa mensal "${monthlyExpense.name}" de R$ ${monthlyExpense.amount.toFixed(2)} adicionada`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    // Trigger: Verificar vencimentos após adicionar despesa mensal
    setTimeout(() => checkMonthlyExpenseDueDates(), 200)
  }



  // Category methods
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId()
    }
    setCategories(prev => [...prev, newCategory])
    
    // Trigger: Notificação de categoria criada
    addNotification({
      title: 'Nova Categoria Criada',
      message: `Categoria "${category.name}" criada com orçamento de R$ ${category.budget.toFixed(2)}`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false
    })
  }



  // Wish methods
  const addWish = (wish: Omit<Wish, 'id'>) => {
    const newWish: Wish = {
      ...wish,
      id: generateId()
    }
    setWishes(prev => [...prev, newWish])
    
    // Trigger: Notificação de desejo criado
    addNotification({
      title: '🎯 Novo Desejo Adicionado',
      message: `Desejo "${wish.name}" de R$ ${wish.estimatedPrice.toFixed(2)} adicionado à sua lista`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false
    })
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

  // Budget monitoring function
  const checkBudgetAlerts = () => {
    categories.forEach(category => {
      const categoryExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const budgetPercentage = (categoryExpenses / category.budget) * 100
      
      if (budgetPercentage >= 100) {
        addNotification({
          title: '⚠️ Orçamento Excedido',
          message: `Categoria "${category.name}" excedeu o orçamento! Gasto: R$ ${categoryExpenses.toFixed(2)} / R$ ${category.budget.toFixed(2)}`,
          type: 'warning',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      } else if (budgetPercentage >= 80) {
        addNotification({
          title: '⚠️ Orçamento Próximo do Limite',
          message: `Categoria "${category.name}" está em ${budgetPercentage.toFixed(1)}% do orçamento (R$ ${categoryExpenses.toFixed(2)} / R$ ${category.budget.toFixed(2)})`,
          type: 'warning',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    })
  }

  // Enhanced budget monitoring with specific category budget alerts
  const checkCategoryBudgetAlerts = () => {
    categories.forEach(category => {
      const categoryExpenses = transactions
        .filter(t => t.type === 'expense' && t.category === category.name)
        .reduce((sum, t) => sum + t.amount, 0)
      
      const budgetPercentage = (categoryExpenses / category.budget) * 100
      const remainingBudget = category.budget - categoryExpenses
      
      // Orçamento atingido exatamente
      if (Math.abs(categoryExpenses - category.budget) < 0.01) {
        addNotification({
          title: '🎯 Orçamento Atingido!',
          message: `Categoria "${category.name}" atingiu exatamente o orçamento de R$ ${category.budget.toFixed(2)}!`,
          type: 'success',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
      // Orçamento excedido
      else if (categoryExpenses > category.budget) {
        const exceededAmount = categoryExpenses - category.budget
        addNotification({
          title: '🚨 Orçamento Excedido!',
          message: `Categoria "${category.name}" excedeu o orçamento em R$ ${exceededAmount.toFixed(2)}! (Gasto: R$ ${categoryExpenses.toFixed(2)} / Orçamento: R$ ${category.budget.toFixed(2)})`,
          type: 'error',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
      // 90% do orçamento
      else if (budgetPercentage >= 90) {
        addNotification({
          title: '⚠️ Orçamento Quase Esgotado',
          message: `Categoria "${category.name}" está em ${budgetPercentage.toFixed(1)}% do orçamento! Restam apenas R$ ${remainingBudget.toFixed(2)}`,
          type: 'warning',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
      // 75% do orçamento
      else if (budgetPercentage >= 75) {
        addNotification({
          title: '📊 Orçamento em 75%',
          message: `Categoria "${category.name}" já gastou 75% do orçamento (R$ ${categoryExpenses.toFixed(2)} / R$ ${category.budget.toFixed(2)})`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    })
  }

  // Wish achievement monitoring function
  const checkWishAchievements = () => {
    const totalIncomes = getTotalIncomes()
    const totalExpenses = getTotalExpenses()
    const availableBalance = totalIncomes - totalExpenses
    
    wishes.forEach(wish => {
      if (availableBalance >= wish.estimatedPrice && wish.status !== 'achieved') {
        addNotification({
          title: '🎉 Desejo Pode Ser Realizado!',
          message: `Você tem saldo suficiente para realizar o desejo "${wish.name}" (R$ ${wish.estimatedPrice.toFixed(2)})`,
          type: 'success',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    })
  }

  // Monthly expense due date monitoring function
  const checkMonthlyExpenseDueDates = () => {
    const today = new Date()
    
    monthlyExpenses
      .filter(expense => expense.isActive)
      .forEach(expense => {
        const dueDate = new Date(expense.nextChargedDate)
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        // Notificação 7 dias antes do vencimento
        if (daysUntilDue === 7) {
          addNotification({
            title: '📅 Despesa Mensal Vencendo em 7 Dias',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence em 7 dias (${dueDate.toLocaleDateString('pt-BR')})`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação 3 dias antes do vencimento
        if (daysUntilDue === 3) {
          addNotification({
            title: '⚠️ Despesa Mensal Vencendo em 3 Dias',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence em 3 dias (${dueDate.toLocaleDateString('pt-BR')})`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação no dia do vencimento
        if (daysUntilDue === 0) {
          addNotification({
            title: '🚨 Despesa Mensal Vence Hoje!',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence hoje!`,
            type: 'error',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação 1 dia após o vencimento (se não foi paga)
        if (daysUntilDue === -1) {
          addNotification({
            title: '🔴 Despesa Mensal Vencida!',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} está vencida há 1 dia!`,
            type: 'error',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
      })
  }

  // Test function for due date notifications (for development/testing)
  const testDueDateNotifications = () => {
    addNotification({
      title: '📅 Despesa Mensal Vencendo em 7 Dias',
      message: 'Netflix de R$ 45,90 vence em 7 dias (15/01/2024)',
      type: 'warning',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    addNotification({
      title: '⚠️ Despesa Mensal Vencendo em 3 Dias',
      message: 'Spotify de R$ 21,90 vence em 3 dias (11/01/2024)',
      type: 'warning',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    addNotification({
      title: '🚨 Despesa Mensal Vence Hoje!',
      message: 'Internet de R$ 89,90 vence hoje!',
      type: 'error',
      timestamp: new Date().toISOString(),
      isRead: false
    })
  }

  // Test function for category budget notifications (for development/testing)
  const testCategoryBudgetNotifications = () => {
    addNotification({
      title: '🎯 Orçamento Atingido!',
      message: 'Categoria "Alimentação" atingiu exatamente o orçamento de R$ 500,00!',
      type: 'success',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    addNotification({
      title: '🚨 Orçamento Excedido!',
      message: 'Categoria "Transporte" excedeu o orçamento em R$ 50,00! (Gasto: R$ 350,00 / Orçamento: R$ 300,00)',
      type: 'error',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    addNotification({
      title: '⚠️ Orçamento Quase Esgotado',
      message: 'Categoria "Lazer" está em 92,5% do orçamento! Restam apenas R$ 15,00',
      type: 'warning',
      timestamp: new Date().toISOString(),
      isRead: false
    })
    
    addNotification({
      title: '📊 Orçamento em 75%',
      message: 'Categoria "Saúde" já gastou 75% do orçamento (R$ 150,00 / R$ 200,00)',
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false
    })
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
    
    // Monitoring methods
    checkBudgetAlerts,
    checkCategoryBudgetAlerts,
    checkWishAchievements,
    checkMonthlyExpenseDueDates,
    testDueDateNotifications,
    testCategoryBudgetNotifications,
    
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
