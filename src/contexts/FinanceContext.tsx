import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Transaction, MonthlyIncome, MonthlyExpense, Category, Wish, Notification, ShoppingItem } from '@/types'
import {
  // Firebase functions
  loadTransactions,
  loadMonthlyIncomes,
  loadMonthlyExpenses,
  loadCategories,
  loadWishes,
  loadNotifications,
  loadShoppingList,
  addTransaction as firebaseAddTransaction,
  addMonthlyIncome as firebaseAddMonthlyIncome,
  addMonthlyExpense as firebaseAddMonthlyExpense,
  addCategory as firebaseAddCategory,
  addWish as firebaseAddWish,
  addNotification as firebaseAddNotification,
  addShoppingItem as firebaseAddShoppingItem,
  updateMonthlyIncome as firebaseUpdateMonthlyIncome,
  updateMonthlyExpense as firebaseUpdateMonthlyExpense,
  updateCategory as firebaseUpdateCategory,
  updateShoppingItem as firebaseUpdateShoppingItem,
  markNotificationAsRead as firebaseMarkNotificationAsRead,
  deleteMonthlyIncome as firebaseDeleteMonthlyIncome,
  deleteMonthlyExpense as firebaseDeleteMonthlyExpense,
  deleteCategory as firebaseDeleteCategory,
  deleteNotification as firebaseDeleteNotification,
  deleteShoppingItem as firebaseDeleteShoppingItem,
  subscribeToTransactions,
  subscribeToMonthlyIncomes,
  subscribeToMonthlyExpenses,
  subscribeToCategories,
  subscribeToWishes,
  subscribeToNotifications,
  subscribeToShoppingList
} from '@/lib/firebaseService'

interface FinanceContextType {
  // Data
  transactions: Transaction[]
  monthlyIncomes: MonthlyIncome[]
  monthlyExpenses: MonthlyExpense[]
  categories: Category[]
  wishes: Wish[]
  notifications: Notification[]
  shoppingList: ShoppingItem[]
  
  // Loading states
  isLoading: boolean
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  
  // Monthly Income methods
  addMonthlyIncome: (monthlyIncome: Omit<MonthlyIncome, 'id'>) => Promise<void>
  updateMonthlyIncome: (id: string, monthlyIncome: Partial<Omit<MonthlyIncome, 'id'>>) => Promise<void>
  deleteMonthlyIncome: (id: string) => Promise<void>
  
  // Monthly Expense methods
  addMonthlyExpense: (monthlyExpense: Omit<MonthlyExpense, 'id'>) => Promise<void>
  updateMonthlyExpense: (id: string, monthlyExpense: Partial<Omit<MonthlyExpense, 'id'>>) => Promise<void>
  deleteMonthlyExpense: (id: string) => Promise<void>
  
