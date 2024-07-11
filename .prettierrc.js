module.exports = {
  printWidth: 120,  //超过多少个字符自动换行
  tabWidth: 2,
  singleQuote: true,
  semi: true,
  useTabs: false,
  bracketSpacing: true,
  trailingComma: 'all',
  jsxSingleQuote: false,
  endOfLine: 'auto',
  overrides: [{
    files: '.prettierrc',
    options: {
      parser: 'json',
    },
  }, ],
}