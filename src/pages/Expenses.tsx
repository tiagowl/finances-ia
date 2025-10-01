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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, TrendingDown } from "lucide-react"
import { Transaction } from "@/types"

// Schema de validação para o formulário de despesa
const expenseFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  category: z.string().min(1, "Categoria é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo"
  }),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

// Dados de exemplo para despesas
const sampleExpenses: Transaction[] = [
  {
    id: '5',
    type: 'expense',
    category: 'Jogos',
    description: 'Steam - Jogos em promoção',
    amount: 89.90,
    isFixed: false,
    date: '2024-01-10',
    notes: 'Promoção de inverno'
  },
  {
    id: '6',
    type: 'expense',
    category: 'Jogos',
    description: 'PlayStation Plus',
    amount: 45.00,
    isFixed: true,
    date: '2024-01-15',
    notes: 'Assinatura mensal'
  },
  {
    id: '7',
    type: 'expense',
    category: 'Alimentação',
    description: 'Supermercado',
    amount: 320.50,
    isFixed: false,
    date: '2024-01-12',
    notes: 'Compras da semana'
  },
  {
    id: '8',
    type: 'expense',
    category: 'Alimentação',
    description: 'Padaria',
    amount: 45.80,
    isFixed: false,
    date: '2024-01-18',
    notes: 'Pão e café da manhã'
  },
  {
    id: '9',
    type: 'expense',
    category: 'Refeição',
    description: 'Restaurante',
    amount: 85.00,
    isFixed: false,
    date: '2024-01-20',
    notes: 'Jantar com amigos'
  },
  {
    id: '10',
    type: 'expense',
    category: 'Refeição',
    description: 'Delivery',
    amount: 32.90,
    isFixed: false,
    date: '2024-01-22',
    notes: 'Ifood - Pizza'
  },
  {
    id: '11',
    type: 'expense',
    category: 'Refeição',
    description: 'Café',
    amount: 12.50,
    isFixed: false,
    date: '2024-01-25',
    notes: 'Café da tarde'
  },
  {
    id: '12',
    type: 'expense',
    category: 'Transporte',
    description: 'Uber',
    amount: 25.00,
    isFixed: false,
    date: '2024-01-28',
    notes: 'Viagem para o centro'
  }
]

// Calcular totais das despesas por categoria
const totalExpenses = sampleExpenses.reduce((sum, expense) => sum + expense.amount, 0)
const totalGamesExpenses = sampleExpenses
  .filter(expense => expense.category === 'Jogos')
  .reduce((sum, expense) => sum + expense.amount, 0)
const totalFoodExpenses = sampleExpenses
  .filter(expense => expense.category === 'Alimentação')
  .reduce((sum, expense) => sum + expense.amount, 0)
const totalMealExpenses = sampleExpenses
  .filter(expense => expense.category === 'Refeição')
  .reduce((sum, expense) => sum + expense.amount, 0)

// Definições de colunas para as tabelas
const expensesColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
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
    accessorKey: "date",
    header: "Data da Despesa",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    cell: ({ row }) => {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
          {row.getValue("category")}
        </span>
      )
    },
  },
  {
    accessorKey: "isFixed",
    header: "Tipo",
    cell: ({ row }) => {
      const isFixed = row.getValue("isFixed") as boolean
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isFixed 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isFixed ? 'Fixa' : 'Variável'}
        </span>
      )
    },
  },
  {
    accessorKey: "notes",
    header: "Observações",
    cell: ({ row }) => {
      return row.getValue("notes") || '-'
    },
  },
]

export default function Expenses() {
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false)

  // Formulário de despesa
  const expenseForm = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      name: "",
      date: "",
      category: "",
      amount: "",
    },
  })

  // Função para submeter o formulário de despesa
  const onSubmitExpense = (values: ExpenseFormValues) => {
    console.log("Nova despesa:", values)
    // Aqui você pode adicionar a lógica para salvar a despesa
    expenseForm.reset()
    setIsExpenseSheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Despesas</h1>
          <p className="text-muted-foreground">
            Visualize todas as suas despesas
          </p>
        </div>
        <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Despesa
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Despesa</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar uma nova despesa.
              </SheetDescription>
            </SheetHeader>
            <Form {...expenseForm}>
              <form onSubmit={expenseForm.handleSubmit(onSubmitExpense)} className="space-y-6 p-4">
                <FormField
                  control={expenseForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Compras no supermercado..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={expenseForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Despesa</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={expenseForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Jogos">Jogos</SelectItem>
                          <SelectItem value="Alimentação">Alimentação</SelectItem>
                          <SelectItem value="Refeição">Refeição</SelectItem>
                          <SelectItem value="Transporte">Transporte</SelectItem>
                          <SelectItem value="Saúde">Saúde</SelectItem>
                          <SelectItem value="Educação">Educação</SelectItem>
                          <SelectItem value="Lazer">Lazer</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={expenseForm.control}
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
                    onClick={() => setIsExpenseSheetOpen(false)}
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
      
      {/* Cards de Estatística */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Despesas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Despesas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleExpenses.length} despesa(s) cadastrada(s)
            </p>
          </CardContent>
        </Card>

        {/* Despesas com Jogos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas - Jogos
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalGamesExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleExpenses.filter(e => e.category === 'Jogos').length} despesa(s) em jogos
            </p>
          </CardContent>
        </Card>

        {/* Despesas com Alimentação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas - Alimentação
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalFoodExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleExpenses.filter(e => e.category === 'Alimentação').length} despesa(s) em alimentação
            </p>
          </CardContent>
        </Card>

        {/* Despesas com Refeição */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Despesas - Refeição
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalMealExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleExpenses.filter(e => e.category === 'Refeição').length} despesa(s) em refeição
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Despesas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Despesas</CardTitle>
          <CardDescription>
            Todas as despesas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={expensesColumns} 
            data={sampleExpenses} 
            searchKey="description"
            searchPlaceholder="Buscar despesas..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
