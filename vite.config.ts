import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/public-transport-map/', // Remplacez par le nom de votre dépôt GitHub
  build: {
    outDir: 'dist',  // Le dossier de sortie pour les fichiers transpilés
  },
})
