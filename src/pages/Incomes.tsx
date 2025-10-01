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
import { Plus, TrendingUp } from "lucide-react"
import { Transaction } from "@/types"

// Schema de validação para o formulário de receita
const incomeFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo"
  }),
})

type IncomeFormValues = z.infer<typeof incomeFormSchema>

// Dados de exemplo para receitas
const sampleIncomes: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'Salário',
    description: 'Salário mensal',
    amount: 5000.00,
    isFixed: true,
    date: '2024-01-15',
    notes: 'Salário base'
  },
  {
    id: '2',
    type: 'income',
    category: 'Freelance',
    description: 'Projeto de desenvolvimento web',
    amount: 1200.00,
    isFixed: false,
    date: '2024-01-20',
    notes: 'Projeto concluído'
  },
  {
    id: '3',
    type: 'income',
    category: 'Investimentos',
    description: 'Dividendos de ações',
    amount: 350.00,
    isFixed: false,
    date: '2024-01-25',
    notes: 'Portfolio diversificado'
  },
  {
    id: '4',
    type: 'income',
    category: 'Vendas',
    description: 'Venda de produto digital',
    amount: 180.00,
    isFixed: false,
    date: '2024-01-28',
    notes: 'E-book sobre finanças'
  }
]

// Calcular total das receitas
const totalIncomes = sampleIncomes.reduce((sum, income) => sum + income.amount, 0)

// Definições de colunas para as tabelas
const incomesColumns: ColumnDef<Transaction>[] = [
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
        <div className="text-right font-medium text-green-600">
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Data de Recebimento",
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString('pt-BR')
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

export default function Incomes() {
  const [isIncomeSheetOpen, setIsIncomeSheetOpen] = useState(false)

  // Formulário de receita
  const incomeForm = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      name: "",
      date: "",
      amount: "",
    },
  })

  // Função para submeter o formulário de receita
  const onSubmitIncome = (values: IncomeFormValues) => {
    console.log("Nova receita:", values)
    // Aqui você pode adicionar a lógica para salvar a receita
    incomeForm.reset()
    setIsIncomeSheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="text-muted-foreground">
            Visualize todas as suas receitas
          </p>
        </div>
        <Sheet open={isIncomeSheetOpen} onOpenChange={setIsIncomeSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Receita
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Receita</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar uma nova receita.
              </SheetDescription>
            </SheetHeader>
            <Form {...incomeForm}>
              <form onSubmit={incomeForm.handleSubmit(onSubmitIncome)} className="space-y-6 p-4">
                <FormField
                  control={incomeForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Salário, Freelance..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={incomeForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Recebimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={incomeForm.control}
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
                    onClick={() => setIsIncomeSheetOpen(false)}
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
            Total de Receitas
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {sampleIncomes.length} receita(s) cadastrada(s)
          </p>
        </CardContent>
      </Card>

      {/* Tabela de Receitas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Receitas</CardTitle>
          <CardDescription>
            Todas as receitas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={incomesColumns} 
            data={sampleIncomes} 
            searchKey="description"
            searchPlaceholder="Buscar receitas..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
