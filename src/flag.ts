import type { ConfigFlag, Transformer } from './types'

import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'
import { none, some } from 'fp-ts/lib/Option'

import { concatStrOption } from './utils'

const concatConfigFlag = (x: ConfigFlag) => (y: ConfigFlag): ConfigFlag =>
  ({
    name: y.name,
    alias: concatStrOption (x.alias, y.alias),
    description: concatStrOption (x.description, y.description),
    fallback: y.fallback,
  })

const flagSemigroup: Semigroup<ConfigFlag> =
  {
    concat: (x, y) => concatConfigFlag (x) (y),
  }

const { concat } = flagSemigroup

const mergeConfigFlags = concatAll (flagSemigroup)

const createConfigFlag = (name: string) => (...ts: ReadonlyArray<Transformer<ConfigFlag>>): ConfigFlag => {
  const initialConfigFlag = {
    name: name,
    alias: none,
    description: none,
    fallback: none,
  }

  return mergeConfigFlags (initialConfigFlag) (ts.map ((t): ConfigFlag => t (initialConfigFlag)))
}

const alias = (alias: string) => (flag: ConfigFlag): ConfigFlag =>
  ({
    ...flag,
    alias: some (alias),
  })

const fallback = (value: unknown) => (flag: ConfigFlag): ConfigFlag =>
  ({
    ...flag,
    fallback: some (value),
  })

export {
  createConfigFlag,
  concat,
  alias,
  fallback,
}
