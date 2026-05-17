import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  source: {
    entry: {
      index: './src/main.tsx', 
    },
  },
  plugins: [pluginReact(), pluginSass()],
  html: {
    template: './public/index.html',
  },
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
  output: {
    assetPrefix: '/',
    filenameHash: true,
    cssModules: {
      exportLocalsConvention: 'camelCase',
    },
    distPath: {
      js: 'assets',
      css: 'assets',
    },
  },
  tools: {
    rspack: (config, { appendRules }) => {
      appendRules([
        {
          test: /\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash:8][ext]',
          },
          oneOf: [
            {
              issuer: /\.(js|jsx|ts|tsx)$/,
              use: [
                {
                  loader: '@svgr/webpack',
                  options: {
                    icon: true,
                    svgo: true,
                  },
                },
              ],
            },
          ],
        },
      ]);
      return config;
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
    },
  },
});