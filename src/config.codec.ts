import type { ConfigFlag, Config } from './types'

import * as t from 'io-ts'
import { option } from 'io-ts-types'

const yoltConfigFlag: t.Type<ConfigFlag> = t.type ({
  name: t.string,
  alias: option (t.string),
  description: option (t.string),
  fallback: option (t.unknown),
})

const yoltConfig: t.Type<Config> = t.recursion ('Config', () =>
  t.type ({
    name: t.string,
    version: option (t.string),
    description: option (t.string),
    examples: t.readonlyArray (t.string),
    flags: t.readonlyArray (yoltConfigFlag),
    args: t.readonlyArray (t.string),
    subcommands: t.readonlyArray (yoltConfig),
  }),
)
