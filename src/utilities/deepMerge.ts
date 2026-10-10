function isObject(item: unknown): item is Record<string, unknown> {
  return Boolean(item) && typeof item === 'object' && !Array.isArray(item)
}

export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Record<string, unknown>,
): T {
  const output: Record<string, unknown> = { ...target }

  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = target[key]
      output[key] =
        isObject(sourceValue) && isObject(targetValue)
          ? deepMerge(targetValue, sourceValue)
          : sourceValue
    }
  }

  return output as T
}
