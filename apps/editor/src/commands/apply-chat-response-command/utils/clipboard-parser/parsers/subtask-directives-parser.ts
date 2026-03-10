export interface SubtaskDirectives {
  files_to_load: string[]
  next_prompt: string | null
  cleaned_response: string
}

export const extract_subtask_directives = (
  response: string
): SubtaskDirectives => {
  let cleaned_response = response
  const files_to_load: string[] = []
  let next_prompt: string | null = null

  // Erlaubt auch Tags mit Attributen sowie umschließende Markdown-Codeblöcke
  const loadFilesRegex =
    /(?:```[a-z]*\n)?<LOAD_FILES[^>]*>\s*([\s\S]*?)\s*<\/LOAD_FILES>(?:\n```)?/gi
  cleaned_response = cleaned_response.replace(
    loadFilesRegex,
    (match, content) => {
      const paths = content
        .split('\n')
        .map((p: string) => p.trim().replace(/^[`'"]+|[`'"]+$/g, ''))
        .filter((p: string) => p.length > 0)
      files_to_load.push(...paths)
      return ''
    }
  )

  const nextPromptRegex =
    /(?:```[a-z]*\n)?<NEXT_PROMPT[^>]*>\s*([\s\S]*?)\s*<\/NEXT_PROMPT>(?:\n```)?/gi
  cleaned_response = cleaned_response.replace(
    nextPromptRegex,
    (match, content) => {
      if (!next_prompt) {
        next_prompt = content.trim()
      } else {
        next_prompt += '\n\n' + content.trim()
      }
      return ''
    }
  )

  return {
    files_to_load,
    next_prompt,
    cleaned_response
  }
}
