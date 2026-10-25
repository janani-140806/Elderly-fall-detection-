import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces including 127.0.0.1 and localhost
    port: 3000,
    open: false
  }
});
