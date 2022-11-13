module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'to',
        'fix',
        'docs',
        'style',
        'refactore',
        'perf',
        'test',
        'chore',
        'revert',
        'demo',
      ],
    ],
  },
}
