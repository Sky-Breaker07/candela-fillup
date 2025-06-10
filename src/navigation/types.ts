export type RootStackParamsList = {
  Public: undefined
  Private: undefined
  Onboarding: undefined
  Authentication: undefined
}

export type PublicStackParamsList = {
  LoginScreen: undefined
  PrivacyPolicyScreen: undefined
}

export type OnboardingStackParamsList = {
  OnboardingStepOne: undefined
  OnboardingStepTwo: undefined
  OnboardingStepThree: undefined
}

export type AuthenticationStackParamsList = {
  login: undefined
  signup: undefined
  completeProfileInformation: {
    email: string
  }
  forgotPassword: undefined
  changePassword: undefined
  emailVerification: {
    email: string
  }
}

export type PrivateStackParamsList = {
  DashboardScreen: undefined
}