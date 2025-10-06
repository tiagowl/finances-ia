import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Minus, Calendar, DollarSign } from 'lucide-react'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category: string
  description: string
  amount: number
  isFixed: boolean
  date: string
  notes?: string
}

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void
}

export function TransactionForm({ onSave }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    amount: '',
    isFixed: false,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const categories = {
    income: [
      'Salário',
      'Freelance',
      'Investimentos',
      'Vendas',
      'Outros'
    ],
    expense: [
      'Alimentação',
      'Transporte',
      'Moradia',
      'Saúde',
      'Educação',
      'Lazer',
      'Outros'
    ]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.description || !formData.amount) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      isFixed: formData.isFixed,
      date: formData.date,
      notes: formData.notes || undefined
    }

    onSave(transaction)
    
    // Reset form
    setFormData({
      type: 'expense',
      category: '',
      description: '',
      amount: '',
      isFixed: false,
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          {formData.type === 'income' ? (
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
          ) : (
            <Minus className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
          )}
          Cadastrar {formData.type === 'income' ? 'Receita' : 'Despesa'}
        </CardTitle>
        <CardDescription className="text-sm">
          Adicione uma nova {formData.type === 'income' ? 'receita' : 'despesa'} ao seu controle financeiro
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Tipo de Transação */}
          <div className="space-y-2">
            <Label className="text-sm">Tipo de Transação</Label>
            <div className="flex gap-2 sm:gap-4">
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Receita</span>
              </Button>
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none"
              >
                <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Despesa</span>
              </Button>
            </div>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Descrição *</Label>
            <Input
              id="description"
              placeholder="Ex: Salário mensal, Supermercado, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="text-sm"
            />
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm">Valor (R$) *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="pl-8 sm:pl-10 text-sm"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm">Data</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                className="pl-8 sm:pl-10 text-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Transação Fixa */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isFixed"
              checked={formData.isFixed}
              onCheckedChange={(checked) => setFormData({ ...formData, isFixed: checked })}
            />
            <Label htmlFor="isFixed" className="text-sm">
              {formData.isFixed ? 'Transação Fixa' : 'Transação Variável'}
            </Label>
          </div>

          {formData.isFixed && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs sm:text-sm text-blue-800">
                <strong>Transação Fixa:</strong> Esta transação será repetida automaticamente todos os meses.
              </p>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais (opcional)"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Botões */}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 pt-4">
            <Button type="submit" className="flex-1 text-sm">
              Salvar {formData.type === 'income' ? 'Receita' : 'Despesa'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                type: 'expense',
                category: '',
                description: '',
                amount: '',
                isFixed: false,
                date: new Date().toISOString().split('T')[0],
                notes: ''
              })}
              className="text-sm"
            >
              Limpar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
