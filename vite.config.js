

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: '/app/', 
  server: {
    proxy: {
      '/api': {
        target: 'https://ext.videogen.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     external: ['react-quill','react-quill/dist/quill.snow.css'] // Add react-quill to external if necessary
  //   }
  // }
});



// vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';

// export default defineConfig({
//   base: '/app', // <--- Add this line
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://ext.videogen.io',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
//   plugins: [react()],
// });