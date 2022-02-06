import type { YoltFlag, Transformer } from './types'

import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'
import { none, some } from 'fp-ts/lib/Option'

import { concatStrOption } from './utils'

const concatFlag = (x: YoltFlag) => (y: YoltFlag): YoltFlag =>
  ({
    name: y.name,
    alias: concatStrOption (x.alias, y.alias),
    description: concatStrOption (x.description, y.description),
    fallback: y.fallback,
  })

const flagSemigroup: Semigroup<YoltFlag> =
  {
    concat: (x, y) => concatFlag (x) (y),
  }

const { concat } = flagSemigroup

const mergeFlags = concatAll (flagSemigroup)

const createFlag = (name: string) => (...ts: ReadonlyArray<Transformer<YoltFlag>>): YoltFlag => {
  const initialFlag = {
    name: name,
    alias: none,
    description: none,
    fallback: none,
  }

  return mergeFlags (initialFlag) (ts.map ((t): YoltFlag => t (initialFlag)))
}

const alias = (alias: string) => (flag: YoltFlag): YoltFlag =>
  ({
    ...flag,
    alias: some (alias),
  })

const description = (description: string) => (flag: YoltFlag): YoltFlag =>
  ({
    ...flag,
    description: some (description),
  })

const fallback = (value: unknown) => (flag: YoltFlag): YoltFlag =>
  ({
    ...flag,
    fallback: some (value),
  })

export {
  createFlag,
  concat,
  alias,
  description,
  fallback,
}
