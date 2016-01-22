export default function promiseMiddleware(services) {
  const uniqueActionsRegistry = {}

  return ({ dispatch, getState }) => {
    return (next) => (action) => {
      if (true) {
        let actionType = action.type
        if (action.types) {
          actionType = action.types[0].replace('_REQUEST', '_*')
        }
        console.log('PROMISE MIDDLEWARE received action:', actionType, action)
      }
      const { promise, once, types, ...rest } = action

      if (!types) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types

      // ensure unicity of actions to avoid triggering actions that are already ongoing
      if (once && uniqueActionsRegistry[REQUEST]) {
        if (true) {
          console.log('PROMISE MIDDLEWARE - STOP action propagation', types.join('-'))
        }
        return
      }

      uniqueActionsRegistry[REQUEST] = 1

      if (true) {
        console.log('PROMISE MIDDLEWARE - dispatch', REQUEST)
      }

      next({...rest, type: REQUEST})

      return promise(services, getState, dispatch).then(
        (response) => {
          if (true) {
            console.log('PROMISE MIDDLEWARE - dispatch', SUCCESS, action.date)
          }
          next({...rest, response, type: SUCCESS})
          uniqueActionsRegistry[REQUEST]--
          if (true) {
            console.log('PROMISE MIDDLEWARE - dispatch DONE', SUCCESS, types.join('-'))
          }
          // to fix bluebird warning:
          // https://github.com/petkaantonov/bluebird/blob/master/docs/docs/warning-explanations.md#warning-a-promise-was-created-in-a-handler-but-none-were-returned-from-it
          return null
        },
        (error) => {
          next({...rest, error, type: FAILURE})
          uniqueActionsRegistry[REQUEST]--
          if (true) {
            console.log('PROMISE MIDDLEWARE - DONE error action', types.join('-'), error)
          }
          // to fix bluebird warning:
          // https://github.com/petkaantonov/bluebird/blob/master/docs/docs/warning-explanations.md#warning-a-promise-was-created-in-a-handler-but-none-were-returned-from-it
          return null
        }
      )
    }
  }
}
