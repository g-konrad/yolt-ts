import { Option } from 'fp-ts/lib/Option'

export type Base = {
  readonly name: string
  readonly description: Option<string>
}

export type OptsArg = {
  readonly _tag: 'OptsArg'
  readonly name: string
}
export type OptsFlag = Base & {
  readonly _tag: 'OptsFlag'
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

export type Opts = Base & {
  readonly _tag: 'Opts'
  readonly version: Option<string>
  readonly examples: readonly string[]
  readonly args: readonly OptsArg[]
  readonly flags: readonly OptsFlag[]
  readonly subcommands: readonly Opts[]
}

export type Transformer<T> = (s: T) => T
