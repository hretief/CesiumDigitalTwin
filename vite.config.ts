import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium';

// https://vite.dev/config/
export default defineConfig({
    //server: { https: true }, // Not needed for Vite 5+
    plugins: [mkcert(), react(), cesium()],
});
