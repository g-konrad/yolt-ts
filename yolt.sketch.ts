import { createCommand, about, version, subcommand, arg, action } from 'yolt/command'
import { flag, alias, description, fallback } from 'yolt/flag'
import { runYolt } from 'yolt'

const build = createCommand ('build') ([
  arg ('src'),
  arg ('dest'),
  about ('Builds the source directory'),
  flag ('output') ([
    alias ('o'),
    description ('Change name of output file'),
    fallback ('bundle.js')
  ])
])

const manager = createCommand ('manager') ([
  version ('1.0.5'),
  about ('Does stuff'),
  flag ('global') ([
    alias ('g'),
    description ('An example global flag'),
  ]),
  action (() => {
    // do stuff
    // need some kind of context access to get args and flags
  }),
  subcommand (build)
]) 

const main = runYolt (manager) (process.argv)
