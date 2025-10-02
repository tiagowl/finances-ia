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
import { Plus, Calendar, Edit, Trash2 } from "lucide-react"
import { MonthlyIncome } from "@/types"
import { useFinance } from "@/contexts/FinanceContext"

// Schema de validação para o formulário de receita mensal
const monthlyIncomeFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
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

type MonthlyIncomeFormValues = z.infer<typeof monthlyIncomeFormSchema>



export default function MonthlyIncomes() {
  const [isMonthlyIncomeSheetOpen, setIsMonthlyIncomeSheetOpen] = useState(false)
  const [editingIncome, setEditingIncome] = useState<MonthlyIncome | null>(null)
  const { monthlyIncomes, addMonthlyIncome, updateMonthlyIncome, deleteMonthlyIncome, getTotalMonthlyIncomes } = useFinance()
  
  // Função de debug para limpar dados antigos
  const clearOldData = () => {
    if (confirm('Isso irá limpar todas as receitas mensais. Continuar?')) {
      localStorage.removeItem('finances-monthly-incomes')
      window.location.reload()
    }
  }

  const totalMonthlyIncomes = getTotalMonthlyIncomes()

  // Formulário de receita mensal
  const monthlyIncomeForm = useForm<MonthlyIncomeFormValues>({
    resolver: zodResolver(monthlyIncomeFormSchema),
    defaultValues: {
      name: "",
      amount: "",
      dayOfMonth: "",
    },
  })

  // Função para submeter o formulário de receita mensal
  const onSubmitMonthlyIncome = (values: MonthlyIncomeFormValues) => {
    console.log('Form submitted with values:', values)
    console.log('Editing income:', editingIncome)
    
    try {
      if (editingIncome) {
        // Atualizar receita existente
        console.log('Updating income with ID:', editingIncome.id)
        updateMonthlyIncome(editingIncome.id, {
          name: values.name,
          amount: parseFloat(values.amount),
          dayOfMonth: parseInt(values.dayOfMonth),
        })
      } else {
        // Criar nova receita
        console.log('Creating new income')
        addMonthlyIncome({
          name: values.name,
          amount: parseFloat(values.amount),
          dayOfMonth: parseInt(values.dayOfMonth),
          isActive: true
        })
      }
      
      monthlyIncomeForm.reset()
      setIsMonthlyIncomeSheetOpen(false)
      setEditingIncome(null)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Função para abrir o drawer de edição
  const handleEditIncome = (income: MonthlyIncome) => {
    setEditingIncome(income)
    monthlyIncomeForm.reset({
      name: income.name,
      amount: income.amount.toString(),
      dayOfMonth: income.dayOfMonth.toString(),
    })
    setIsMonthlyIncomeSheetOpen(true)
  }

  // Função para excluir receita
  const handleDeleteIncome = (income: MonthlyIncome) => {
    if (confirm(`Tem certeza que deseja excluir a receita "${income.name}"?`)) {
      deleteMonthlyIncome(income.id)
    }
  }

  // Função para fechar o drawer e limpar o estado de edição
  const handleCloseSheet = () => {
    setIsMonthlyIncomeSheetOpen(false)
    setEditingIncome(null)
    monthlyIncomeForm.reset()
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas Mensais</h1>
          <p className="text-muted-foreground">
            Visualize suas receitas mensais
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
          <Sheet open={isMonthlyIncomeSheetOpen} onOpenChange={handleCloseSheet}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Receita Mensal
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{editingIncome ? 'Editar Receita Mensal' : 'Cadastrar Nova Receita Mensal'}</SheetTitle>
              <SheetDescription>
                {editingIncome 
                  ? 'Edite os dados abaixo para atualizar a receita mensal.' 
                  : 'Preencha os dados abaixo para cadastrar uma nova receita mensal.'}
              </SheetDescription>
            </SheetHeader>
            <Form {...monthlyIncomeForm}>
              <form onSubmit={monthlyIncomeForm.handleSubmit(onSubmitMonthlyIncome)} className="space-y-6 p-4">
                <FormField
                  control={monthlyIncomeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Salário, Aluguel..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={monthlyIncomeForm.control}
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
                  control={monthlyIncomeForm.control}
                  name="dayOfMonth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dia do Mês para Recebimento</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="31" 
                          placeholder="Ex: 5" 
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
                    {editingIncome ? 'Atualizar' : 'Cadastrar'}
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
            Total de Receitas Mensais
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalMonthlyIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {monthlyIncomes.length} receita(s) mensal(is) cadastrada(s)
          </p>
        </CardContent>
      </Card>

      {/* Tabela de Receitas Mensais */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas Mensais</CardTitle>
          <CardDescription>
            Todas as receitas mensais cadastradas no sistema
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
                    <div className="text-right font-medium text-green-600">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )
                },
              },
              {
                accessorKey: "dayOfMonth",
                header: "Dia do Recebimento",
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
                id: "actions",
                header: "Ações",
                cell: ({ row }) => {
                  const income = row.original
                  return (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditIncome(income)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteIncome(income)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                },
              },
            ]} 
            data={monthlyIncomes} 
            searchKey="name"
            searchPlaceholder="Buscar receitas mensais..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
