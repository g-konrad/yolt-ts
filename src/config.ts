import { Monoid, struct } from 'fp-ts/lib/Monoid'
import { getMonoid as getReadonlyArrayMonoid, reduceRight } from 'fp-ts/lib/ReadonlyArray'
import { Option, some, getMonoid as getOptionMonoid } from 'fp-ts/lib/Option'
import { last } from 'fp-ts/lib/Semigroup'
import { getComonad, Traced } from 'fp-ts/lib/Traced'

/**
 * @category model
 * @since 0.1.0
 */
interface ConfigArg {
  readonly name: string
  readonly description: Option<string>
}

/**
 * @category model
 * @since 0.1.0
 */
interface ConfigFlag {
  readonly name: string
  readonly description: Option<string>
  readonly alias: Option<string>
  readonly fallback: Option<unknown>
}

/**
 * @category model
 * @since 0.1.0
 */
interface Settings {
  readonly name: string
  readonly description: Option<string>
  readonly version: Option<string>
  readonly examples: readonly string[]
  readonly args: readonly ConfigArg[]
  readonly flags: readonly ConfigFlag[]
  readonly subcommands: readonly Config[]
}

/**
 * @category model
 * @since 0.1.0
 */
interface Config {
  readonly description: Option<string>
  readonly version: Option<string>
  readonly examples: readonly string[]
  readonly args: readonly ConfigArg[]
  readonly flags: readonly ConfigFlag[]
  readonly subcommands: readonly Config[]
}

/**
 * @category model
 * @since 0.1.0
 */
type ConfigBuilder = Traced<Config, Settings>

type ConfigBuilderBuilder = (cb: ConfigBuilder) => ConfigBuilder

const monoidConfig: Monoid<Config> = struct<Config> ({
  version: getOptionMonoid (last ()),
  description: getOptionMonoid (last ()),
  args: getReadonlyArrayMonoid<ConfigArg> (),
  examples: getReadonlyArrayMonoid<string> (),
  flags: getReadonlyArrayMonoid<ConfigFlag> (),
  subcommands: getReadonlyArrayMonoid<Config> (),
})

const C = getComonad<Config> (monoidConfig)

const resolveSettings: ((cb: ConfigBuilder) => Settings) = C.extract

/**
 * @category constructors
 * @since 0.1.0
 */
const build = (name: string): ConfigBuilder => (config) =>
  ({
    ...config,
    name,
  })

export const command = (name: string) => (...bs: readonly ConfigBuilderBuilder[]): Settings =>
  resolveSettings (
    reduceRight<ConfigBuilderBuilder, ConfigBuilder> (
      build (name),
      (bb, builder) => bb (builder),
    ) (bs),
  )

export const version = (v: string) => (wa: ConfigBuilder): ConfigBuilder =>
  C.extend (wa, (builder) =>
    builder ({
      ...monoidConfig.empty,
      version: some (v),
    }),
  )

export const describe = (desc: string) => (wa: ConfigBuilder): ConfigBuilder =>
  C.extend (wa, (builder) =>
    builder ({
      ...monoidConfig.empty,
      description: some (desc),
    }),
  )

export const example = (ex: string) => (wa: ConfigBuilder): ConfigBuilder =>
  C.extend (wa, (builder) =>
    builder ({
      ...monoidConfig.empty,
      examples: [ex],
    }),
  )

export const subcommand = (subconfig: Config) => (wa: ConfigBuilder): ConfigBuilder =>
  C.extend (wa, (builder) =>
    builder ({
      ...monoidConfig.empty,
      subcommands: [subconfig],
    }),
  )
