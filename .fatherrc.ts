import { defineConfig } from 'father';

export default defineConfig({
  // more father config: https://github.com/umijs/father/blob/master/docs/config.md
  esm: { output: 'dist' },
  umd:{
    postcssOptions:{
      plugins: [
        require('postcss-import')(),
        require('postcss-url')(),
        require('postcss-preset-env')(),
        require('postcss-nested')(),
        require('postcss-extend')(),
        require('postcss-pxtorem')({
          rootValue: 16,
          propList: ['*'],
          selectorBlackList: [/^html$/],
        })
      ]
    }
  }
});
