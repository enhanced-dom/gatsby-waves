import { eslintConfigFactory } from '@enhanced-dom/lint'

export default eslintConfigFactory({
  ignore: ['**/*.d.ts', '**/gatsby-theme-waves/**/*', '**/code-surfer/**/*', '**/gatsby-theme-blog/**/*'],
  rules: {
    'react/no-unknown-property': ['error', { ignore: ['sx'] }],
  },
})
