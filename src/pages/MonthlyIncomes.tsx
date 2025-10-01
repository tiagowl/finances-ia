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
import { Plus, Calendar } from "lucide-react"
import { MonthlyIncome } from "@/types"

// Schema de validação para o formulário de receita mensal
const monthlyIncomeFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  amount: z.string().min(1, "Valor é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo"
  }),
})

type MonthlyIncomeFormValues = z.infer<typeof monthlyIncomeFormSchema>

// Dados de exemplo para receitas mensais
const sampleMonthlyIncomes: MonthlyIncome[] = [
  {
    id: '13',
    name: 'Salário',
    amount: 5000.00,
    lastReceivedDate: '2024-01-05',
    nextReceivedDate: '2024-02-05',
    isActive: true
  },
  {
    id: '14',
    name: 'Freelance Web',
    amount: 1200.00,
    lastReceivedDate: '2024-01-20',
    nextReceivedDate: '2024-02-20',
    isActive: true
  },
  {
    id: '15',
    name: 'Aluguel Recebido',
    amount: 800.00,
    lastReceivedDate: '2024-01-01',
    nextReceivedDate: '2024-02-01',
    isActive: true
  },
  {
    id: '16',
    name: 'Dividendos',
    amount: 300.00,
    lastReceivedDate: '2024-01-15',
    nextReceivedDate: '2024-02-15',
    isActive: true
  },
  {
    id: '17',
    name: 'Consultoria',
    amount: 2000.00,
    lastReceivedDate: '2024-01-10',
    nextReceivedDate: '2024-02-10',
    isActive: false
  }
]

// Calcular total das receitas mensais
const totalMonthlyIncomes = sampleMonthlyIncomes.reduce((sum, income) => sum + income.amount, 0)

// Definições de colunas para as tabelas
const monthlyIncomesColumns: ColumnDef<MonthlyIncome>[] = [
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
    accessorKey: "lastReceivedDate",
    header: "Data Último Recebimento",
    cell: ({ row }) => {
      return new Date(row.getValue("lastReceivedDate")).toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: "nextReceivedDate",
    header: "Data Próximo Recebimento",
    cell: ({ row }) => {
      return new Date(row.getValue("nextReceivedDate")).toLocaleDateString('pt-BR')
    },
  },
]

export default function MonthlyIncomes() {
  const [isMonthlyIncomeSheetOpen, setIsMonthlyIncomeSheetOpen] = useState(false)

  // Formulário de receita mensal
  const monthlyIncomeForm = useForm<MonthlyIncomeFormValues>({
    resolver: zodResolver(monthlyIncomeFormSchema),
    defaultValues: {
      name: "",
      amount: "",
    },
  })

  // Função para submeter o formulário de receita mensal
  const onSubmitMonthlyIncome = (values: MonthlyIncomeFormValues) => {
    console.log("Nova receita mensal:", values)
    // Aqui você pode adicionar a lógica para salvar a receita mensal
    monthlyIncomeForm.reset()
    setIsMonthlyIncomeSheetOpen(false)
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
        <Sheet open={isMonthlyIncomeSheetOpen} onOpenChange={setIsMonthlyIncomeSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Receita Mensal
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Receita Mensal</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar uma nova receita mensal.
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
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsMonthlyIncomeSheetOpen(false)}
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
            Total de Receitas Mensais
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalMonthlyIncomes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground">
            {sampleMonthlyIncomes.length} receita(s) mensal(is) cadastrada(s)
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
            columns={monthlyIncomesColumns} 
            data={sampleMonthlyIncomes} 
            searchKey="name"
            searchPlaceholder="Buscar receitas mensais..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
