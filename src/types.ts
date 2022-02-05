import { Option } from 'fp-ts/lib/Option'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'
import { ReadonlyRecord } from 'fp-ts/lib/ReadonlyRecord'

type YoltErr = string

type YoltOption = {
  readonly alias: Option<string>
  readonly description: Option<string>
  readonly default: Option<string>
}

type YoltOptions = ReadonlyRecord<string, YoltOption>

type BaseEnv = {
  readonly name: string
  readonly version: string
  readonly description: string
  readonly examples: readonly [string]
  readonly options: YoltOptions
}

export type YoltCommand = BaseEnv

export type YoltEnv = BaseEnv & { readonly commands: readonly [YoltCommand] }

export type Yolt = ReaderTaskEither<YoltEnv, YoltErr, void>
