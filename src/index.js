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
  // Commenting this line fix the issue
  dispatch({ type: 'LIST_REQUEST' })

  setTimeout(
    () => dispatch({ type: 'LIST_SUCCESS', response: dataList }),
    500
  )
}

/**************************************** COMPONENTS *************************************/

class AppContainer extends Component {
  componentDidMount () {
    if (!this.props.list) {
      console.log('... componentDidMount, dispatch action')
      this.props.dispatch(listThunk())
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      console.log('... componentWillReceiveProps dispatch action')
      this.props.dispatch(listThunk())
    }
  }

  componentDidUpdate () {
    console.log('### componentDidUpdate')
  }

  render () {
    console.log('... AppContainer render with list', this.props.app.list)

    if (store.getState().app.list !== this.props.app.list) {
      console.log('!!!!!!! STALE DATA WERE PROVIDED TO THIS COMPONENT !!!!!!!!')
    }

    return <ul>
      { this.props.app.list && this.props.app.list.map(item =>
        <li key={ item.id }>
          <Link to={`/${item.id}`}>{ item.text }</Link>
        </li>
      ) }
    </ul>

  }
}
const ConnectedAppContainer = connect(state => {
  console.log('... connect')
  return { app: state.app }
})(AppContainer)

/**************************************** REDUCER *************************************/

const initialState = { list: null }

const appReducer = (state = initialState, action) => {
  console.log('... appReducer before action:', action, 'state:', state)
  let newState = state
  switch (action.type) {
    case 'LIST_REQUEST': newState = { list: null }; break;
    case 'LIST_SUCCESS': newState = { list: action.response }; break;
  }
  console.log('... appReducer after:', newState)
  return newState
}

/**************************************** ROUTES *************************************/

const routes = <Route path="/:id" component={ConnectedAppContainer} />

/**************************************** STORE CONFIGURATION *************************************/

const reducer = combineReducers({
  router: routerStateReducer,
  app: appReducer,
})

const store = compose(
  applyMiddleware(thunk),
  reduxReactRouter({ routes, createHistory })
)(createStore)(reducer)

/**************************************** CLIENT RENDERING *************************************/

console.log('### ReactDom.render')

ReactDom.render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
)
