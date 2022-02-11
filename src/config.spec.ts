import { some } from 'fp-ts/lib/Option'
import { command, describe as description, example, version, subcommand, flag, alias, fallback } from './config'

describe ('command', () => {
  const NAME = 'manager'
  const VERSION = '1.0.1'
  const ABOUT = 'Does stuff.'
  const EXAMPLE_ONE = 'manager build'
  const EXAMPLE_TWO = 'manager start'

  test ('name', () => {
    const config = command (NAME) ()

    expect (config).toHaveProperty ('name')
    expect (config.name).toStrictEqual (NAME)
  })

  test ('version', () => {
    const config = command (NAME) (
      version (VERSION),
    )

    expect (config).toHaveProperty ('version')
    expect (config.version).toStrictEqual (some (VERSION))
  })

  test ('description', () => {
    const config = command (NAME) (
      description (ABOUT),
    )

    expect (config).toHaveProperty ('description')
    expect (config.description).toStrictEqual (some (ABOUT))
  })

  test ('examples', () => {
    const config = command (NAME) (
      example (EXAMPLE_ONE),
      example (EXAMPLE_TWO),
    )

    expect (config).toHaveProperty ('examples')
    expect (config.examples).toContain (EXAMPLE_ONE)
    expect (config.examples).toContain (EXAMPLE_TWO)
  })

  test ('subcommands', () => {
    const SUBCOMMAND_ONE_NAME = 'subcommandOne'
    const SUBCOMMAND_ONE_VERSION = '0.5.3'
    const SUBCOMMAND_ONE_ABOUT = 'This is subcommand one'
    const SUBCOMMAND_ONE_EXAMPLE_ONE = 'subcommandOne go'
    const SUBCOMMAND_ONE_EXAMPLE_TWO = 'subcommandOne run'

    const subconfigOne = command (SUBCOMMAND_ONE_NAME) (
      version (SUBCOMMAND_ONE_VERSION),
      description (SUBCOMMAND_ONE_ABOUT),
      example (SUBCOMMAND_ONE_EXAMPLE_ONE),
      example (SUBCOMMAND_ONE_EXAMPLE_TWO),
    )
    expect (subconfigOne).toHaveProperty ('name')
    expect (subconfigOne).toHaveProperty ('version')
    expect (subconfigOne).toHaveProperty ('description')
    expect (subconfigOne).toHaveProperty ('examples')
    expect (subconfigOne.name).toStrictEqual (SUBCOMMAND_ONE_NAME)
    expect (subconfigOne.version).toStrictEqual (some (SUBCOMMAND_ONE_VERSION))
    expect (subconfigOne.description).toStrictEqual (some (SUBCOMMAND_ONE_ABOUT))
    expect (subconfigOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_ONE)
    expect (subconfigOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_TWO)

    const SUBCOMMAND_TWO_NAME = 'subcommandTwo'
    const SUBCOMMAND_TWO_VERSION = '3.6.1'
    const SUBCOMMAND_TWO_ABOUT = 'This is subcommand two'
    const SUBCOMMAND_TWO_EXAMPLE_ONE = 'subcommandTwo go'
    const SUBCOMMAND_TWO_EXAMPLE_TWO = 'subcommandTwo run'
    const subconfigTwo = command (SUBCOMMAND_TWO_NAME) (
      version (SUBCOMMAND_TWO_VERSION),
      description (SUBCOMMAND_TWO_ABOUT),
      example (SUBCOMMAND_TWO_EXAMPLE_ONE),
      example (SUBCOMMAND_TWO_EXAMPLE_TWO),
    )
    expect (subconfigTwo).toHaveProperty ('name')
    expect (subconfigTwo).toHaveProperty ('version')
    expect (subconfigTwo).toHaveProperty ('description')
    expect (subconfigTwo).toHaveProperty ('examples')
    expect (subconfigTwo.name).toStrictEqual (SUBCOMMAND_TWO_NAME)
    expect (subconfigTwo.version).toStrictEqual (some (SUBCOMMAND_TWO_VERSION))
    expect (subconfigTwo.description).toStrictEqual (some (SUBCOMMAND_TWO_ABOUT))
    expect (subconfigTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_ONE)
    expect (subconfigTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_TWO)

    const config = command (NAME) (
      version (VERSION),
      description (ABOUT),
      example (EXAMPLE_ONE),
      example (EXAMPLE_TWO),
      subcommand (subconfigOne),
      subcommand (subconfigTwo),
    )
    expect (config).toHaveProperty ('examples')
    expect (config).toHaveProperty ('name')
    expect (config).toHaveProperty ('version')
    expect (config).toHaveProperty ('description')
    expect (config.name).toStrictEqual (NAME)
    expect (config.version).toStrictEqual (some (VERSION))
    expect (config.description).toStrictEqual (some (ABOUT))
    expect (config.examples).toContain (EXAMPLE_ONE)
    expect (config.examples).toContain (EXAMPLE_TWO)
    expect (config.subcommands).toContain (subconfigOne)
    expect (config.subcommands).toContain (subconfigTwo)
  })

  test ('concat', () => {
    const config = command (NAME) (
      version (VERSION),
      version ('0.1.4'),
      description (ABOUT),
      description ('another describe'),
      example (EXAMPLE_ONE),
      example (EXAMPLE_TWO),
    )

    expect (config).toHaveProperty ('version')
    expect (config).toHaveProperty ('description')
    expect (config).toHaveProperty ('examples')
    expect (config.version).toStrictEqual (some ('0.1.4'))
    expect (config.description).toStrictEqual (some ('another describe'))
    expect (config.examples).toContain (EXAMPLE_ONE)
    expect (config.examples).toContain (EXAMPLE_TWO)
  })
})

describe ('flag', () => {
  const NAME = 'output'
  const ALIAS = 'o'
  const DESCRIPTION = 'Sets different output file.'
  const FALLBACK = 'bundle.js'

  test ('name', () => {
    const fl = flag (NAME) ()

    expect (fl).toHaveProperty ('name')
    expect (fl.name).toStrictEqual (NAME)
  })

  test ('alias', () => {
    const fl = flag (NAME) (
      alias (ALIAS),
    )

    expect (fl).toHaveProperty ('alias')
    expect (fl.alias).toStrictEqual (some (ALIAS))
  })

  test ('description', () => {
    const fl = flag (NAME) (
      description (DESCRIPTION),
    )

    expect (fl).toHaveProperty ('description')
    expect (fl.description).toStrictEqual (some (DESCRIPTION))
  })

  test ('fallback', () => {
    const fl = flag (NAME) (
      fallback (FALLBACK),
    )

    expect (fl).toHaveProperty ('fallback')
    expect (fl.fallback).toStrictEqual (some (FALLBACK))
  })

  test ('concat', () => {
    const fl = flag (NAME) (
      alias (ALIAS),
      alias ('ot'),
      description (DESCRIPTION),
      description ('another description'),
      fallback (FALLBACK),
      fallback ('index.js'),
    )

    expect (fl).toHaveProperty ('alias')
    expect (fl).toHaveProperty ('description')
    expect (fl).toHaveProperty ('fallback')
    expect (fl.alias).toStrictEqual (some ('ot'))
    expect (fl.description).toStrictEqual (some ('another description'))
    expect (fl.fallback).toStrictEqual (some ('index.js'))
  })
})
