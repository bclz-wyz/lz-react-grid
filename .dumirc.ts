import { defineConfig } from 'dumi';

export default defineConfig({
  outputPath: 'docs-dist',
  themeConfig: {
    name: 'lj-react-grid',
  },
  lessLoader:{
    javascriptEnabled: true,
  },
});
