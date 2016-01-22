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

/**************************************** ACTIONS *************************************/

const listThunk = () => (dispatch) => {
  dispatch({ type: 'LIST_REQUEST' })

  setTimeout(() => dispatch({ type: 'LIST_SUCCESS', response: dataList }), 200)
}

/**************************************** COMPONENTS *************************************/

class AppContainer extends Component {
  static fetchData(dispatch) {
    console.log('AppContainer fetchData')
    dispatch(listThunk())
  }

  componentDidMount () {
    console.log('componentDidMount')
    if (!this.props.other) {
      this.constructor.fetchData(this.props.dispatch)
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', 'id', this.props.params.id, 'nextId', nextProps.params.id)
    if (this.props.params.id !== nextProps.params.id) {
      this.constructor.fetchData(this.props.dispatch)
    }
  }

  renderList (list) {
    if (list) {
      return list.map(item =>
        <li key={ item.id }>
          <Link to={`/${item.id}`}>{ item.text }</Link>
        </li>
      )
    }
    else {
      return null
    }
  }

  render () {
    console.log('AppContainer render')

    return <ul>
      { this.renderList(this.props.app.list) }
    </ul>

  }
}
const ConnectedAppContainer = connect((state) => {
  return {
    app: state.app
  }
})(AppContainer)


/**************************************** REDUCER *************************************/

const initialState = {
  list: null,
}

const appReducer = (state = initialState, action) => {
  console.log('-- appReducer', state, action)
  switch (action.type) {
    case 'LIST_REQUEST':
      return {
        list: null
      }
    break;
    case 'LIST_SUCCESS':
      return {
        list: action.response
      }
    break;
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
