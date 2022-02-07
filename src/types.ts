import { Option } from 'fp-ts/lib/Option'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

type YoltErr = string

export type YoltArg = {
  readonly name: string
}

export type YoltBase = {
  readonly name: string
  readonly description: Option<string>
}
export type YoltFlag = YoltBase & {
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

export type YoltOpts = YoltBase & {
  readonly version: Option<string>
  readonly args: readonly string[]
  readonly examples: readonly string[]
  readonly flags: readonly YoltFlag[]
  readonly subcommands: readonly YoltOpts[]
}

export type Transformer<T> = (s: T) => T
export type YoltRunner = ReaderTaskEither<YoltOpts, YoltErr, void>