  // Category methods
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>
  updateCategory: (id: string, category: Partial<Omit<Category, 'id'>>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  getCategoryExpenses: (categoryName: string) => number
  
  // Wish methods
  addWish: (wish: Omit<Wish, 'id'>) => Promise<void>
  
  // Notification methods
  addNotification: (notification: Omit<Notification, 'id'>) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  
  // Shopping List methods
  addShoppingItem: (shoppingItem: Omit<ShoppingItem, 'id'>) => Promise<void>
  updateShoppingItem: (id: string, shoppingItem: Partial<Omit<ShoppingItem, 'id'>>) => Promise<void>
  deleteShoppingItem: (id: string) => Promise<void>
  toggleShoppingItemPurchased: (id: string) => Promise<void>
  
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
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [
          transactionsData,
          monthlyIncomesData,
          monthlyExpensesData,
          categoriesData,
          wishesData,
          notificationsData,
          shoppingListData
        ] = await Promise.all([
          loadTransactions(),
          loadMonthlyIncomes(),
          loadMonthlyExpenses(),
          loadCategories(),
          loadWishes(),
          loadNotifications(),
          loadShoppingList()
        ])

        setTransactions(transactionsData)
        setMonthlyIncomes(monthlyIncomesData)
        setMonthlyExpenses(monthlyExpensesData)
        setCategories(categoriesData)
        setWishes(wishesData)
        setNotifications(notificationsData)
        setShoppingList(shoppingListData)
      } catch (error) {
        console.error('Error loading data from Firebase:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Set up real-time subscriptions
  useEffect(() => {
    const unsubscribeTransactions = subscribeToTransactions(setTransactions)
    const unsubscribeMonthlyIncomes = subscribeToMonthlyIncomes(setMonthlyIncomes)
    const unsubscribeMonthlyExpenses = subscribeToMonthlyExpenses(setMonthlyExpenses)
    const unsubscribeCategories = subscribeToCategories(setCategories)
    const unsubscribeWishes = subscribeToWishes(setWishes)
    const unsubscribeNotifications = subscribeToNotifications(setNotifications)
    const unsubscribeShoppingList = subscribeToShoppingList(setShoppingList)

    return () => {
      unsubscribeTransactions()
      unsubscribeMonthlyIncomes()
      unsubscribeMonthlyExpenses()
      unsubscribeCategories()
      unsubscribeWishes()
      unsubscribeNotifications()
      unsubscribeShoppingList()
    }
  }, [])

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
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      await firebaseAddTransaction(transaction)
      
      // Trigger: Notificação de transação criada
      await addNotification({
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
    } catch (error) {
      console.error('Error adding transaction:', error)
      throw error
    }
  }



  // Monthly Income methods
  const addMonthlyIncome = async (monthlyIncome: Omit<MonthlyIncome, 'id'>) => {
    try {
      await firebaseAddMonthlyIncome(monthlyIncome)
      
      // Trigger: Notificação de receita mensal criada
      await addNotification({
        title: '💰 Nova Receita Mensal',
        message: `Receita mensal "${monthlyIncome.name}" de R$ ${monthlyIncome.amount.toFixed(2)} adicionada (recebe dia ${monthlyIncome.dayOfMonth})`,
        type: 'success',
        timestamp: new Date().toISOString(),
        isRead: false
      })
    } catch (error) {
      console.error('Error adding monthly income:', error)
      throw error
    }
  }

  const updateMonthlyIncome = async (id: string, updatedData: Partial<Omit<MonthlyIncome, 'id'>>) => {
    try {
      await firebaseUpdateMonthlyIncome(id, updatedData)
      
      // Trigger: Notificação de receita mensal atualizada
      const income = monthlyIncomes.find(i => i.id === id)
      if (income) {
        await addNotification({
          title: '✏️ Receita Mensal Atualizada',
          message: `Receita mensal "${income.name}" foi atualizada`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error updating monthly income:', error)
      throw error
    }
  }

  const deleteMonthlyIncome = async (id: string) => {
    try {
      const income = monthlyIncomes.find(i => i.id === id)
      await firebaseDeleteMonthlyIncome(id)
      
      // Trigger: Notificação de receita mensal excluída
      if (income) {
        await addNotification({
          title: '🗑️ Receita Mensal Excluída',
          message: `Receita mensal "${income.name}" foi excluída`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error deleting monthly income:', error)
      throw error
    }
  }



  // Monthly Expense methods
  const addMonthlyExpense = async (monthlyExpense: Omit<MonthlyExpense, 'id'>) => {
    try {
      await firebaseAddMonthlyExpense(monthlyExpense)
      
      // Trigger: Notificação de despesa mensal criada
      await addNotification({
        title: '💳 Nova Despesa Mensal',
        message: `Despesa mensal "${monthlyExpense.name}" de R$ ${monthlyExpense.amount.toFixed(2)} adicionada (vence dia ${monthlyExpense.dayOfMonth})`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false
      })
      
      // Trigger: Verificar vencimentos após adicionar despesa mensal
      setTimeout(() => checkMonthlyExpenseDueDates(), 200)
    } catch (error) {
      console.error('Error adding monthly expense:', error)
      throw error
    }
  }

  const updateMonthlyExpense = async (id: string, updatedData: Partial<Omit<MonthlyExpense, 'id'>>) => {
    try {
      await firebaseUpdateMonthlyExpense(id, updatedData)
      
      // Trigger: Notificação de despesa mensal atualizada
      const expense = monthlyExpenses.find(e => e.id === id)
      if (expense) {
        await addNotification({
          title: '✏️ Despesa Mensal Atualizada',
          message: `Despesa mensal "${expense.name}" foi atualizada`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
      
      // Trigger: Verificar vencimentos após atualizar despesa mensal
      setTimeout(() => checkMonthlyExpenseDueDates(), 200)
    } catch (error) {
      console.error('Error updating monthly expense:', error)
      throw error
    }
  }

  const deleteMonthlyExpense = async (id: string) => {
    try {
      const expense = monthlyExpenses.find(e => e.id === id)
      await firebaseDeleteMonthlyExpense(id)
      
      // Trigger: Notificação de despesa mensal excluída
      if (expense) {
        await addNotification({
          title: '🗑️ Despesa Mensal Excluída',
          message: `Despesa mensal "${expense.name}" foi excluída`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error deleting monthly expense:', error)
      throw error
    }
  }



  // Category methods
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await firebaseAddCategory(category)
      
      // Trigger: Notificação de categoria criada
      await addNotification({
        title: '🏷️ Nova Categoria Criada',
        message: `Categoria "${category.name}" criada com orçamento máximo de R$ ${category.maxBudget.toFixed(2)}`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false
      })
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  const updateCategory = async (id: string, updatedData: Partial<Omit<Category, 'id'>>) => {
    try {
      await firebaseUpdateCategory(id, updatedData)
      
      // Trigger: Notificação de categoria atualizada
      const category = categories.find(c => c.id === id)
      if (category) {
        await addNotification({
          title: '✏️ Categoria Atualizada',
          message: `Categoria "${category.name}" foi atualizada`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const category = categories.find(c => c.id === id)
      await firebaseDeleteCategory(id)
      
      // Trigger: Notificação de categoria excluída
      if (category) {
        await addNotification({
          title: '🗑️ Categoria Excluída',
          message: `Categoria "${category.name}" foi excluída`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  const getCategoryExpenses = (categoryName: string): number => {
    return transactions
      .filter(t => t.type === 'expense' && t.category === categoryName)
      .reduce((sum, t) => sum + t.amount, 0)
  }



  // Wish methods
  const addWish = async (wish: Omit<Wish, 'id'>) => {
    try {
      await firebaseAddWish(wish)
      
      // Trigger: Notificação de desejo criado
      await addNotification({
        title: '🎯 Novo Desejo Adicionado',
        message: `Desejo "${wish.name}" de R$ ${wish.estimatedPrice.toFixed(2)} adicionado à sua lista`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false
      })
    } catch (error) {
      console.error('Error adding wish:', error)
      throw error
    }
  }



  // Notification methods
  const addNotification = async (notification: Omit<Notification, 'id'>) => {
    try {
      await firebaseAddNotification(notification)
    } catch (error) {
      console.error('Error adding notification:', error)
      throw error
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await firebaseDeleteNotification(id)
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      await firebaseMarkNotificationAsRead(id)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      await Promise.all(unreadNotifications.map(n => firebaseMarkNotificationAsRead(n.id)))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
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
    const currentDay = today.getDate()
    
    monthlyExpenses
      .filter(expense => expense.isActive)
      .forEach(expense => {
        const dayOfMonth = expense.dayOfMonth
        
        // Calcular quantos dias faltam para o dia da cobrança
        let daysUntilDue: number
        
        if (currentDay <= dayOfMonth) {
          // Ainda não chegou o dia da cobrança neste mês
          daysUntilDue = dayOfMonth - currentDay
        } else {
          // Já passou o dia da cobrança neste mês, calcular para o próximo mês
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, dayOfMonth)
          daysUntilDue = Math.ceil((nextMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        }
        
        // Notificação 7 dias antes do vencimento
        if (daysUntilDue === 7) {
          addNotification({
            title: '📅 Despesa Mensal Vencendo em 7 Dias',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence em 7 dias (dia ${dayOfMonth})`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação 3 dias antes do vencimento
        if (daysUntilDue === 3) {
          addNotification({
            title: '⚠️ Despesa Mensal Vencendo em 3 Dias',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence em 3 dias (dia ${dayOfMonth})`,
            type: 'warning',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação no dia do vencimento
        if (daysUntilDue === 0) {
          addNotification({
            title: '🚨 Despesa Mensal Vence Hoje!',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} vence hoje (dia ${dayOfMonth})!`,
            type: 'error',
            timestamp: new Date().toISOString(),
            isRead: false
          })
        }
        
        // Notificação 1 dia após o vencimento (se não foi paga)
        if (daysUntilDue === -1) {
          addNotification({
            title: '🔴 Despesa Mensal Vencida!',
            message: `"${expense.name}" de R$ ${expense.amount.toFixed(2)} está vencida há 1 dia (venceu no dia ${dayOfMonth})!`,
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

  // Shopping List methods
  const addShoppingItem = async (shoppingItem: Omit<ShoppingItem, 'id'>) => {
    try {
      await firebaseAddShoppingItem(shoppingItem)
      
      // Trigger: Notificação de item adicionado
      await addNotification({
        title: '🛒 Item Adicionado à Lista',
        message: `"${shoppingItem.name}" foi adicionado à lista de compras`,
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false
      })
    } catch (error) {
      console.error('Error adding shopping item:', error)
      throw error
    }
  }

  const updateShoppingItem = async (id: string, updatedData: Partial<Omit<ShoppingItem, 'id'>>) => {
    try {
      await firebaseUpdateShoppingItem(id, updatedData)
      
      // Trigger: Notificação de item atualizado
      const item = shoppingList.find(i => i.id === id)
      if (item) {
        await addNotification({
          title: '✏️ Item Atualizado',
          message: `"${item.name}" foi atualizado na lista de compras`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error updating shopping item:', error)
      throw error
    }
  }

  const deleteShoppingItem = async (id: string) => {
    try {
      const item = shoppingList.find(i => i.id === id)
      await firebaseDeleteShoppingItem(id)
      
      // Trigger: Notificação de item excluído
      if (item) {
        await addNotification({
          title: '🗑️ Item Removido',
          message: `"${item.name}" foi removido da lista de compras`,
          type: 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error deleting shopping item:', error)
      throw error
    }
  }

  const toggleShoppingItemPurchased = async (id: string) => {
    try {
      const item = shoppingList.find(i => i.id === id)
      if (item) {
        const newPurchasedState = !item.isPurchased
        await firebaseUpdateShoppingItem(id, { isPurchased: newPurchasedState })
        
        // Trigger: Notificação de status alterado
        await addNotification({
          title: newPurchasedState ? '✅ Item Comprado' : '📝 Item Desmarcado',
          message: `"${item.name}" foi ${newPurchasedState ? 'marcado como comprado' : 'desmarcado'}`,
          type: newPurchasedState ? 'success' : 'info',
          timestamp: new Date().toISOString(),
          isRead: false
        })
      }
    } catch (error) {
      console.error('Error toggling shopping item purchased:', error)
      throw error
    }
  }

  const value: FinanceContextType = {
    // Data
    transactions,
    monthlyIncomes,
    monthlyExpenses,
    categories,
    wishes,
    notifications,
    shoppingList,
    
    // Loading states
    isLoading,
    
    // Transaction methods
    addTransaction,
    
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
    getCategoryExpenses,
    
    // Wish methods
    addWish,
    
    // Notification methods
    addNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    
    // Shopping List methods
    addShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
    toggleShoppingItemPurchased,
    
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
