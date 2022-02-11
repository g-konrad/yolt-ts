import { concatAll, Monoid, struct } from 'fp-ts/lib/Monoid'
import { getMonoid as getReadonlyArrayMonoid } from 'fp-ts/lib/ReadonlyArray'
import { Option, some, getMonoid as getOptionMonoid } from 'fp-ts/lib/Option'
import { last } from 'fp-ts/lib/Semigroup'
import { identity, pipe } from 'fp-ts/lib/function'

type Named = {
  readonly name: string
}

type Describable = {
  readonly description: Option<string>
}

/**
 * @category model
 * @since 0.1.0
 */
type ConfigArg = Named & Describable

/**
 * @category model
 * @since 0.1.0
 */
type ConfigFlag = Named & Describable & {
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

/**
 * @category model
 * @since 0.1.0
 */
type Config = Named & Describable & {
  readonly version: Option<string>
  readonly examples: readonly string[]
  readonly args: readonly ConfigArg[]
  readonly flags: readonly ConfigFlag[]
  readonly subcommands: readonly Config[]
}

type Builder<T> = (x: T) => T

const lastStringMonoid: Monoid<string> = {
  ...last<string> (),
  empty: '',
}

const configMonoid: Monoid<Config> = struct<Config> ({
  name: lastStringMonoid,
  version: getOptionMonoid (last ()),
  description: getOptionMonoid (last ()),
  args: getReadonlyArrayMonoid<ConfigArg> (),
  examples: getReadonlyArrayMonoid<string> (),
  flags: getReadonlyArrayMonoid<ConfigFlag> (),
  subcommands: getReadonlyArrayMonoid<Config> (),
})

const configFlagMonoid: Monoid<ConfigFlag> = struct<ConfigFlag> ({
  name: lastStringMonoid,
  description: getOptionMonoid (last ()),
  alias: getOptionMonoid (last ()),
  fallback: getOptionMonoid (last ()),
})

const configArgMonoid: Monoid<ConfigArg> = struct<ConfigArg> ({
  name: lastStringMonoid,
  description: getOptionMonoid (last ()),
})

const getBuilderMonoid = <T>(mn: Monoid<T>): Monoid<Builder<T>> =>
  ({
    empty: identity,
    concat: (x, y) => (config) => mn.concat (x (config), y (config)),
  })

const configBuilderMonoid: Monoid<Builder<Config>> = getBuilderMonoid (configMonoid)

const configFlagBuilderMonoid: Monoid<Builder<ConfigFlag>> = getBuilderMonoid (configFlagMonoid)

const configArgBuilderMonoid: Monoid<Builder<ConfigArg>> = getBuilderMonoid (configArgMonoid)

const named = <T>(mn: Monoid<T>) => (name: string): T =>
  ({
    ...mn.empty,
    name,
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const version = (v: string): Builder<Config> => (config) =>
  ({
    ...config,
    version: some (v),
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const describe = <T extends Describable>(desc: string): Builder<T> => (config) =>
  ({
    ...config,
    description: some (desc),
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const example = (ex: string): Builder<Config> => (config) =>
  ({
    ...config,
    examples: [ex],
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const subcommand = (subconfig: Config): Builder<Config> => (config) =>
  ({
    ...config,
    subcommands: [subconfig],
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const alias = (alias: string): Builder<ConfigFlag> => (flag) =>
  ({
    ...flag,
    alias: some (alias),
  })

/**
 * @category builders
 * @since 0.1.0
 */
export const fallback = (value: unknown): Builder<ConfigFlag> => (flag) =>
  ({
    ...flag,
    fallback: some (value),
  })

/**
 * @category constructors
 * @since 0.1.0
 */
export const command = (name: string) => (...builders: ReadonlyArray<Builder<Config>>): Config =>
  pipe (
    named (configMonoid) (name),
    concatAll (configBuilderMonoid) (builders),
  )

/**
 * @category constructors
 * @since 0.1.0
 */
export const flag = (name: string) => (...builders: ReadonlyArray<Builder<ConfigFlag>>): ConfigFlag =>
  pipe (
    named (configFlagMonoid) (name),
    concatAll (configFlagBuilderMonoid) (builders),
  )

/**
 * @category constructors
 * @since 0.1.0
 */
export const arg = (name: string) => (...builders: ReadonlyArray<Builder<ConfigArg>>): ConfigArg =>
  pipe (
    named (configArgMonoid) (name),
    concatAll (configArgBuilderMonoid) (builders),
  )
