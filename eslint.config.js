const eslintConfigFactory = require('@enhanced-dom/lint').eslintConfigFactory

module.exports = eslintConfigFactory({
  ignore: ['**/*.d.ts', '**/gatsby-theme-waves/**/*', '**/code-surfer/**/*', '**/gatsby-theme-blog/**/*']
})
