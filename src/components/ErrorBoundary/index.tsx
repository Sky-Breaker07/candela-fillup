import React, { Component } from "react"
import { Text, View } from "react-native"


interface IErrorBoundaryProps {
  template?: React.ReactNode
  actionButton?: React.ReactElement
  children?: React.ReactNode
}

interface IState {
  error?: any
  errorInfo?: Record<string, unknown>
  hasError: boolean
}

/**
 * @render react
 * @name ErrorBoundary container
 * @description ErrorBoundary container.
 * @example
 * <ErrorBoundary />
 */

class ErrorBoundary extends Component<IErrorBoundaryProps, IState> {
  state: IState = {
    error: undefined,
    hasError: false
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error, hasError: true }
  }

  public componentDidCatch(error: Error) {
   console.error('ErrorBoundary caught an error:', error)
  }

  public render() {
    const { actionButton, template } = this.props
    const { error, hasError } = this.state

    if (hasError) {
      return (
        template || (
          <View>
            <Text>Error occurred</Text>
          </View>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
