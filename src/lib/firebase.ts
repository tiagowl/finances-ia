import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth'

// Verificar se todas as variáveis de ambiente necessárias estão definidas
const isFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID

let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  // Configuração do Firebase
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }

  try {
    // Inicializar Firebase
    app = initializeApp(firebaseConfig)
    
    // Inicializar serviços
    db = getFirestore(app)
    auth = getAuth(app)
    
    console.log('✅ Firebase inicializado com sucesso')
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error)
    app = null
    db = null
    auth = null
  }
} else {
  console.warn('⚠️ Firebase não configurado. Variáveis de ambiente ausentes. Usando localStorage como fallback.')
}

export { db, auth }

// Conectar aos emuladores em desenvolvimento (opcional)
if (db && auth && import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectAuthEmulator(auth, 'http://localhost:9099')
    console.log('🔧 Firebase Emulators conectados')
  } catch (error) {
    console.log('Firebase emulators already connected')
  }
}

export default app
