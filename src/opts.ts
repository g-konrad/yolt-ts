import type { OptsFlag, Opts, Base, Transformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'
import { createOptsFlag, alias, fallback } from './flag'

const concatOpts = (x: Opts) => (y: Opts): Opts =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    description: concatStrOption (x.description, y.description),
    args: concatArray<string> (x.args) (y.args),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<OptsFlag> (x.flags) (y.flags),
    subcommands: concatArray<Opts> (x.subcommands) (y.subcommands),
  })

const optsSemigroup: Semigroup<Opts> =
  {
    concat: (x, y) => concatOpts (x) (y),
  }

const { concat } = optsSemigroup

const mergeOpts = concatAll (optsSemigroup)

const command = (name: string) => (...ts: ReadonlyArray<Transformer<Opts>>): Opts => {
  const initialOpts = {
    name,
    version: none,
    description: none,
    args: [],
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeOpts (initialOpts) (ts.map ((t): Opts => t (initialOpts)))
}

const version = (v: string) => (opts: Opts): Opts =>
  ({
    ...opts,
    version: some (v),
  })

const describe = (desc: string) => <T extends Base>(opts: T): T =>
  ({
    ...opts,
    description: some (desc),
  })

const example = (ex: string) => (opts: Opts): Opts =>
  ({
    ...opts,
    examples: [ex],
  })

const subcommand = (subopts: Opts) => (opts: Opts): Opts =>
  ({
    ...opts,
    subcommands: [subopts],
  })

const arg = (a: string) => (opts: Opts): Opts =>
  ({
    ...opts,
    args: [a],
  })

const flag = (name: string) => (...ts: ReadonlyArray<Transformer<OptsFlag>>) => (opts: Opts): Opts =>
  ({
    ...opts,
    flags: [createOptsFlag (name) (...ts)],
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
