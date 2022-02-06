import { some } from 'fp-ts/lib/Option'
import { createCommand, about, example, version, subcommand } from './settings'

const NAME = 'manager'
const VERSION = '1.0.1'
const ABOUT = 'Does stuff.'
const EXAMPLE_ONE = 'manager build'
const EXAMPLE_TWO = 'manager start'

test ('name', () => {
  const settings = createCommand (NAME) ([])

  expect (settings).toHaveProperty ('name')
  expect (settings.name).toStrictEqual (some (NAME))
})

test ('version', () => {
  const settings = version (VERSION)

  expect (settings).toHaveProperty ('version')
  expect (settings.version).toStrictEqual (some (VERSION))
})

test ('about', () => {
  const settings = about (ABOUT)

  expect (settings).toHaveProperty ('about')
  expect (settings.about).toStrictEqual (some (ABOUT))
})

test ('examples', () => {
  const exampleOne = example (EXAMPLE_ONE)
  expect (exampleOne).toHaveProperty ('examples')
  expect (exampleOne.examples).toContain (EXAMPLE_ONE)

  const exampleTwo = example (EXAMPLE_TWO)
  expect (exampleTwo).toHaveProperty ('examples')
  expect (exampleTwo.examples).toContain (EXAMPLE_TWO)

  const settings = createCommand (NAME) ([
    exampleOne,
    exampleTwo
  ])
  expect (settings).toHaveProperty ('examples')
  expect (settings.examples).toContain (EXAMPLE_ONE)
  expect (settings.examples).toContain (EXAMPLE_TWO)
})

test ('subcommands', () => {
  const SUBCOMMAND_ONE_NAME = 'subcommandOne'
  const SUBCOMMAND_ONE_VERSION = '0.5.3'
  const SUBCOMMAND_ONE_ABOUT = 'This is subcommand one'
  const SUBCOMMAND_ONE_EXAMPLE_ONE = 'subcommandOne go'
  const SUBCOMMAND_ONE_EXAMPLE_TWO = 'subcommandOne run'

  const subcommandOne = createCommand (SUBCOMMAND_ONE_NAME) ([
    version (SUBCOMMAND_ONE_VERSION),
    about (SUBCOMMAND_ONE_ABOUT),
    example (SUBCOMMAND_ONE_EXAMPLE_ONE),
    example (SUBCOMMAND_ONE_EXAMPLE_TWO)
  ])
  expect (subcommandOne).toHaveProperty ('name')
  expect (subcommandOne.name).toStrictEqual (some (SUBCOMMAND_ONE_NAME))
  expect (subcommandOne).toHaveProperty ('version')
  expect (subcommandOne.version).toStrictEqual (some (SUBCOMMAND_ONE_VERSION))
  expect (subcommandOne).toHaveProperty ('about')
  expect (subcommandOne.about).toStrictEqual (some (SUBCOMMAND_ONE_ABOUT))
  expect (subcommandOne).toHaveProperty ('examples')
  expect (subcommandOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_ONE)
  expect (subcommandOne.examples).toContain (SUBCOMMAND_ONE_EXAMPLE_TWO)

  const SUBCOMMAND_TWO_NAME = 'subcommandTwo'
  const SUBCOMMAND_TWO_VERSION = '3.6.1'
  const SUBCOMMAND_TWO_ABOUT = 'This is subcommand two'
  const SUBCOMMAND_TWO_EXAMPLE_ONE = 'subcommandTwo go'
  const SUBCOMMAND_TWO_EXAMPLE_TWO = 'subcommandTwo run'
  const subcommandTwo = createCommand (SUBCOMMAND_TWO_NAME) ([
    version (SUBCOMMAND_TWO_VERSION),
    about (SUBCOMMAND_TWO_ABOUT),
    example (SUBCOMMAND_TWO_EXAMPLE_ONE),
    example (SUBCOMMAND_TWO_EXAMPLE_TWO)
  ])
  expect (subcommandTwo).toHaveProperty ('name')
  expect (subcommandTwo.name).toStrictEqual (some (SUBCOMMAND_TWO_NAME))
  expect (subcommandTwo).toHaveProperty ('version')
  expect (subcommandTwo.version).toStrictEqual (some (SUBCOMMAND_TWO_VERSION))
  expect (subcommandTwo).toHaveProperty ('about')
  expect (subcommandTwo.about).toStrictEqual (some (SUBCOMMAND_TWO_ABOUT))
  expect (subcommandTwo).toHaveProperty ('examples')
  expect (subcommandTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_ONE)
  expect (subcommandTwo.examples).toContain (SUBCOMMAND_TWO_EXAMPLE_TWO)

  const command = createCommand (NAME) ([
    version (VERSION),
    about (ABOUT),
    example (EXAMPLE_ONE),
    example (EXAMPLE_TWO),
    subcommand (subcommandOne),
    subcommand (subcommandTwo)
  ])
  expect (command).toHaveProperty ('examples')
  expect (command).toHaveProperty ('name')
  expect (command).toHaveProperty ('version')
  expect (command).toHaveProperty ('about')
  expect (command.examples).toContain (EXAMPLE_ONE)
  expect (command.examples).toContain (EXAMPLE_TWO)
  expect (command.subcommands).toContain (subcommandOne)
  expect (command.subcommands).toContain (subcommandTwo)
})
