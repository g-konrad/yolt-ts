import type { YoltFlag, YoltCommand, Transformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'

const concatCommand = (x: YoltCommand) => (y: YoltCommand): YoltCommand =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    about: concatStrOption (x.about, y.about),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<YoltFlag> (x.flags) (y.flags),
    subcommands: concatArray<YoltCommand> (x.subcommands) (y.subcommands),
  })

const commandSemigroup: Semigroup<YoltCommand> =
  {
    concat: (x, y) => concatCommand (x) (y),
  }

const mergeCommand = concatAll (commandSemigroup)

const createCommand = (name: string) => (...ts: ReadonlyArray<Transformer<YoltCommand>>): YoltCommand => {
  const initialSetting = {
    name,
    version: none,
    about: none,
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeCommand (initialSetting) (ts.map ((t): YoltCommand => t (initialSetting)))
}

const version = (version: string) => (command: YoltCommand): YoltCommand =>
  ({
    ...command,
    version: some (version),
  })

const about = (about: string) => (command: YoltCommand): YoltCommand =>
  ({
    ...command,
    about: some (about),
  })

const example = (example: string) => (command: YoltCommand): YoltCommand =>
  ({
    ...command,
    examples: [example],
  })

const subcommand = (subcommand: YoltCommand) => (command: YoltCommand): YoltCommand =>
  ({
    ...command,
    subcommands: [subcommand],
  })

const flag = (flag: YoltFlag) => (command: YoltCommand): YoltCommand =>
  ({
    ...command,
    flags: [flag],
  })

export {
  commandSemigroup,
  createCommand,
  version,
  about,
  example,
  subcommand,
  flag,
}
