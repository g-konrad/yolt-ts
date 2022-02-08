import type { Flag, Transformer } from './types'

import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'
import { none, some } from 'fp-ts/lib/Option'

import { concatStrOption } from './utils'

const concatFlag = (x: Flag) => (y: Flag): Flag =>
  ({
    name: y.name,
    alias: concatStrOption (x.alias, y.alias),
    description: concatStrOption (x.description, y.description),
    fallback: y.fallback,
  })

const flagSemigroup: Semigroup<Flag> =
  {
    concat: (x, y) => concatFlag (x) (y),
  }

const { concat } = flagSemigroup

const mergeFlags = concatAll (flagSemigroup)

const createFlag = (name: string) => (...ts: ReadonlyArray<Transformer<Flag>>): Flag => {
  const initialFlag = {
    name: name,
    alias: none,
    description: none,
    fallback: none,
  }

  return mergeFlags (initialFlag) (ts.map ((t): Flag => t (initialFlag)))
}

const alias = (alias: string) => (flag: Flag): Flag =>
  ({
    ...flag,
    alias: some (alias),
  })

const fallback = (value: unknown) => (flag: Flag): Flag =>
  ({
    ...flag,
    fallback: some (value),
  })

export {
  createFlag,
  concat,
  alias,
  fallback,
}
