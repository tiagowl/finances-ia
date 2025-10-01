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
import { Plus, Tag } from "lucide-react"
import { Category } from "@/types"

// Schema de validação para o formulário de categoria
const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  limit: z.string().min(1, "Limite é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Limite deve ser um número positivo"
  }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

// Dados de exemplo para categorias
const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Jogos',
    budget: 134.90,
    maxBudget: 200.00,
    color: 'red'
  },
  {
    id: '2',
    name: 'Alimentação',
    budget: 366.30,
    maxBudget: 500.00,
    color: 'red'
  },
  {
    id: '3',
    name: 'Refeição',
    budget: 130.40,
    maxBudget: 300.00,
    color: 'red'
  }
]

// Calcular totais por categoria
const totalCategoriesAmount = sampleCategories.reduce((sum, category) => sum + category.budget, 0)
const totalGamesAmount = sampleCategories.find(cat => cat.name === 'Jogos')?.budget || 0
const totalFoodAmount = sampleCategories.find(cat => cat.name === 'Alimentação')?.budget || 0
const totalMealAmount = sampleCategories.find(cat => cat.name === 'Refeição')?.budget || 0

// Definições de colunas para as tabelas
const categoriesColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "budget",
    header: "Preço",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("budget"))
      return (
        <div className="text-right font-medium text-red-600">
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )
    },
  },
  {
    accessorKey: "maxBudget",
    header: "Orçamento Máximo",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("maxBudget"))
      return (
        <div className="text-right font-medium text-blue-600">
          R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )
    },
  },
]

export default function Categories() {
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)

  // Formulário de categoria
  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      limit: "",
    },
  })

  // Função para submeter o formulário de categoria
  const onSubmitCategory = (values: CategoryFormValues) => {
    console.log("Nova categoria:", values)
    // Aqui você pode adicionar a lógica para salvar a categoria
    categoryForm.reset()
    setIsCategorySheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie suas categorias de receitas e despesas
          </p>
        </div>
        <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Categoria
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Nova Categoria</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar uma nova categoria.
              </SheetDescription>
            </SheetHeader>
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-6 p-4">
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Alimentação, Transporte, Lazer..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={categoryForm.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite</FormLabel>
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
                    onClick={() => setIsCategorySheetOpen(false)}
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
        {/* Total de Categorias */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Categorias
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalCategoriesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleCategories.length} categoria(s) cadastrada(s)
            </p>
          </CardContent>
        </Card>

        {/* Categoria Jogos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categoria - Jogos
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalGamesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoria de jogos
            </p>
          </CardContent>
        </Card>

        {/* Categoria Alimentação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categoria - Alimentação
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalFoodAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoria de alimentação
            </p>
          </CardContent>
        </Card>

        {/* Categoria Refeição */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Categoria - Refeição
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalMealAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Categoria de refeição
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorias</CardTitle>
          <CardDescription>
            Todas as categorias cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={categoriesColumns} 
            data={sampleCategories} 
            searchKey="name"
            searchPlaceholder="Buscar categorias..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
