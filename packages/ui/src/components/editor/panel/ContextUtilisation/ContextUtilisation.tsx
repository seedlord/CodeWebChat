import styles from './ContextUtilisation.module.scss'
import cn from 'classnames'

type Props = {
  current_context_size: number
  context_size_warning_threshold: number
  is_context_disabled?: boolean
  is_calculating_tokens?: boolean
}

const format_tokens = (tokens: number): string => {
  if (tokens < 1000) {
    return tokens.toString()
  }
  const k = Math.floor(tokens / 1000)
  return k.toString() + 'K'
}

export const ContextUtilisation: React.FC<Props> = (props) => {
  if (props.is_context_disabled) {
    return (
      <div className={styles.container}>
        <div className={styles.bar} />
        <span className={styles.label} style={{ fontStyle: 'italic' }}>
          Context disabled
        </span>
      </div>
    )
  }

  const is_above_threshold =
    props.current_context_size > props.context_size_warning_threshold
  const progress = Math.min(
    (props.current_context_size / props.context_size_warning_threshold) * 100,
    100
  )

  const formatted_current_size = format_tokens(props.current_context_size)
  const formatted_threshold = format_tokens(
    props.context_size_warning_threshold
  )

  let title_text = ''

  if (!is_above_threshold) {
    const remaining_tokens =
      props.context_size_warning_threshold -
      (props.current_context_size < 1000
        ? props.current_context_size
        : Math.floor(props.current_context_size / 1000) * 1000)
    const formatted_remaining_tokens = format_tokens(remaining_tokens)
    title_text = `${formatted_remaining_tokens} tokens remaining until threshold warning (change in settings)`
  } else {
    const exceeded_by =
      props.current_context_size - props.context_size_warning_threshold
    const formatted_exceeded_by = format_tokens(exceeded_by)
    title_text = `Threshold of ${formatted_threshold} tokens is exceeded by ${formatted_exceeded_by} tokens`
  }

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        <div
          className={cn(styles.bar__progress, {
            [styles['bar__progress--warning']]: is_above_threshold
          })}
          style={{
            width: props.is_calculating_tokens ? '100%' : `${progress}%`,
            opacity: props.is_calculating_tokens ? 0.5 : 1,
            transition: props.is_calculating_tokens
              ? 'opacity 0.5s ease-in-out'
              : 'width 0.3s ease'
          }}
        />
      </div>
      <span
        className={styles.label}
        title={
          props.is_calculating_tokens ? 'Recounting tokens...' : title_text
        }
      >
        {props.is_calculating_tokens
          ? 'Recounting tokens...'
          : `${formatted_current_size} tokens in context`}
      </span>
    </div>
  )
}
