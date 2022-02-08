import { Option } from 'fp-ts/lib/Option'
import { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither'

type Err = string

export type Arg = {
  readonly name: string
}

export type Base = {
  readonly name: string
  readonly description: Option<string>
}
export type Flag = Base & {
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

export type Opts = Base & {
  readonly version: Option<string>
  readonly args: readonly string[]
  readonly examples: readonly string[]
  readonly flags: readonly Flag[]
  readonly subcommands: readonly Opts[]
}

export type Transformer<T> = (s: T) => T
export type Runner = ReaderTaskEither<Opts, Err, void>
