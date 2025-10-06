# Configuração do Firebase

Este projeto foi configurado para usar Firebase Firestore para persistência de dados em vez do localStorage.

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Ative o Firestore Database no seu projeto
4. Vá para "Project Settings" > "General" > "Your apps"
5. Adicione uma nova aplicação web
6. Copie as configurações do Firebase

### 3. Configurar variáveis de ambiente

1. Copie o arquivo `env.example` para `.env`:
```bash
cp env.example .env
```

2. Edite o arquivo `.env` com suas configurações do Firebase:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Use Firebase Emulators for development
VITE_USE_FIREBASE_EMULATOR=false
```

### 4. Configurar regras do Firestore

No Console do Firebase, vá para "Firestore Database" > "Rules" e configure as regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos os documentos
    // ATENÇÃO: Configure regras mais restritivas para produção
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 5. Executar o projeto

```bash
npm run dev
```

## Estrutura das Coleções

O Firebase Firestore será organizado com as seguintes coleções:

- `transactions` - Transações financeiras
- `monthlyIncomes` - Receitas mensais
- `monthlyExpenses` - Despesas mensais
- `categories` - Categorias de gastos
- `wishes` - Lista de desejos
- `notifications` - Notificações do sistema
- `shoppingList` - Lista de compras

## Funcionalidades

- ✅ **Sincronização em tempo real**: Mudanças são refletidas instantaneamente
- ✅ **Persistência na nuvem**: Dados salvos no Firebase
- ✅ **Backup automático**: Dados seguros na nuvem
- ✅ **Multi-dispositivo**: Acesso aos dados de qualquer lugar
- ✅ **Offline support**: Funciona mesmo sem conexão (com sincronização posterior)

## Migração de Dados

Se você já tem dados no localStorage, eles serão automaticamente carregados na primeira execução e sincronizados com o Firebase.

## Desenvolvimento

Para usar os emuladores do Firebase em desenvolvimento:

1. Instale o Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Configure os emuladores:
```bash
firebase init emulators
```

3. Configure a variável de ambiente:
```env
VITE_USE_FIREBASE_EMULATOR=true
```

4. Execute os emuladores:
```bash
firebase emulators:start
```

## Troubleshooting

### Erro de configuração
- Verifique se todas as variáveis de ambiente estão configuradas corretamente
- Confirme se o projeto Firebase está ativo

### Erro de permissão
- Verifique as regras do Firestore
- Confirme se o Firestore está habilitado no projeto

### Erro de conexão
- Verifique sua conexão com a internet
- Confirme se as configurações do Firebase estão corretas
