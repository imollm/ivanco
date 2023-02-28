export const COMMIT_TYPES = {
    feat: {
        emoji: '🆕',
        description: 'Add new feature',
        release: true
    },
    fix: {
        emoji: '🐛',
        description: 'Submit a fix from a bug',
        release: true
    },
    perf: {
        emoji: '⚡️',
        description: 'Improve performance',
        release: true
    },
    docs: {
        emoji: '📖',
        description: 'Add or update documentation',
        release: false
    },
    refactor: {
        emoji: '✏️',
        description: 'Refactor code',
        release: true
    },
    test: {
        emoji: '🧪',
        description: 'Add or update tests',
        release: false
    },
    build: {
        emoji: '🏗️',
        description: 'Add or update build scripts',
        release: false
    }
}