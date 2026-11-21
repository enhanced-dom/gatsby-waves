export function fromEntries<K extends string | number | symbol, V>(pairs: [K, V][]) {
  const result = {} as Record<K, V>

  pairs?.forEach(([key, value]) => {
    result[key] = value
  })

  return result
}

export function toEntries<K extends string | number | symbol, V>(o: Record<K, V>): [K, V][] {
  const keys = Object.keys(o) as K[]
  return keys.map((k) => [k, o[k]])
}
