import type { OptsFlag, Opts } from './types'

import * as t from 'io-ts'
import { option } from 'io-ts-types'

const yoltOptsFlag: t.Type<OptsFlag> = t.type ({
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
    flags: t.readonlyArray (yoltOptsFlag),
    args: t.readonlyArray (t.string),
    subcommands: t.readonlyArray (yoltOpts),
  }),
)
