import { trytm } from '@bdsqqq/try'
import { intro, outro, text, select, confirm, multiselect, isCancel } from '@clack/prompts'
import colors from 'picocolors'
import { COMMIT_TYPES } from './commit-types.js'
import { getChangedFiles, getStagedFiles, gitCommit, gitAdd } from './git.js'
import { handleExit } from './uitls.js'

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

intro(
  colors.inverse(`CLI assistant for create commits by ${colors.yellow('@ivandev')}`)
)

if (errorChangedFiles ?? errorStagedFiles) {
  outro(colors.red('Error! Please init a git repository.'))
  process.exit(1)
}
if (stagedFiles.length === 0 && changedFiles.length > 0) {
  const files = await multiselect({
    message: colors.cyan('You don\'t have staged files.'),
    options: changedFiles.map(file => ({
      value: file,
      label: file
    }))

  })

  if (isCancel(files)) { handleExit({ message: 'You didn\'t selected any file to be commited.' }) }

  await gitAdd({ files })
}

const commitType = await select({
  message: 'Choose commit\'s type:',
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(20, ' ')} · ${value.description}`
  }))
})

if (isCancel(commitType)) { handleExit({ message: 'You have not selected commit type.' }) }

const commitMsg = await text({
  message: colors.cyan('Enter the commit message:'),
  validate: (value) => {
    if (value.length === 0) {
      return 'The commit message cannot be empty.'
    }

    if (value.length > 50) {
      return 'The commit message cannot be longer than 50 characters.'
    }
  }
})

if (isCancel(commitMsg)) { handleExit({ message: 'You have not written the commit message.' }) }

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange = false
if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `Does this commit have changes that break previous compatibility?
        
    ${colors.yellow('If the answer is yes, you should create a commit with the type "BREAKING CHANGE" and when you release it will publish a major version.')}`
  })
}

let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
  initialValue: true,
  message: `Do you want to create the commit with the following message?
    
        ${colors.green(colors.bold(commit))}

        ${colors.cyan('Do you confirm?')}
    `
})

if (!shouldContinue) { handleExit({ message: 'The commit was not created!' }) }

await gitCommit({ commit })

outro(
  colors.green('✓ Commit created successfully!')
)
