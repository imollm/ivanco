import { outro } from "@clack/prompts";
import colors from "picocolors";

export function handleExit({ code = 0, message = 'Commit hasn\'t been created.'} = {}) {
    outro(colors.yellow(message))
    process.exit(code)
}