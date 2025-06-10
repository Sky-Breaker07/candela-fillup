import { StatusBar } from 'react-native'
import { ReactNode } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps
} from 'react-native'
import { cn } from '../../utils'
import React from 'react'

interface IScrollViewProps extends ScrollViewProps {
  children: ReactNode
  className?: string
  isSafeAreaView?: boolean
}

export default function Container({
  children,
  className,
  isSafeAreaView = true,
  ...rest
}: IScrollViewProps) {
  const sharedClass = cn('bg-white flex-1', className)

  return (
    <>
      {isSafeAreaView ? (
        <SafeAreaView className={sharedClass}>
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView className={sharedClass} behavior="padding">
              <ScrollView {...rest}>{children}</ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView {...rest}>{children}</ScrollView>
          )}
        </SafeAreaView>
      ) : (
        <>
          {Platform.OS === 'ios' ? (
            <KeyboardAvoidingView className={sharedClass} behavior="padding">
              <ScrollView {...rest}>{children}</ScrollView>
            </KeyboardAvoidingView>
          ) : (
            <ScrollView className={sharedClass} {...rest}>
              {children}
            </ScrollView>
          )}
        </>
      )}
      <StatusBar barStyle="dark-content" />
    </>
  )
}
