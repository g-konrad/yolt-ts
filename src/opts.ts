import type { YoltFlag, YoltOpts, YoltBase, Transformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'
import { createFlag, alias, fallback } from './flag'

const concatOpts = (x: YoltOpts) => (y: YoltOpts): YoltOpts =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    description: concatStrOption (x.description, y.description),
    args: concatArray<string> (x.args) (y.args),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<YoltFlag> (x.flags) (y.flags),
    subcommands: concatArray<YoltOpts> (x.subcommands) (y.subcommands),
  })

const optsSemigroup: Semigroup<YoltOpts> =
  {
    concat: (x, y) => concatOpts (x) (y),
  }

const { concat } = optsSemigroup

const mergeOpts = concatAll (optsSemigroup)

const command = (name: string) => (...ts: ReadonlyArray<Transformer<YoltOpts>>): YoltOpts => {
  const initialOpts = {
    name,
    version: none,
    description: none,
    args: [],
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeOpts (initialOpts) (ts.map ((t): YoltOpts => t (initialOpts)))
}

const version = (v: string) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    version: some (v),
  })

const describe = (desc: string) => <T extends YoltBase>(opts: T): T =>
  ({
    ...opts,
    description: some (desc),
  })

const example = (ex: string) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    examples: [ex],
  })

const subcommand = (subopts: YoltOpts) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    subcommands: [subopts],
  })

const arg = (a: string) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    args: [a],
  })

const flag = (name: string) => (...ts: ReadonlyArray<Transformer<YoltFlag>>) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    flags: [createFlag (name) (...ts)],
  })

export {
  command,
  concat,
  version,
  describe,
  example,
  subcommand,
  flag,
  alias,
  fallback,
  arg,
}
