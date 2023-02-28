import { trytm } from '@bdsqqq/try'
import { intro, outro, text, select, confirm, multiselect, isCancel } from '@clack/prompts'
import colors from 'picocolors'
import { COMMIT_TYPES } from './commit-types.js'
import { getChangedFiles, getStagedFiles, gitCommit, gitAdd } from './git.js'

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

intro(
    colors.inverse(`Asistente para la creación de commits por ${colors.yellow('@ivandev')}`)
)

if (errorChangedFiles ?? errorStagedFiles) {
    outro(colors.red('Error! Comprueba que tengas un repositorio de git.'))
    process.exit(1)
}
if (stagedFiles.length === 0 && changedFiles.length > 0) {
    const files = await multiselect({
        message: colors.cyan('No tienes nada preparado para hacer commit.'),
        options: changedFiles.map(file => ({
            value: file,
            label: file
        }))

    })

    if (isCancel(files)) {
        outro(colors.yellow('No has seleccionado ningún archivo para commitear.'))
        process.exit(0)
    }

    await gitAdd({ files })
}

const commitType = await select({
    message: 'Selecciona el tipo de commit',
    options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
        value: key,
        label: `${value.emoji} ${key.padEnd(20, ' ')} · ${value.description}`
    }))
})

if (isCancel(commitType)) {
    outro(colors.yellow('No has seleccionado tipo de commit.'))
    process.exit(0)
}

const commitMsg = await text({
    message: colors.cyan('Introduce el mensaje del commit:'),
    validate: (value) => {
        if (value.length === 0) {
            return 'El mensaje del commit no puede quedar vacio.'
        }

        if (value.length > 50) {
            return 'El mensaje del commit no puede tener más de 50 caracteres.'
        }
    }
})

if (isCancel(commitMsg)) {
    outro(colors.yellow('No has escrito el mensaje del commit.'))
    process.exit(0)
}

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange = false
if (release) {
    breakingChange = await confirm({
        initialValue: false,
        message: `Tiene este commit cambios que rompan la compatibilidad anterior?
        
    ${colors.yellow('Si la respuesta es sí, deberías crear un commit con el tipo "BREAKING CHANGE" y al hacer release se publicará una versión major.')}`
    })
}

let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [breaking change]` : commit

const shouldContinue = await confirm({
    initialValue: true,
    message: `¿Quieres crear el commit con el siguiente mensaje?
    
        ${colors.green(colors.bold(commit))}

        ${colors.cyan('¿Confirmas?')}
    `
})

if (!shouldContinue) {
    outro(colors.yellow('No se ha creado el commit!'))
    process.exit(0)
}

await gitCommit({ commit })

outro(
    colors.green('✓ Commit creado con éxito!')
)