import { Option } from 'fp-ts/lib/Option'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

type YoltErr = string

export type YoltArg = {
  readonly name: string
}
export type YoltFlag = {
  readonly name: string
  readonly alias: Option<string>
  readonly description: Option<string>
  readonly fallback: Option<unknown>
}

export type YoltCommand = {
  readonly name: string
  readonly version: Option<string>
  readonly about: Option<string>
  readonly args: readonly string[]
  readonly examples: readonly string[]
  readonly flags: readonly YoltFlag[]
  readonly subcommands: readonly YoltCommand[]
}

export type Transformer<T> = (s: T) => T
export type YoltRunner = ReaderTaskEither<YoltCommand, YoltErr, void>
