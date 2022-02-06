import { Option } from 'fp-ts/lib/Option'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

type YoltErr = string

export type YoltFlag = {
  readonly name: string
  readonly alias: Option<string>
  readonly description: Option<string>
  readonly fallback: Option<unknown>
}

export type YoltSettings = {
  readonly name: string
  readonly version: Option<string>
  readonly about: Option<string>
  readonly examples: readonly string[]
  readonly flags: readonly YoltFlag[]
  readonly subcommands: readonly YoltSettings[]
}

export type YoltSettingsTransformer = (s: YoltSettings) => YoltSettings

export type YoltRunner = ReaderTaskEither<YoltSettings, YoltErr, void>
