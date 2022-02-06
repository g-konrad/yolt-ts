import type { YoltFlag, YoltSettings } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'

const concatSettings = (x: YoltSettings, y: YoltSettings): YoltSettings =>
  ({
    name: concatStrOption (x.name, y.name),
    version: concatStrOption (x.version, y.version),
    about: concatStrOption (x.about, y.about),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<YoltFlag> (x.flags) (y.flags),
    subcommands: concatArray<YoltSettings> (x.subcommands) (y.subcommands)
  })

const settingsSemigroup: Semigroup<YoltSettings> =
  {
    concat: concatSettings
  }

const intoSettings = concatAll (settingsSemigroup)

const createCommand = (name: string): ((sets: readonly YoltSettings[]) => YoltSettings) =>
  intoSettings ({
    name: some (name),
    version: none,
    about: none,
    examples: [],
    flags: [],
    subcommands: []
  })

const version = (version: string): YoltSettings =>
  ({
    name: none,
    version: some (version),
    about: none,
    examples: [],
    flags: [],
    subcommands: []
  })

const about = (about: string): YoltSettings =>
  ({
    name: none,
    version: none,
    about: some (about),
    examples: [],
    flags: [],
    subcommands: []
  })

const example = (example: string): YoltSettings =>
  ({
    name: none,
    version: none,
    about: none,
    examples: [example],
    flags: [],
    subcommands: []
  })

const subcommand = (settings: YoltSettings): YoltSettings =>
  ({
    name: none,
    version: none,
    about: none,
    examples: [],
    flags: [],
    subcommands: [
      settings
    ]
  })

export {
  createCommand,
  version,
  about,
  example,
  subcommand
}
