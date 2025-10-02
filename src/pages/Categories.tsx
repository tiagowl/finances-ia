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
import { Plus, Tag, Edit, Trash2, TrendingDown } from "lucide-react"
import { Category } from "@/types"
import { useFinance } from "@/contexts/FinanceContext"

// Schema de validação para o formulário de categoria
const categoryFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  limit: z.string().min(1, "Limite é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Limite deve ser um número positivo"
  }),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>



export default function Categories() {
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { categories, addCategory, updateCategory, deleteCategory, getCategoryExpenses } = useFinance()
  
  // Função de debug para limpar dados antigos
  const clearOldData = () => {
    if (confirm('Isso irá limpar todas as categorias. Continuar?')) {
      localStorage.removeItem('finances-categories')
      window.location.reload()
    }
  }

  // Calculate totals by category
  const totalMaxBudgets = categories.reduce((sum, category) => sum + category.maxBudget, 0)
  
  // Calculate expenses by category
  const categoryExpenses = categories.map(category => ({
    ...category,
    spent: getCategoryExpenses(category.name)
  }))
  
  const totalSpent = categoryExpenses.reduce((sum, cat) => sum + cat.spent, 0)

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
    if (editingCategory) {
      // Atualizar categoria existente
      updateCategory(editingCategory.id, {
        name: values.name,
        maxBudget: parseFloat(values.limit),
      })
    } else {
      // Criar nova categoria
      addCategory({
        name: values.name,
        budget: 0, // Start with 0 spent
        maxBudget: parseFloat(values.limit),
        color: 'blue' // Default color
      })
    }
    
    categoryForm.reset()
    setIsCategorySheetOpen(false)
    setEditingCategory(null)
  }

  // Função para abrir o drawer de edição
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    categoryForm.reset({
      name: category.name,
      limit: category.maxBudget.toString(),
    })
    setIsCategorySheetOpen(true)
  }

  // Função para excluir categoria
  const handleDeleteCategory = (category: Category) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
      deleteCategory(category.id)
    }
  }

  // Função para fechar o drawer e limpar o estado de edição
  const handleCloseSheet = () => {
    setIsCategorySheetOpen(false)
    setEditingCategory(null)
    categoryForm.reset()
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
        <div className="flex gap-2">
          <Button 
            onClick={clearOldData}
            variant="outline"
            size="sm"
          >
            🗑️ Limpar Dados (Debug)
          </Button>
          <Sheet open={isCategorySheetOpen} onOpenChange={handleCloseSheet}>
            <SheetTrigger asChild>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Categoria
              </Button>
            </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{editingCategory ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}</SheetTitle>
              <SheetDescription>
                {editingCategory 
                  ? 'Edite os dados abaixo para atualizar a categoria.' 
                  : 'Preencha os dados abaixo para cadastrar uma nova categoria.'}
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
                    onClick={handleCloseSheet}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 bg-black hover:bg-gray-800">
                    {editingCategory ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Cards de Estatística */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total de Orçamentos Máximos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Orçamentos Máximos
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {totalMaxBudgets.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {categories.length} categoria(s) cadastrada(s)
            </p>
          </CardContent>
        </Card>

        {/* Total Gasto em Categorias */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gasto em Categorias
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as despesas por categoria
            </p>
          </CardContent>
        </Card>

        {/* Saldo Disponível */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saldo Disponível
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalMaxBudgets - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              R$ {(totalMaxBudgets - totalSpent).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Orçamento restante nas categorias
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
            columns={[
              {
                accessorKey: "name",
                header: "Nome",
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
              {
                id: "spent",
                header: "Gasto",
                cell: ({ row }) => {
                  const category = row.original
                  const spent = getCategoryExpenses(category.name)
                  return (
                    <div className="text-right font-medium text-red-600">
                      R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )
                },
              },
              {
                id: "remaining",
                header: "Restante",
                cell: ({ row }) => {
                  const category = row.original
                  const spent = getCategoryExpenses(category.name)
                  const remaining = category.maxBudget - spent
                  return (
                    <div className={`text-right font-medium ${
                      remaining >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )
                },
              },
              {
                id: "actions",
                header: "Ações",
                cell: ({ row }) => {
                  const category = row.original
                  return (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                },
              },
            ]} 
            data={categories} 
            searchKey="name"
            searchPlaceholder="Buscar categorias..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
