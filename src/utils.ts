import { getMonoid } from 'fp-ts/lib/Option'
import { last } from 'fp-ts/lib/Semigroup'

const { concat: concatStrOption } = getMonoid<string> (last ())

export { concatStrOption }
