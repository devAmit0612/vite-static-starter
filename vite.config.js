// Modules
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';
import autoprefixer from 'autoprefixer';

// Vite plugins
import include from 'vite-plugin-html-include';
import checker from 'vite-plugin-checker';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

// Local plugins
import { responsiveImages, injectInlineSvg } from './vite.plugins.js';

const imageQuality = 75;
const htmlFiles = globSync('./src/**/*.html', {
  ignore: ['node_modules/**', 'dist/**', '**/_*.html'],
});
const input = htmlFiles.reduce((acc, file) => {
  const name = file
    .replace(/\\/g, '/')
    .replace(/^(\.\/)?src\//, '')
    .replace(/\.html$/, '');
  acc[name] = resolve(__dirname, file);
  return acc;
}, {});

export default defineConfig(({ mode }) => ({
  root: 'src',
  publicDir: '../public',
  plugins: [
    include(),
    responsiveImages(),
    injectInlineSvg(),
    ViteImageOptimizer({
      webp: {
        quality: imageQuality,
      },
      jpg: {
        quality: imageQuality,
      },
      png: {
        quality: imageQuality,
      },
    }),

    checker({
      overlay: { initialIsOpen: false },
      eslint: {
        lintCommand: 'eslint "./**/*.js"',
      },
    }),
  ],

  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead'],
        }),
      ],
    },
    preprocessorOptions: {
      scss: {},
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './src/assets'),
    },
  },

  build: {
    minify: mode === 'unminified' ? false : true,
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          if (/\.(gif|jpe?g|png|svg|webp|avif|ico)$/i.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(ttf|woff2?|eot|otf)$/i.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          if (/\.css$/i.test(name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));
