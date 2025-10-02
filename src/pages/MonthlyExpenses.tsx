import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, CalendarDays, Edit, Trash2 } from "lucide-react"
import { MonthlyExpense } from "@/types"
import { useFinance } from "@/contexts/FinanceContext"

// Schema de validação para o formulário de despesa mensal
const monthlyExpenseFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cancellationLink: z.string().min(1, "Link de cancelamento é obrigatório").url("Deve ser uma URL válida"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo"
  }),
  dayOfMonth: z.string().min(1, "Dia do mês é obrigatório").refine((val) => {
    const day = Number(val)
    return !isNaN(day) && day >= 1 && day <= 31
  }, {
    message: "Dia deve ser entre 1 e 31"
  }),
})

type MonthlyExpenseFormValues = z.infer<typeof monthlyExpenseFormSchema>



export default function MonthlyExpenses() {
  const [isMonthlyExpenseSheetOpen, setIsMonthlyExpenseSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<MonthlyExpense | null>(null)
  const { monthlyExpenses, addMonthlyExpense, updateMonthlyExpense, deleteMonthlyExpense, getTotalMonthlyExpenses } = useFinance()
  
  // Função de debug para limpar dados antigos
  const clearOldData = () => {
    if (confirm('Isso irá limpar todas as despesas mensais. Continuar?')) {
      localStorage.removeItem('finances-monthly-expenses')
      window.location.reload()
    }
  }

  const totalMonthlyExpenses = getTotalMonthlyExpenses()

  // Formulário de despesa mensal
  const monthlyExpenseForm = useForm<MonthlyExpenseFormValues>({
    resolver: zodResolver(monthlyExpenseFormSchema),
    defaultValues: {
      name: "",
      cancellationLink: "",
      amount: "",
      dayOfMonth: "",
    },
  })

  // Função para submeter o formulário de despesa mensal
  const onSubmitMonthlyExpense = (values: MonthlyExpenseFormValues) => {
    console.log('Form submitted with values:', values)
    console.log('Editing expense:', editingExpense)
    
    try {
      if (editingExpense) {
        // Atualizar despesa existente
        console.log('Updating expense with ID:', editingExpense.id)
        updateMonthlyExpense(editingExpense.id, {
          name: values.name,
          amount: parseFloat(values.amount),
          dayOfMonth: parseInt(values.dayOfMonth),
          cancellationLink: values.cancellationLink,
        })
      } else {
        // Criar nova despesa
        console.log('Creating new expense')
        addMonthlyExpense({
          name: values.name,
          amount: parseFloat(values.amount),
          dayOfMonth: parseInt(values.dayOfMonth),
          cancellationLink: values.cancellationLink,
          isActive: true
        })
      }
      
      monthlyExpenseForm.reset()
      setIsMonthlyExpenseSheetOpen(false)
      setEditingExpense(null)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Função para abrir o drawer de edição
  const handleEditExpense = (expense: MonthlyExpense) => {
    setEditingExpense(expense)
    monthlyExpenseForm.reset({
      name: expense.name,
      amount: expense.amount.toString(),
      dayOfMonth: expense.dayOfMonth.toString(),
      cancellationLink: expense.cancellationLink,
    })
    setIsMonthlyExpenseSheetOpen(true)
  }

  // Função para excluir despesa
  const handleDeleteExpense = (expense: MonthlyExpense) => {
    if (confirm(`Tem certeza que deseja excluir a despesa "${expense.name}"?`)) {
      deleteMonthlyExpense(expense.id)
    }
  }

  // Função para fechar o drawer e limpar o estado de edição
  const handleCloseSheet = () => {
    setIsMonthlyExpenseSheetOpen(false)
    setEditingExpense(null)
    monthlyExpenseForm.reset()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas Mensais</h1>
          <p className="text-muted-foreground">
            Visualize suas despesas mensais
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={clearOldData}
            variant="outline"
            size="sm"
          >
            🗑️ Limpar Dados (Debug)
          </Button>
          <Sheet open={isMonthlyExpenseSheetOpen} onOpenChange={handleCloseSheet}>
            <SheetTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Despesa Mensal
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{editingExpense ? 'Editar Despesa Mensal' : 'Cadastrar Nova Despesa Mensal'}</SheetTitle>
              <SheetDescription>
                {editingExpense 
                  ? 'Edite os dados abaixo para atualizar a despesa mensal.' 
                  : 'Preencha os dados abaixo para cadastrar uma nova despesa mensal.'}
              </SheetDescription>
            </SheetHeader>
            <Form {...monthlyExpenseForm}>
              <form onSubmit={monthlyExpenseForm.handleSubmit(onSubmitMonthlyExpense)} className="space-y-6 p-4">
                <FormField
                  control={monthlyExpenseForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Netflix, Spotify, Academia..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={monthlyExpenseForm.control}
                  name="cancellationLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Cancelamento</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://exemplo.com/cancelar" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={monthlyExpenseForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={monthlyExpenseForm.control}
                  name="dayOfMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia do Mês para Cobrança</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="31" 
                          placeholder="Ex: 15" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseSheet}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
                    {editingExpense ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Card de Estatística */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Despesas Mensais
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalMonthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthlyExpenses.length} despesa(s) mensal(is) cadastrada(s)
          </p>
        </CardContent>
      </Card>

      {/* Tabela de Despesas Mensais */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Despesas Mensais</CardTitle>
          <CardDescription>
            Todas as despesas mensais cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                accessorKey: "name",
                header: "Nome",
              },
              {
                accessorKey: "amount",
                header: "Preço",
                cell: ({ row }) => {
                  const amount = parseFloat(row.getValue("amount"))
                  return (
                    <div className="text-right font-medium text-red-600">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )
                },
              },
              {
                accessorKey: "dayOfMonth",
                header: "Dia da Cobrança",
                cell: ({ row }) => {
                  const day = row.getValue("dayOfMonth") as number
                  return (
                    <div className="text-center">
                      Dia {day}
                    </div>
                  )
                },
              },
              {
                accessorKey: "cancellationLink",
                header: "Ações",
                cell: ({ row }) => {
                  const expense = row.original
                  const link = row.getValue("cancellationLink") as string
                  return (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditExpense(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteExpense(expense)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(link, '_blank')}
                      >
                        Ir para Link
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(link)}
                      >
                        Copiar Link
                      </Button>
                    </div>
                  )
                },
              },
            ]} 
            data={monthlyExpenses} 
            searchKey="name"
            searchPlaceholder="Buscar despesas mensais..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
