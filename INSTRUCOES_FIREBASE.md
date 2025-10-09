# 🔥 Instruções de Configuração do Firebase

## ⚠️ Problema Atual

Os dados não estão sendo salvos porque o Firebase não está configurado. A aplicação agora possui um **fallback automático para localStorage** quando o Firebase não está disponível.

## ✅ Como Resolver

Você tem **2 opções**:

### Opção 1: Usar apenas localStorage (Mais Rápido) ✨

A aplicação **JÁ ESTÁ FUNCIONANDO** com localStorage como fallback! Os dados serão salvos localmente no navegador.

**Vantagens:**
- ✅ Não precisa configurar Firebase
- ✅ Funciona imediatamente
- ✅ Dados salvos localmente

**Desvantagens:**
- ❌ Dados não sincronizam entre dispositivos
- ❌ Dados perdidos se limpar cache do navegador

### Opção 2: Configurar Firebase (Recomendado para Produção) 🚀

1. **Criar arquivo `.env` na raiz do projeto** com suas credenciais do Firebase:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id

# Optional: Use Firebase Emulators for development
VITE_USE_FIREBASE_EMULATOR=false
```

2. **Obter as credenciais:**
   - Acesse [Firebase Console](https://console.firebase.google.com/)
   - Crie um projeto ou use um existente
   - Vá em Project Settings > General
   - Em "Your apps", adicione um Web App
   - Copie as configurações do Firebase

3. **Reiniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🔍 Verificar se está funcionando

1. Abra o navegador em `http://localhost:5173`
2. Abra o Console do navegador (F12)
3. Se ver a mensagem "Firebase não está configurado. Usando localStorage como fallback." - está usando localStorage
4. Se NÃO ver essa mensagem - Firebase está configurado corretamente

## 📝 Testando o Sistema

1. Vá em "Receitas Mensais" ou "Despesas Mensais"
2. Clique em "Cadastrar"
3. Preencha o formulário
4. Clique em "Cadastrar" 
5. O item deve aparecer na lista

**Com localStorage:** Os dados são salvos instantaneamente no navegador
**Com Firebase:** Os dados são salvos na nuvem e sincronizam em tempo real

## 🐛 Se ainda não funcionar

Verifique no Console do navegador (F12) se há erros. As mensagens de erro ajudarão a identificar o problema.

