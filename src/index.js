import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { connect, Provider } from 'react-redux'
import { Route, Router, Link } from 'react-router'
import createHistory from 'history/lib/createHashHistory'
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router'
import thunk from 'redux-thunk'

/**************************************** FAKE DATA *************************************/

const dataList = [
  { id: 1, text: 'one', },
  { id: 2, text: 'two', }
]

/**************************************** ACTION-CREATOR *************************************/

const listThunk = () => (dispatch) => {
  dispatch({ type: 'LIST_REQUEST' })

  setTimeout(
    () => dispatch({ type: 'LIST_SUCCESS', response: dataList }),
    200
  )
}

/**************************************** COMPONENTS *************************************/

class AppContainer extends Component {
  componentDidMount () {
    console.log('componentDidMount')
    if (!this.props.list) {
      this.props.dispatch(listThunk())
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', 'id', this.props.params.id, 'nextId', nextProps.params.id)
    if (this.props.params.id !== nextProps.params.id) {
      this.props.dispatch(listThunk())
    }
  }

  render () {
    console.log('AppContainer render')

    return <ul>
      { this.props.app.list && this.props.app.list.map(item =>
        <li key={ item.id }>
          <Link to={`/${item.id}`}>{ item.text }</Link>
        </li>
      ) }
    </ul>

  }
}
const ConnectedAppContainer = connect(state => ({ app: state.app }))(AppContainer)

/**************************************** REDUCER *************************************/

const initialState = { list: null }

const appReducer = (state = initialState, action) => {
  console.log('-- appReducer', state, action)
  switch (action.type) {
    case 'LIST_REQUEST': return { list: null }
    case 'LIST_SUCCESS': return { list: action.response }
  }
  return state
}

/**************************************** ROUTES *************************************/

const routes = <Route path="/:id" component={ConnectedAppContainer} />

/**************************************** STORE CONFIGURATION *************************************/

const reducer = combineReducers({
  router: routerStateReducer,
  app: appReducer,
})

// Compose reduxReactRouter with other store enhancers
const finalCreateStore =
compose(
  applyMiddleware(thunk),
  reduxReactRouter({
    routes,
    createHistory
  })
)
(createStore)

const store = finalCreateStore(reducer)

/**************************************** CLIENT RENDERING *************************************/

ReactDom.render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
)
