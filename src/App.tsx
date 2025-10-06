import { useState } from 'react'
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Home, 
  Settings, 
  User, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  CalendarDays,
  Tag,
  Heart,
  ShoppingCart,
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from "lucide-react"

// Import page components
import {
  Dashboard,
  Incomes,
  Expenses,
  MonthlyIncomes,
  MonthlyExpenses,
  Categories,
  Wishes,
  ShoppingList
} from "@/pages"
import { FinanceProvider, useFinance } from "@/contexts/FinanceContext"


function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    getUnreadNotificationsCount 
  } = useFinance()

  const unreadNotificationsCount = getUnreadNotificationsCount()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-blue-600" />
    }
  }



  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'incomes':
        return <Incomes />
      case 'expenses':
        return <Expenses />
      case 'monthly-incomes':
        return <MonthlyIncomes />
      case 'monthly-expenses':
        return <MonthlyExpenses />
      case 'categories':
        return <Categories />
      case 'wishes':
        return <Wishes />
      case 'shopping-list':
        return <ShoppingList />
      default:
        return <div>Página não encontrada</div>
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <CreditCard className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Finances IA</span>
              <span className="truncate text-xs text-muted-foreground">
                Assistente Financeiro
              </span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'dashboard'}
                    onClick={() => setCurrentPage('dashboard')}
                  >
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'incomes'}
                    onClick={() => setCurrentPage('incomes')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Receitas</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'expenses'}
                    onClick={() => setCurrentPage('expenses')}
                  >
                    <TrendingDown className="h-4 w-4" />
                    <span>Despesas</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'monthly-incomes'}
                    onClick={() => setCurrentPage('monthly-incomes')}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Receitas Mensais</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'monthly-expenses'}
                    onClick={() => setCurrentPage('monthly-expenses')}
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span>Despesas Mensais</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'categories'}
                    onClick={() => setCurrentPage('categories')}
                  >
                    <Tag className="h-4 w-4" />
                    <span>Categorias</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'wishes'}
                    onClick={() => setCurrentPage('wishes')}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Desejos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={currentPage === 'shopping-list'}
                    onClick={() => setCurrentPage('shopping-list')}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Lista de Compras</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Configurações</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <User className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Usuário</span>
              <span className="truncate text-xs text-muted-foreground">
                user@example.com
              </span>
        </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
      </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-semibold truncate">
              {currentPage === 'dashboard' ? 'Dashboard' : 
               currentPage === 'incomes' ? 'Receitas' :
               currentPage === 'expenses' ? 'Despesas' :
               currentPage === 'monthly-incomes' ? 'Receitas Mensais' :
               currentPage === 'monthly-expenses' ? 'Despesas Mensais' :
               currentPage === 'categories' ? 'Categorias' :
               currentPage === 'wishes' ? 'Desejos' :
               currentPage === 'shopping-list' ? 'Lista de Compras' :
               'Finances IA'}
            </h1>
          </div>
          
          {/* Componente de Notificações */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 sm:h-9 sm:w-auto sm:px-3">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline ml-1">Notificações</span>
                  {unreadNotificationsCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 sm:w-80 p-0" align="end">
                <div className="flex items-center justify-between p-3 sm:p-4 border-b">
                  <h3 className="font-semibold text-sm sm:text-base">Notificações</h3>
                  {unreadNotificationsCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs h-7 px-2"
                    >
                      Marcar todas como lidas
                    </Button>
                  )}
                </div>
                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-3 sm:p-4 text-center text-muted-foreground text-sm">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 sm:p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                          !notification.isRead ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 sm:gap-2">
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs sm:text-sm font-medium truncate ${
                                  !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                {!notification.isRead && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markNotificationAsRead(notification.id)}
                                    className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteNotification(notification.id)}
                                  className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}

export default App
