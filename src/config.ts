/**
 * @since 0.1.0
 */
import { concatAll, Monoid, struct } from 'fp-ts/lib/Monoid'
import { getMonoid as getReadonlyArrayMonoid } from 'fp-ts/lib/ReadonlyArray'
import { Option, some, getMonoid as getOptionMonoid } from 'fp-ts/lib/Option'
import { last } from 'fp-ts/lib/Semigroup'
import { identity, pipe } from 'fp-ts/lib/function'

/**
 * @category internal
 * @since 0.1.0
 */
type Named = {
  readonly name: string
}

/**
 * @category internal
 * @since 0.1.0
 */
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

/**
 * @category internal
 * @since 0.1.0
 */
type Builder<T> = (x: T) => T

/**
 * @category internal
 * @since 0.1.0
 */
const lastStringMonoid: Monoid<string> = {
  ...last<string> (),
  empty: '',
}

/**
 * @category internal
 * @since 0.1.0
 */
const configMonoid: Monoid<Config> = struct<Config> ({
  name: lastStringMonoid,
  version: getOptionMonoid (last ()),
  description: getOptionMonoid (last ()),
  args: getReadonlyArrayMonoid<ConfigArg> (),
  examples: getReadonlyArrayMonoid<string> (),
  flags: getReadonlyArrayMonoid<ConfigFlag> (),
  subcommands: getReadonlyArrayMonoid<Config> (),
})

/**
 * @category internal
 * @since 0.1.0
 */
const configFlagMonoid: Monoid<ConfigFlag> = struct<ConfigFlag> ({
  name: lastStringMonoid,
  description: getOptionMonoid (last ()),
  alias: getOptionMonoid (last ()),
  fallback: getOptionMonoid (last ()),
})

/**
 * @category internal
 * @since 0.1.0
 */
const configArgMonoid: Monoid<ConfigArg> = struct<ConfigArg> ({
  name: lastStringMonoid,
  description: getOptionMonoid (last ()),
})

/**
 * @category internal
 * @since 0.1.0
 */
const getBuilderMonoid = <T>(m: Monoid<T>): Monoid<Builder<T>> =>
  ({
    empty: identity,
    concat: (x, y) => (z) => m.concat (x (z), y (z)),
  })

/**
 * @category internal
 * @since 0.1.0
 */
const configBuilderMonoid: Monoid<Builder<Config>> = getBuilderMonoid (configMonoid)

/**
 * @category internal
 * @since 0.1.0
 */
const configFlagBuilderMonoid: Monoid<Builder<ConfigFlag>> = getBuilderMonoid (configFlagMonoid)

/**
 * @category internal
 * @since 0.1.0
 */
const configArgBuilderMonoid: Monoid<Builder<ConfigArg>> = getBuilderMonoid (configArgMonoid)

/**
 * @category internal
 * @since 0.1.0
 */
const named = <T>(m: Monoid<T>) => (name: string): T =>
  ({
    ...m.empty,
    name,
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const version = (v: string): Builder<Config> => (config) =>
  ({
    ...config,
    version: some (v),
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const describe = <T extends Describable>(desc: string): Builder<T> => (config) =>
  ({
    ...config,
    description: some (desc),
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const example = (ex: string): Builder<Config> => (config) =>
  ({
    ...config,
    examples: [ex],
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const subcommand = (subconfig: Config): Builder<Config> => (config) =>
  ({
    ...config,
    subcommands: [subconfig],
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const alias = (alias: string): Builder<ConfigFlag> => (flag) =>
  ({
    ...flag,
    alias: some (alias),
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const fallback = (value: unknown): Builder<ConfigFlag> => (flag) =>
  ({
    ...flag,
    fallback: some (value),
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const flag = (name: string) => (...combinators: ReadonlyArray<Builder<ConfigFlag>>): Builder<Config> => (config) =>
  ({
    ...config,
    flags: [
      pipe (
        named (configFlagMonoid) (name),
        concatAll (configFlagBuilderMonoid) (combinators),
      ),
    ],
  })

/**
 * @category combinators
 * @since 0.1.0
 */
export const arg = (name: string) => (...combinators: ReadonlyArray<Builder<ConfigArg>>): Builder<Config> => (config) =>
  ({
    ...config,
    args: [
      pipe (
        named (configArgMonoid) (name),
        concatAll (configArgBuilderMonoid) (combinators),
      ),
    ],
  })

/**
 * @category constructors
 * @since 0.1.0
 */
export const command = (name: string) => (...combinators: ReadonlyArray<Builder<Config>>): Config =>
  pipe (
    named (configMonoid) (name),
    concatAll (configBuilderMonoid) (combinators),
  )
