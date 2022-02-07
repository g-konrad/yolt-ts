import type { YoltFlag, YoltCommand, Transformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'
import { createFlag } from './flag'

const concatCommand = (x: YoltCommand) => (y: YoltCommand): YoltCommand =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    about: concatStrOption (x.about, y.about),
    args: concatArray<string> (x.args) (y.args),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<YoltFlag> (x.flags) (y.flags),
    subcommands: concatArray<YoltCommand> (x.subcommands) (y.subcommands),
  })

const commandSemigroup: Semigroup<YoltCommand> =
  {
    concat: (x, y) => concatCommand (x) (y),
  }

const { concat } = commandSemigroup

const mergeCommand = concatAll (commandSemigroup)

const command = (name: string) => (...ts: ReadonlyArray<Transformer<YoltCommand>>): YoltCommand => {
  const initialSetting = {
    name,
    version: none,
    about: none,
    args: [],
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeCommand (initialSetting) (ts.map ((t): YoltCommand => t (initialSetting)))
}

const version = (v: string) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
    version: some (v),
  })

const about = (abt: string) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
    about: some (abt),
  })

const example = (ex: string) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
    examples: [ex],
  })

const subcommand = (subcmd: YoltCommand) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
    subcommands: [subcmd],
  })

const arg = (a: string) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
    args: [a],
  })

const flag = (name: string) => (...ts: ReadonlyArray<Transformer<YoltFlag>>) => (cmd: YoltCommand): YoltCommand =>
  ({
    ...cmd,
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
