import { command, describe, codec, version, subcommand, arg, action, flag, alias, fallback } from 'yolt/command'
import { runYolt } from 'yolt'
import * as t from 'io-ts'

const build = command ('build') (
  arg ('src') (
    codec (t.string),
  ),
  arg ('dest') (
    codec (t.string),
  ),
  describe ('Builds the source directory'),
  flag ('output') (
    alias ('o'),
    describe ('Changes output file name.'),
    codec (t.string),
  )
)

// automatically infer the proper codecs
// maybe we'll need a `provideCodec` function for custom codecs?
const altBuild = command ('build <src:string> <dest:string>') (
  describe ('Builds the source directory'),
  flag ('output:string') (
    alias ('o'),
    describe ('Changes output file name.')
  )
)

const manager = command ('manager') (
  version ('1.0.5'),
  describe ('Does stuff'),
  flag ('global') (
    alias ('g'),
    describe ('An example global flag'),
  ),
  action (() => {
    // do stuff
    // need some kind of context access to get args and flags
  }),
  subcommand (build)
)

const main = runYolt (manager) (process.argv)
