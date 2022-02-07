import { some } from 'fp-ts/lib/Option'
import { command, describe, example, version, subcommand, arg } from './opts'

const NAME = 'manager'
const VERSION = '1.0.1'
const ABOUT = 'Does stuff.'
const EXAMPLE_ONE = 'manager build'
const EXAMPLE_TWO = 'manager start'
const ARG_ONE = 'src'
const ARG_TWO = 'dest'

test ('name', () => {
  const opts = command (NAME) ()

  expect (opts).toHaveProperty ('name')
  expect (opts.name).toStrictEqual (NAME)
})

test ('version', () => {
  const opts = command (NAME) (
    version (VERSION),
  )

  expect (opts).toHaveProperty ('version')
  expect (opts.version).toStrictEqual (some (VERSION))
})

test ('describe', () => {
  const opts = command (NAME) (
    describe (ABOUT),
  )

  expect (opts).toHaveProperty ('description')
  expect (opts.description).toStrictEqual (some (ABOUT))
})

test ('examples', () => {
  const opts = command (NAME) (
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
  )

  expect (opts).toHaveProperty ('examples')
  expect (opts.examples).toContain (EXAMPLE_ONE)
  expect (opts.examples).toContain (EXAMPLE_TWO)
})

test ('args', () => {
  const opts = command (NAME) (
    arg (ARG_ONE),
    arg (ARG_TWO),
  )

  expect (opts).toHaveProperty ('args')
  expect (opts.args).toContain (ARG_ONE)
  expect (opts.args).toContain (ARG_TWO)
})

test ('subcommands', () => {
  const SUBCOMMAND_ONE_NAME = 'subcommandOne'
  const SUBCOMMAND_ONE_VERSION = '0.5.3'
  const SUBCOMMAND_ONE_ABOUT = 'This is subcommand one'
  const SUBCOMMAND_ONE_EXAMPLE_ONE = 'subcommandOne go'
  const SUBCOMMAND_ONE_EXAMPLE_TWO = 'subcommandOne run'

  const suboptsOne = command (SUBCOMMAND_ONE_NAME) (
    version (SUBCOMMAND_ONE_VERSION),
    describe (SUBCOMMAND_ONE_ABOUT),
    example (SUBCOMMAND_ONE_EXAMPLE_ONE),
    example (SUBCOMMAND_ONE_EXAMPLE_TWO),
  )
  expect (suboptsOne).toHaveProperty ('name')
  expect (suboptsOne).toHaveProperty ('version')
  expect (suboptsOne).toHaveProperty ('description')
  expect (suboptsOne).toHaveProperty ('examples')
  expect (suboptsOne.name).toStrictEqual (SUBCOMMAND_ONE_NAME)
  expect (suboptsOne.version).toStrictEqual (some (SUBCOMMAND_ONE_VERSION))
  expect (suboptsOne.description).toStrictEqual (some (SUBCOMMAND_ONE_ABOUT))
  expect (suboptsOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_ONE)
  expect (suboptsOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_TWO)

  const SUBCOMMAND_TWO_NAME = 'subcommandTwo'
  const SUBCOMMAND_TWO_VERSION = '3.6.1'
  const SUBCOMMAND_TWO_ABOUT = 'This is subcommand two'
  const SUBCOMMAND_TWO_EXAMPLE_ONE = 'subcommandTwo go'
  const SUBCOMMAND_TWO_EXAMPLE_TWO = 'subcommandTwo run'
  const suboptsTwo = command (SUBCOMMAND_TWO_NAME) (
    version (SUBCOMMAND_TWO_VERSION),
    describe (SUBCOMMAND_TWO_ABOUT),
    example (SUBCOMMAND_TWO_EXAMPLE_ONE),
    example (SUBCOMMAND_TWO_EXAMPLE_TWO),
  )
  expect (suboptsTwo).toHaveProperty ('name')
  expect (suboptsTwo).toHaveProperty ('version')
  expect (suboptsTwo).toHaveProperty ('description')
  expect (suboptsTwo).toHaveProperty ('examples')
  expect (suboptsTwo.name).toStrictEqual (SUBCOMMAND_TWO_NAME)
  expect (suboptsTwo.version).toStrictEqual (some (SUBCOMMAND_TWO_VERSION))
  expect (suboptsTwo.description).toStrictEqual (some (SUBCOMMAND_TWO_ABOUT))
  expect (suboptsTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_ONE)
  expect (suboptsTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_TWO)

  const opts = command (NAME) (
    version (VERSION),
    describe (ABOUT),
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
    subcommand (suboptsOne),
    subcommand (suboptsTwo),
  )
  expect (opts).toHaveProperty ('examples')
  expect (opts).toHaveProperty ('name')
  expect (opts).toHaveProperty ('version')
  expect (opts).toHaveProperty ('description')
  expect (opts.name).toStrictEqual (NAME)
  expect (opts.version).toStrictEqual (some (VERSION))
  expect (opts.description).toStrictEqual (some (ABOUT))
  expect (opts.examples).toContain (EXAMPLE_ONE)
  expect (opts.examples).toContain (EXAMPLE_TWO)
  expect (opts.subcommands).toContain (suboptsOne)
  expect (opts.subcommands).toContain (suboptsTwo)
})

test ('concat', () => {
  const opts = command (NAME) (
    version (VERSION),
    version ('0.1.4'),
    describe (ABOUT),
    describe ('another describe'),
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
  )

  expect (opts).toHaveProperty ('version')
  expect (opts).toHaveProperty ('description')
  expect (opts).toHaveProperty ('examples')
  expect (opts.version).toStrictEqual (some ('0.1.4'))
  expect (opts.description).toStrictEqual (some ('another describe'))
  expect (opts.examples).toContain (EXAMPLE_ONE)
  expect (opts.examples).toContain (EXAMPLE_TWO)
})
