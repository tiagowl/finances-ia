import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
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
import { Plus, CalendarDays } from "lucide-react"
import { MonthlyExpense } from "@/types"
import { useFinance } from "@/contexts/FinanceContext"

// Schema de validação para o formulário de despesa mensal
const monthlyExpenseFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cancellationLink: z.string().min(1, "Link de cancelamento é obrigatório").url("Deve ser uma URL válida"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo"
  }),
})

type MonthlyExpenseFormValues = z.infer<typeof monthlyExpenseFormSchema>


// Definições de colunas para as tabelas
const monthlyExpensesColumns: ColumnDef<MonthlyExpense>[] = [
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
    accessorKey: "lastChargedDate",
    header: "Data Última Cobrança",
    cell: ({ row }) => {
      return new Date(row.getValue("lastChargedDate")).toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: "nextChargedDate",
    header: "Data Próxima Cobrança",
    cell: ({ row }) => {
      return new Date(row.getValue("nextChargedDate")).toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: "cancellationLink",
    header: "Ações",
    cell: ({ row }) => {
      const link = row.getValue("cancellationLink") as string
      return (
        <div className="flex gap-2">
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
]

export default function MonthlyExpenses() {
  const [isMonthlyExpenseSheetOpen, setIsMonthlyExpenseSheetOpen] = useState(false)
  const { monthlyExpenses, addMonthlyExpense, getTotalMonthlyExpenses } = useFinance()

  const totalMonthlyExpenses = getTotalMonthlyExpenses()

  // Formulário de despesa mensal
  const monthlyExpenseForm = useForm<MonthlyExpenseFormValues>({
    resolver: zodResolver(monthlyExpenseFormSchema),
    defaultValues: {
      name: "",
      cancellationLink: "",
      amount: "",
    },
  })

  // Função para submeter o formulário de despesa mensal
  const onSubmitMonthlyExpense = (values: MonthlyExpenseFormValues) => {
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthStr = nextMonth.toISOString().split('T')[0]

    addMonthlyExpense({
      name: values.name,
      amount: parseFloat(values.amount),
      lastChargedDate: today,
      nextChargedDate: nextMonthStr,
      cancellationLink: values.cancellationLink,
      isActive: true
    })
    monthlyExpenseForm.reset()
    setIsMonthlyExpenseSheetOpen(false)
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
        <Sheet open={isMonthlyExpenseSheetOpen} onOpenChange={setIsMonthlyExpenseSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Despesa Mensal
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Despesa Mensal</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar uma nova despesa mensal.
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
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsMonthlyExpenseSheetOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
                    Cadastrar
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
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
            columns={monthlyExpensesColumns} 
            data={monthlyExpenses} 
            searchKey="name"
            searchPlaceholder="Buscar despesas mensais..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
