import type { YoltFlag, YoltCommand, YoltCommandTransformer } from './types'

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

const createCommand = (name: string) => (...ts: readonly YoltCommandTransformer[]): YoltCommand => {
  const initialSetting = {
    name,
    version: none,
    about: none,
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeCommand (initialSetting) (ts.map ((t) => t (initialSetting)))
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

export {
  createCommand,
  version,
  about,
  example,
  subcommand,
  commandSemigroup,
}
