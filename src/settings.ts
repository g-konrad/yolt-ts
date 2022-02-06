import type { YoltFlag, YoltSettings, YoltSettingsTransformer } from './types'

import { concat as concatArray } from 'fp-ts/lib/ReadonlyArray'
import { none, some } from 'fp-ts/lib/Option'
import { concatAll, Semigroup } from 'fp-ts/lib/Semigroup'

import { concatStrOption } from './utils'

const concatSettings = (x: YoltSettings) => (y: YoltSettings): YoltSettings =>
  ({
    name: x.name,
    version: concatStrOption (x.version, y.version),
    about: concatStrOption (x.about, y.about),
    examples: concatArray<string> (x.examples) (y.examples),
    flags: concatArray<YoltFlag> (x.flags) (y.flags),
    subcommands: concatArray<YoltSettings> (x.subcommands) (y.subcommands),
  })

const settingsSemigroup: Semigroup<YoltSettings> =
  {
    concat: (x, y) => concatSettings (x) (y),
  }

const mergeSettings = concatAll (settingsSemigroup)

const createCommand = (name: string) => (...ts: readonly YoltSettingsTransformer[]): YoltSettings => {
  const initialSetting = {
    name,
    version: none,
    about: none,
    examples: [],
    flags: [],
    subcommands: [],
  }

  return mergeSettings (initialSetting) (ts.map ((t) => t (initialSetting)))
}

const version = (version: string) => (settings: YoltSettings): YoltSettings =>
  ({
    ...settings,
    version: some (version),
  })

const about = (about: string) => (settings: YoltSettings): YoltSettings =>
  ({
    ...settings,
    about: some (about),
  })

const example = (example: string) => (settings: YoltSettings): YoltSettings =>
  ({
    ...settings,
    examples: [example],
  })

const subcommand = (subcommand: YoltSettings) => (settings: YoltSettings): YoltSettings =>
  ({
    ...settings,
    subcommands: [subcommand],
  })

export {
  createCommand,
  version,
  about,
  example,
  subcommand,
  settingsSemigroup,
}
