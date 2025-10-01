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
import { Plus, Heart } from "lucide-react"
import { Wish } from "@/types"

// Schema de validação para o formulário de desejo
const wishFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  purchaseLink: z.string().min(1, "Link da compra é obrigatório").url("Deve ser uma URL válida"),
})

type WishFormValues = z.infer<typeof wishFormSchema>

// Dados de exemplo para desejos
const sampleWishes: Wish[] = [
  {
    id: '1',
    name: 'PlayStation 5',
    estimatedPrice: 4500.00,
    category: 'Jogos',
    priority: 'Alta',
    status: 'Pendente',
    targetDate: '2024-06-01',
    purchaseLink: 'https://www.playstation.com/ps5/',
    notes: 'Para jogar os lançamentos exclusivos'
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    estimatedPrice: 12000.00,
    category: 'Trabalho',
    priority: 'Muito Alta',
    status: 'Pendente',
    targetDate: '2024-08-15',
    purchaseLink: 'https://www.apple.com/macbook-pro/',
    notes: 'Necessário para projetos de desenvolvimento'
  },
  {
    id: '3',
    name: 'Viagem para Europa',
    estimatedPrice: 8000.00,
    category: 'Viagem',
    priority: 'Média',
    status: 'Pendente',
    targetDate: '2024-12-01',
    purchaseLink: 'https://www.expedia.com/',
    notes: 'Sonho de conhecer a Europa'
  },
  {
    id: '4',
    name: 'Curso de Inglês',
    purchaseLink: 'https://www.cambridgeenglish.org/',
    category: 'Educação',
    estimatedPrice: 1200.00,
    priority: 'Alta',
    status: 'Pendente',
    targetDate: '2024-04-01',
    notes: 'Para melhorar oportunidades profissionais'
  },
  {
    id: '5',
    name: 'Smartphone iPhone 15',
    purchaseLink: 'https://www.apple.com/iphone-15/',
    category: 'Tecnologia',
    estimatedPrice: 6000.00,
    priority: 'Média',
    status: 'Pendente',
    targetDate: '2024-07-01',
    notes: 'Atualizar do iPhone 12'
  },
  {
    id: '6',
    name: 'Academia Premium',
    purchaseLink: 'https://www.smartfit.com.br/',
    category: 'Saúde',
    estimatedPrice: 2400.00,
    priority: 'Alta',
    status: 'Pendente',
    targetDate: '2024-03-01',
    notes: 'Investir na saúde e bem-estar'
  },
  {
    id: '7',
    name: 'Cafeteira Espresso',
    purchaseLink: 'https://www.nespresso.com/',
    category: 'Alimentação',
    estimatedPrice: 800.00,
    priority: 'Baixa',
    status: 'Pendente',
    targetDate: '2024-05-01',
    notes: 'Para fazer café de qualidade em casa'
  },
  {
    id: '8',
    name: 'Jantar no Restaurante Fino',
    purchaseLink: 'https://www.opentable.com/',
    category: 'Refeição',
    estimatedPrice: 500.00,
    priority: 'Baixa',
    status: 'Pendente',
    targetDate: '2024-02-14',
    notes: 'Para o Dia dos Namorados'
  }
]

// Calcular totais dos desejos
const totalWishesAmount = sampleWishes.reduce((sum, wish) => sum + wish.estimatedPrice, 0)
const totalWishesGamesAmount = sampleWishes
  .filter(wish => wish.category === 'Jogos')
  .reduce((sum, wish) => sum + wish.estimatedPrice, 0)
const totalWishesFoodAmount = sampleWishes
  .filter(wish => wish.category === 'Alimentação')
  .reduce((sum, wish) => sum + wish.estimatedPrice, 0)
const totalWishesMealAmount = sampleWishes
  .filter(wish => wish.category === 'Refeição')
  .reduce((sum, wish) => sum + wish.estimatedPrice, 0)

// Definições de colunas para as tabelas
const wishesColumns: ColumnDef<Wish>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "purchaseLink",
    header: "Link Compra",
    cell: ({ row }) => {
      const link = row.getValue("purchaseLink") as string
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
  {
    accessorKey: "priority",
    header: "Prioridade",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          priority === 'Muito Alta' ? 'bg-red-100 text-red-800' :
          priority === 'Alta' ? 'bg-orange-100 text-orange-800' :
          priority === 'Média' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {priority}
        </span>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          {row.getValue("status")}
        </span>
      )
    },
  },
]

export default function Wishes() {
  const [isWishSheetOpen, setIsWishSheetOpen] = useState(false)

  // Formulário de desejo
  const wishForm = useForm<WishFormValues>({
    resolver: zodResolver(wishFormSchema),
    defaultValues: {
      name: "",
      purchaseLink: "",
    },
  })

  // Função para submeter o formulário de desejo
  const onSubmitWish = (values: WishFormValues) => {
    console.log("Novo desejo:", values)
    // Aqui você pode adicionar a lógica para salvar o desejo
    wishForm.reset()
    setIsWishSheetOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Desejos</h1>
          <p className="text-muted-foreground">
            Gerencie seus desejos e metas financeiras
          </p>
        </div>
        <Sheet open={isWishSheetOpen} onOpenChange={setIsWishSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Desejo
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Cadastrar Novo Desejo</SheetTitle>
              <SheetDescription>
                Preencha os dados abaixo para cadastrar um novo desejo.
              </SheetDescription>
            </SheetHeader>
            <Form {...wishForm}>
              <form onSubmit={wishForm.handleSubmit(onSubmitWish)} className="space-y-6 p-4">
                <FormField
                  control={wishForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: iPhone 15, Notebook, Viagem..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={wishForm.control}
                  name="purchaseLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link da Compra</FormLabel>
                      <FormControl>
                        <Input 
                          type="url" 
                          placeholder="https://exemplo.com/produto" 
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
                    onClick={() => setIsWishSheetOpen(false)}
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
        {/* Total de Desejos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Desejos
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {totalWishesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleWishes.length} desejo(s) cadastrado(s)
            </p>
          </CardContent>
        </Card>

        {/* Desejos - Jogos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desejos - Jogos
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {totalWishesGamesAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleWishes.filter(w => w.category === 'Jogos').length} desejo(s) em jogos
            </p>
          </CardContent>
        </Card>

        {/* Desejos - Alimentação */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desejos - Alimentação
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {totalWishesFoodAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleWishes.filter(w => w.category === 'Alimentação').length} desejo(s) em alimentação
            </p>
          </CardContent>
        </Card>

        {/* Desejos - Refeição */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Desejos - Refeição
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R$ {totalWishesMealAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              {sampleWishes.filter(w => w.category === 'Refeição').length} desejo(s) em refeição
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Desejos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Desejos</CardTitle>
          <CardDescription>
            Seus sonhos e objetivos financeiros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={wishesColumns} 
            data={sampleWishes} 
            searchKey="name"
            searchPlaceholder="Buscar desejos..."
          />
        </CardContent>
      </Card>
    </div>
  )
}
