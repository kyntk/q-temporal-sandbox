export const chunk = <T extends any[]>(array: T, size: number): T[] =>
  array.reduce(
    (chunkedArray, _, i) =>
      i % size ? chunkedArray : [...chunkedArray, array.slice(i, i + size)],
    [] as T[][]
  )
