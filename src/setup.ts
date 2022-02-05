import type { YoltEnv } from './types'

declare function alias (short: string, long: string): YoltEnv
declare function example (e: string): YoltEnv
declare function describe (d: string): YoltEnv
declare function version (v: string): YoltEnv
declare function name (n: string): YoltEnv
declare function command
