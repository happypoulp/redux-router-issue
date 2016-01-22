import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React, { Component } from 'react'
import ReactDom from 'react-dom'
import { connect, Provider } from 'react-redux'
import { Route, Router, Link } from 'react-router'
import createHistory from 'history/lib/createHashHistory'
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router'
import thunk from 'redux-thunk'
import Immutable from 'immutable'

/**************************************** FAKE DATA *************************************/

const dataList = [
  { id: 1, text: 'one', },
  { id: 2, text: 'two', }
]

/**************************************** ACTIONS *************************************/

const listThunk = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'LIST_REQUEST'
    })

    setTimeout(() => {
      return dispatch({
        type: 'LIST_SUCCESS',
        response: dataList
      })
    }, 200)
  }
}

/**************************************** COMPONENTS *************************************/

const listAction = listThunk

class AppContainer extends Component {
  static fetchData(dispatch) {
    console.log('AppContainer fetchData')
    dispatch(listAction())
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

  render () {
    console.log('AppContainer render')
    const other = this.props.app.get('other')
    const list = this.props.app.get('list')

    return <div>
      {
        React.cloneElement(
          this.props.children,
          {
            ...this.props,
            list: list,
            children: null
          }
        )
      }
    </div>
  }
}
const ConnectedAppContainer = connect((state) => {
  console.log('connect AppContainer', state.app.get('list'), state.app.get('other'))
  return {
    app: state.app
  }
})(AppContainer)

class App extends Component {

  renderList (list) {
    if (list) {
      return list.map(item => {
        return <li key={ item.get('id') }>
          <Link to={`/${item.get('id')}`}>{ item.get('text') }</Link>
        </li>
      })
    }
  }

  render () {
    const { other, list } = this.props
    console.log('@@@@@@@ App this.props', this.props)

    let listComp = null

    if (list) {
      listComp = this.renderList(list)
    }

    return <ul>
      { listComp }
    </ul>
  }
}

/**************************************** REDUCER *************************************/

const initialState = Immutable.fromJS({
  list: null,
})

const appReducer = (state = initialState, action) => {
  console.log('-- appReducer', state, action)
  switch (action.type) {
    case 'LIST_REQUEST':
      return state.set('list', null)
    break;
    case 'LIST_SUCCESS':
      return state.set('list', Immutable.fromJS(action.response))
    break;
  }
  return state
}

/**************************************** ROUTES *************************************/

const routes = <Route path="/" component={ConnectedAppContainer}>
  <Route path=":id" component={App} />
</Route>

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
