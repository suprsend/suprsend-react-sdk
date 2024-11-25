import { defineConfig, loadEnv, LibraryFormats } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const CJSBuild = env.BUILD_TARGET?.toLocaleLowerCase()?.match('cjs');
  const formats: LibraryFormats[] = CJSBuild ? ['cjs'] : ['es'];

  return {
    plugins: [
      react({
        jsxRuntime: 'classic',
        babel: {
          plugins: ['react-require'],
        },
      }),
      dts({
        outDir: 'dist/types',
        tsconfigPath: './tsconfig.app.json',
      }),
    ],
    build: {
      outDir: CJSBuild ? 'dist/cjs' : 'dist/es',
      sourcemap: true,
      copyPublicDir: false,
      lib: {
        entry: 'src',
        fileName: `[name]`,
        name: 'SuprSend',
        formats,
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
          exports: 'named',
        },
      },
    },
  };
});
