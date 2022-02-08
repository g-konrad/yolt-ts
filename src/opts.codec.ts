import type { Flag, Opts } from './types'

import * as t from 'io-ts'
import { option } from 'io-ts-types'

const yoltFlag: t.Type<Flag> = t.type ({
  name: t.string,
  alias: option (t.string),
  description: option (t.string),
  fallback: option (t.unknown),
})

const yoltOpts: t.Type<Opts> = t.recursion ('Opts', () =>
  t.type ({
    name: t.string,
    version: option (t.string),
    description: option (t.string),
    examples: t.readonlyArray (t.string),
    flags: t.readonlyArray (yoltFlag),
    args: t.readonlyArray (t.string),
    subcommands: t.readonlyArray (yoltOpts),
  }),
)
