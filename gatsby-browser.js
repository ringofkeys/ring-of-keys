import React from "react"
import { silentAuth, isLoggedIn } from "./src/utils/auth"
import './src/styles/global.css'

class SessionCheck extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  handleCheckSession = () => {
    this.setState({ loading: false })
    console.log('silent auth has completed')
  }

  componentDidMount() {
    silentAuth(this.handleCheckSession)
  }

  render() {
    return (
      this.state.loading === false && (
        <React.Fragment>{ this.props.children }</React.Fragment>
      )
    )
  }
}

export const wrapRootElement = ({ element }) => {
    return <SessionCheck>{ element }</SessionCheck>
}