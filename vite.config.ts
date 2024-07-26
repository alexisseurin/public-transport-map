import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

export default defineConfig(({ mode }) => {
  dotenv.config({ path: `.env.${mode}` });

  console.log(`Mode: ${mode}`);
  console.log(`VITE_DATA_URL: ${process.env.VITE_DATA_URL}`);

  return {
    plugins: [react()],
    base: '/public-transport-map/',
    define: {
      'process.env': process.env,
    },
  };
});
