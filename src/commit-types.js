export const COMMIT_TYPES = {
    feat: {
        emoji: '๐',
        description: 'Add new feature',
        release: true
    },
    fix: {
        emoji: '๐',
        description: 'Submit a fix from a bug',
        release: true
    },
    perf: {
        emoji: 'โก๏ธ',
        description: 'Improve performance',
        release: true
    },
    docs: {
        emoji: '๐',
        description: 'Add or update documentation',
        release: false
    },
    refactor: {
        emoji: 'โ๏ธ',
        description: 'Refactor code',
        release: true
    },
    test: {
        emoji: '๐งช',
        description: 'Add or update tests',
        release: false
    },
    build: {
        emoji: '๐๏ธ',
        description: 'Add or update build scripts',
        release: false
    }
}