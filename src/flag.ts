import type { OptsFlag, Transformer } from './types'

import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'
import { none, some } from 'fp-ts/lib/Option'

import { concatStrOption } from './utils'

const concatOptsFlag = (x: OptsFlag) => (y: OptsFlag): OptsFlag =>
  ({
    name: y.name,
    alias: concatStrOption (x.alias, y.alias),
    description: concatStrOption (x.description, y.description),
    fallback: y.fallback,
  })

const flagSemigroup: Semigroup<OptsFlag> =
  {
    concat: (x, y) => concatOptsFlag (x) (y),
  }

const { concat } = flagSemigroup

const mergeOptsFlags = concatAll (flagSemigroup)

const createOptsFlag = (name: string) => (...ts: ReadonlyArray<Transformer<OptsFlag>>): OptsFlag => {
  const initialOptsFlag = {
    name: name,
    alias: none,
    description: none,
    fallback: none,
  }

  return mergeOptsFlags (initialOptsFlag) (ts.map ((t): OptsFlag => t (initialOptsFlag)))
}

const alias = (alias: string) => (flag: OptsFlag): OptsFlag =>
  ({
    ...flag,
    alias: some (alias),
  })

const fallback = (value: unknown) => (flag: OptsFlag): OptsFlag =>
  ({
    ...flag,
    fallback: some (value),
  })

export {
  createOptsFlag,
  concat,
  alias,
  fallback,
}
