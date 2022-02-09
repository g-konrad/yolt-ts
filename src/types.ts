import { Option } from 'fp-ts/lib/Option'

export type Base = {
  readonly name: string
  readonly description: Option<string>
}

export type ConfigArg = {
  readonly _tag: 'ConfigArg'
  readonly name: string
}
export type ConfigFlag = Base & {
  readonly _tag: 'ConfigFlag'
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

export type Config = Base & {
  readonly _tag: 'Config'
  readonly version: Option<string>
  readonly examples: readonly string[]
  readonly args: readonly ConfigArg[]
  readonly flags: readonly ConfigFlag[]
  readonly subcommands: readonly Config[]
}

export type Transformer<T> = (s: T) => T
