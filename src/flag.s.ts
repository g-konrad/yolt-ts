import { some } from 'fp-ts/lib/Option'
import { alias, createConfigFlag, fallback } from './flag'
import { describe } from './config'

const NAME = 'output'
const ALIAS = 'o'
const DESCRIPTION = 'Sets different output file.'
const FALLBACK = 'bundle.js'

test ('name', () => {
  const flag = createConfigFlag (NAME) ()

  expect (flag).toHaveProperty ('name')
  expect (flag.name).toStrictEqual (NAME)
})

test ('alias', () => {
  const flag = createConfigFlag (NAME) (
    alias (ALIAS),
  )

  expect (flag).toHaveProperty ('alias')
  expect (flag.alias).toStrictEqual (some (ALIAS))
})

test ('describe', () => {
  const flag = createConfigFlag (NAME) (
    describe (DESCRIPTION),
  )

  expect (flag).toHaveProperty ('description')
  expect (flag.description).toStrictEqual (some (DESCRIPTION))
})

test ('fallback', () => {
  const flag = createConfigFlag (NAME) (
    fallback (FALLBACK),
  )

  expect (flag).toHaveProperty ('fallback')
  expect (flag.fallback).toStrictEqual (some (FALLBACK))
})

test ('concat', () => {
  const flag = createConfigFlag (NAME) (
    alias (ALIAS),
    describe (DESCRIPTION),
    fallback (FALLBACK),
    alias ('ot'),
    describe ('another description'),
    fallback ('index.js'),
  )

  expect (flag).toHaveProperty ('alias')
  expect (flag).toHaveProperty ('description')
  expect (flag).toHaveProperty ('fallback')
  expect (flag.alias).toStrictEqual (some ('ot'))
  expect (flag.description).toStrictEqual (some ('another description'))
  expect (flag.fallback).toStrictEqual (some ('index.js'))
})
