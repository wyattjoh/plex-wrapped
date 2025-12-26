const DEBUG_ENABLED = process.env.DEBUG_WRAPPED === "true"

export function debug(category: string, message: string, data?: unknown): void {
  if (!DEBUG_ENABLED) {
    return
  }

  const prefix = `[DEBUG:${category}]`

  if (data !== undefined) {
    console.log(prefix, message, JSON.stringify(data, null, 2))
  } else {
    console.log(prefix, message)
  }
}

export function debugTable(
  category: string,
  message: string,
  rows: Array<Record<string, unknown>>
): void {
  if (!DEBUG_ENABLED) {
    return
  }

  console.log(`[DEBUG:${category}] ${message}`)
  if (rows.length > 0) {
    console.table(rows)
  } else {
    console.log("  (empty)")
  }
}
