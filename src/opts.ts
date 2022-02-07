import type { YoltFlag, YoltOpts, Transformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'
import { createFlag } from './flag'

const concatOpts = (x: YoltOpts) => (y: YoltOpts): YoltOpts =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    about: concatStrOption (x.about, y.about),
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
    about: none,
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

const about = (abt: string) => (opts: YoltOpts): YoltOpts =>
  ({
    ...opts,
    about: some (abt),
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
  about,
  example,
  subcommand,
  flag,
  arg,
}
