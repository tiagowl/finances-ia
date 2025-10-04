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
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, ShoppingCart, Edit, Trash2, CheckCircle2, Circle } from "lucide-react"
import { ShoppingItem } from "@/types"
import { useFinance } from "@/contexts/FinanceContext"

// Schema de validação para o formulário de item da lista de compras
const shoppingItemFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Preço deve ser um número positivo"
  }),
})

type ShoppingItemFormValues = z.infer<typeof shoppingItemFormSchema>

export default function ShoppingList() {
  const [isShoppingItemSheetOpen, setIsShoppingItemSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
  const { 
    shoppingList, 
    addShoppingItem, 
    updateShoppingItem, 
    deleteShoppingItem, 
    toggleShoppingItemPurchased 
  } = useFinance()

  // Formulário de item da lista de compras
  const shoppingItemForm = useForm<ShoppingItemFormValues>({
    resolver: zodResolver(shoppingItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  })

  // Função para submeter o formulário de item da lista de compras
  const onSubmitShoppingItem = (values: ShoppingItemFormValues) => {
    if (editingItem) {
      // Atualizar item existente
      updateShoppingItem(editingItem.id, {
        name: values.name,
        price: parseFloat(values.price),
      })
    } else {
      // Criar novo item
      addShoppingItem({
        name: values.name,
        price: parseFloat(values.price),
        isPurchased: false,
        createdAt: new Date().toISOString()
      })
    }
    
    shoppingItemForm.reset()
    setIsShoppingItemSheetOpen(false)
    setEditingItem(null)
  }

  // Função para abrir o drawer de edição
  const handleEditItem = (item: ShoppingItem) => {
    setEditingItem(item)
    shoppingItemForm.reset({
      name: item.name,
      price: item.price.toString(),
    })
    setIsShoppingItemSheetOpen(true)
  }

  // Função para excluir item
  const handleDeleteItem = (item: ShoppingItem) => {
    if (confirm(`Tem certeza que deseja excluir o item "${item.name}"?`)) {
      deleteShoppingItem(item.id)
    }
  }

  // Função para fechar o drawer e limpar o estado de edição
  const handleCloseSheet = () => {
    setIsShoppingItemSheetOpen(false)
    setEditingItem(null)
    shoppingItemForm.reset()
  }

  // Função para lidar com mudanças no estado do Sheet
  const handleSheetOpenChange = (open: boolean) => {
    setIsShoppingItemSheetOpen(open)
    if (!open) {
      setEditingItem(null)
      shoppingItemForm.reset()
    }
  }

  // Calcular estatísticas
  const totalItems = shoppingList.length
  const purchasedItems = shoppingList.filter(item => item.isPurchased).length
  const pendingItems = totalItems - purchasedItems
  const totalValue = shoppingList.reduce((sum, item) => sum + item.price, 0)
  const purchasedValue = shoppingList
    .filter(item => item.isPurchased)
    .reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lista de Compras</h1>
          <p className="text-muted-foreground">
            Gerencie sua lista de compras
          </p>
        </div>
        <Sheet open={isShoppingItemSheetOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>{editingItem ? 'Editar Item' : 'Adicionar Novo Item'}</SheetTitle>
              <SheetDescription>
                {editingItem 
                  ? 'Edite os dados abaixo para atualizar o item.' 
                  : 'Preencha os dados abaixo para adicionar um novo item à lista.'}
              </SheetDescription>
            </SheetHeader>
            <Form {...shoppingItemForm}>
              <form onSubmit={shoppingItemForm.handleSubmit(onSubmitShoppingItem)} className="space-y-6 p-4">
                <FormField
                  control={shoppingItemForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Leite, Pão, Arroz..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={shoppingItemForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
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
                    {editingItem ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Cards de Estatística */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total de Itens */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Itens
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Itens na lista
            </p>
          </CardContent>
        </Card>

        {/* Itens Comprados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Comprados
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {purchasedItems}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalItems > 0 ? `${((purchasedItems / totalItems) * 100).toFixed(1)}% da lista` : '0% da lista'}
            </p>
          </CardContent>
        </Card>

        {/* Itens Pendentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Itens Pendentes
            </CardTitle>
            <Circle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingItems}
            </div>
            <p className="text-xs text-muted-foreground">
              Ainda não comprados
            </p>
          </CardContent>
        </Card>

        {/* Valor Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              R$ {purchasedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} comprados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Itens da Lista de Compras */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Compras</CardTitle>
          <CardDescription>
            Todos os itens da sua lista de compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={[
              {
                id: "purchased",
                header: "Status",
                cell: ({ row }) => {
                  const item = row.original
                  return (
                    <div className="flex items-center">
                      <Checkbox
                        checked={item.isPurchased}
                        onCheckedChange={() => toggleShoppingItemPurchased(item.id)}
                        className="mr-2"
                      />
                      <span className={item.isPurchased ? "line-through text-muted-foreground" : ""}>
                        {item.isPurchased ? "Comprado" : "Pendente"}
                      </span>
                    </div>
                  )
                },
              },
              {
                accessorKey: "name",
                header: "Nome",
                cell: ({ row }) => {
                  const item = row.original
                  return (
                    <span className={item.isPurchased ? "line-through text-muted-foreground" : ""}>
                      {item.name}
                    </span>
                  )
                },
              },
              {
                accessorKey: "price",
                header: "Preço",
                cell: ({ row }) => {
                  const price = parseFloat(row.getValue("price"))
                  return (
                    <div className="text-right font-medium text-green-600">
                      R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )
                },
              },
              {
                id: "actions",
                header: "Ações",
                cell: ({ row }) => {
                  const item = row.original
                  return (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                },
              },
            ]} 
            data={shoppingList} 
            searchKey="name"
            searchPlaceholder="Buscar itens..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
