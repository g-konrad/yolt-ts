import type { YoltFlag, YoltCommand } from './types'

import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'
import { none, some } from 'fp-ts/lib/Option'

import { concatStrOption } from './utils'

const concatFlag = (x: YoltFlag, y: YoltFlag): YoltFlag =>
  ({
    name: y.name,
    alias: concatStrOption (x.alias, y.alias),
    description: concatStrOption (x.description, y.description),
    fallback: y.fallback
  })

const flagSemigroup: Semigroup<YoltFlag> =
  {
    concat: concatFlag
  }

const intoFlag = concatAll (flagSemigroup)

const flag = (name: string) => (opts: readonly YoltFlag[]): YoltCommand =>
  ({
    name: none,
    version: none,
    about: none,
    examples: [],
    flags: [
      intoFlag ({
        name: some (name),
        alias: none,
        description: none,
        fallback: none
      }) (opts)
    ],
    subcommands: []
  })

const alias = (alias: string): YoltFlag =>
  ({
    name: none,
    alias: some (alias),
    description: none,
    fallback: none
  })

const description = (description: string): YoltFlag =>
  ({
    name: none,
    alias: none,
    description: some (description),
    fallback: none
  })

const fallback = (value: unknown): YoltFlag =>
  ({
    name: none,
    alias: none,
    description: none,
    fallback: some (value)
  })

export {
  flag,
  alias,
  description,
  fallback
}
