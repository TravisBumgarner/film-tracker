import deleteDB from './delete'
import insert from './insert'
import select from './select'
import update from './update'

export default {
  insert,
  select,
  update,
  delete: deleteDB,
}
