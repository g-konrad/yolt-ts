import yolt from './yolt'

/*
 *  how do we wanna write this?
 *
 *  Yolt :: Name -> Version -> [Command] -> Args -> IO ()
 *  Command :: Name -> Description -> [(gTArg, Codec)] ->
 *
 *  const myCli = pipe (
 *    name ('prog'),
 *    version ('1.0.1'),
 *    option option ({ short: 'f', long: 'foo', description: 'does foo', default: 'bar' })
 *  )
* */
test ('yolt', () => {
  expect (typeof yolt).toEqual ('function')
})

test ('yolt()', () => {
  const prog = yolt ({
    name: 'prog',
    version: '1.1.0'
  })

  expect (prog.name).toEqual ('prog')
})

test ('option', () => {
  const prog = yolt ({
    name: 'prog',
    version: '1.1.0'
  })
})
