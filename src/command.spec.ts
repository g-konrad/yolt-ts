import { some } from 'fp-ts/lib/Option'
import { command, about, example, version, subcommand, arg } from './command'

const NAME = 'manager'
const VERSION = '1.0.1'
const ABOUT = 'Does stuff.'
const EXAMPLE_ONE = 'manager build'
const EXAMPLE_TWO = 'manager start'
const ARG_ONE = 'src'
const ARG_TWO = 'dest'

test ('name', () => {
  const cmd = command (NAME) ()

  expect (cmd).toHaveProperty ('name')
  expect (cmd.name).toStrictEqual (NAME)
})

test ('version', () => {
  const cmd = command (NAME) (
    version (VERSION),
  )

  expect (cmd).toHaveProperty ('version')
  expect (cmd.version).toStrictEqual (some (VERSION))
})

test ('about', () => {
  const cmd = command (NAME) (
    about (ABOUT),
  )

  expect (cmd).toHaveProperty ('about')
  expect (cmd.about).toStrictEqual (some (ABOUT))
})

test ('examples', () => {
  const cmd = command (NAME) (
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
  )

  expect (cmd).toHaveProperty ('examples')
  expect (cmd.examples).toContain (EXAMPLE_ONE)
  expect (cmd.examples).toContain (EXAMPLE_TWO)
})

test ('args', () => {
  const cmd = command (NAME) (
    arg (ARG_ONE),
    arg (ARG_TWO),
  )

  expect (cmd).toHaveProperty ('args')
  expect (cmd.args).toContain (ARG_ONE)
  expect (cmd.args).toContain (ARG_TWO)
})

test ('subcommands', () => {
  const SUBCOMMAND_ONE_NAME = 'subcommandOne'
  const SUBCOMMAND_ONE_VERSION = '0.5.3'
  const SUBCOMMAND_ONE_ABOUT = 'This is subcommand one'
  const SUBCOMMAND_ONE_EXAMPLE_ONE = 'subcommandOne go'
  const SUBCOMMAND_ONE_EXAMPLE_TWO = 'subcommandOne run'

  const subcmdOne = command (SUBCOMMAND_ONE_NAME) (
    version (SUBCOMMAND_ONE_VERSION),
    about (SUBCOMMAND_ONE_ABOUT),
    example (SUBCOMMAND_ONE_EXAMPLE_ONE),
    example (SUBCOMMAND_ONE_EXAMPLE_TWO),
  )
  expect (subcmdOne).toHaveProperty ('name')
  expect (subcmdOne).toHaveProperty ('version')
  expect (subcmdOne).toHaveProperty ('about')
  expect (subcmdOne).toHaveProperty ('examples')
  expect (subcmdOne.name).toStrictEqual (SUBCOMMAND_ONE_NAME)
  expect (subcmdOne.version).toStrictEqual (some (SUBCOMMAND_ONE_VERSION))
  expect (subcmdOne.about).toStrictEqual (some (SUBCOMMAND_ONE_ABOUT))
  expect (subcmdOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_ONE)
  expect (subcmdOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_TWO)

  const SUBCOMMAND_TWO_NAME = 'subcommandTwo'
  const SUBCOMMAND_TWO_VERSION = '3.6.1'
  const SUBCOMMAND_TWO_ABOUT = 'This is subcommand two'
  const SUBCOMMAND_TWO_EXAMPLE_ONE = 'subcommandTwo go'
  const SUBCOMMAND_TWO_EXAMPLE_TWO = 'subcommandTwo run'
  const subcmdTwo = command (SUBCOMMAND_TWO_NAME) (
    version (SUBCOMMAND_TWO_VERSION),
    about (SUBCOMMAND_TWO_ABOUT),
    example (SUBCOMMAND_TWO_EXAMPLE_ONE),
    example (SUBCOMMAND_TWO_EXAMPLE_TWO),
  )
  expect (subcmdTwo).toHaveProperty ('name')
  expect (subcmdTwo).toHaveProperty ('version')
  expect (subcmdTwo).toHaveProperty ('about')
  expect (subcmdTwo).toHaveProperty ('examples')
  expect (subcmdTwo.name).toStrictEqual (SUBCOMMAND_TWO_NAME)
  expect (subcmdTwo.version).toStrictEqual (some (SUBCOMMAND_TWO_VERSION))
  expect (subcmdTwo.about).toStrictEqual (some (SUBCOMMAND_TWO_ABOUT))
  expect (subcmdTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_ONE)
  expect (subcmdTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_TWO)

  const cmd = command (NAME) (
    version (VERSION),
    about (ABOUT),
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
    subcommand (subcmdOne),
    subcommand (subcmdTwo),
  )
  expect (cmd).toHaveProperty ('examples')
  expect (cmd).toHaveProperty ('name')
  expect (cmd).toHaveProperty ('version')
  expect (cmd).toHaveProperty ('about')
  expect (cmd.name).toStrictEqual (NAME)
  expect (cmd.version).toStrictEqual (some (VERSION))
  expect (cmd.about).toStrictEqual (some (ABOUT))
  expect (cmd.examples).toContain (EXAMPLE_ONE)
  expect (cmd.examples).toContain (EXAMPLE_TWO)
  expect (cmd.subcommands).toContain (subcmdOne)
  expect (cmd.subcommands).toContain (subcmdTwo)
})

test ('concat', () => {
  const cmd = command (NAME) (
    version (VERSION),
    version ('0.1.4'),
    about (ABOUT),
    about ('another about'),
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
  )

  expect (cmd).toHaveProperty ('version')
  expect (cmd).toHaveProperty ('about')
  expect (cmd).toHaveProperty ('examples')
  expect (cmd.version).toStrictEqual (some ('0.1.4'))
  expect (cmd.about).toStrictEqual (some ('another about'))
  expect (cmd.examples).toContain (EXAMPLE_ONE)
  expect (cmd.examples).toContain (EXAMPLE_TWO)
})
