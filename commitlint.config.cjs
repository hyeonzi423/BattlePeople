module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        [
          'Feat',
          'Fix',
          'Docs',
          'Style',
          'Refactor',
          'Test',
          'Chore',
          'Design',
          'Comment',
          'Rename',
          'Remove',
          '!BREAKING CHANGE',
          '!HOTFIX'
        ]
      ],
      'type-case': [0], // type-case 규칙을 비활성화
      'header-case': [2, 'always', 'sentence-case'],
      'header-max-length': [2, 'always', 100],
      'body-leading-blank': [1, 'always'],
    }
  };
  