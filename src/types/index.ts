export interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  isFixed: boolean
  date: string
  notes?: string
}

export interface MonthlyIncome {
  id: string
  name: string
  amount: number
  dayOfMonth: number // Dia do mês que será recebido (1-31)
  isActive: boolean
}

export interface MonthlyExpense {
  id: string
  name: string
  amount: number
  dayOfMonth: number // Dia do mês que será cobrado (1-31)
  cancellationLink: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  budget: number
  maxBudget: number
  color: string
}

export interface Wish {
  id: string
  name: string
  estimatedPrice: number
  category: string
  priority: string
  status: string
  targetDate: string
  purchaseLink: string
  notes?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  timestamp: string
  isRead: boolean
}

export interface ShoppingItem {
  id: string
  name: string
  price: number
  isPurchased: boolean
  createdAt: string
}
