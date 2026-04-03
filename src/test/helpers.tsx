import { render, type RenderOptions } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
import type { ReactElement, ReactNode } from 'react'

// Minimal i18n instance for tests
const testI18n = i18n.createInstance()
testI18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'login.title': 'Cluster LMS',
        'login.subtitle': 'Login',
        'login.email': 'Email',
        'login.password': 'Password',
        'login.button': 'Login',
        'login.error': 'Invalid email or password. Please try again.',
        'login.errorNotFound': 'Account does not exist.',
        'login.errorWrongPassword': 'Password does not match.',
        'login.errorGeneral': 'Unable to log in. Please contact the administrator.',
        'clusterList.title': 'ENUMA SCHOOL Cluster List',
        'clusterList.allInstitutions': 'All Institutions',
        'clusterList.allClusters': 'All Clusters',
        'clusterList.allSchools': 'All Schools',
        'clusterList.institution': 'Institution',
        'clusterList.clusterName': 'Cluster Name',
        'clusterList.schoolName': 'School Name',
        'clusterList.licenseName': 'License Name',
        'clusterList.licenseIssued': 'License Issued',
        'clusterList.licenseInUse': 'License in Use',
        'account.title': 'Account Management',
        'account.create': 'Create an account',
        'account.createButton': '+ Create',
        'account.emailPlaceholder': 'Enter email address',
        'account.emailExists': 'An account with this email address already exists.',
        'account.email': 'Email',
        'account.rights': 'Rights',
        'account.password': 'Password',
        'account.delete': 'Delete',
        'account.deleteTitle': 'Delete Account',
        'account.deleteConfirm': 'Are you sure you want to delete this account?',
        'account.cancel': 'Cancel',
        'common.noData': 'No data to display',
        'common.showingResults': 'Showing <1>{{count}}</1> result(s)',
      },
    },
  },
  interpolation: { escapeValue: false },
})

interface WrapperOptions {
  route?: string
}

function createWrapper({ route = '/' }: WrapperOptions = {}) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <I18nextProvider i18n={testI18n}>
          {children}
        </I18nextProvider>
      </MemoryRouter>
    )
  }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: WrapperOptions & Omit<RenderOptions, 'wrapper'>,
) {
  const { route, ...renderOptions } = options ?? {}
  return render(ui, { wrapper: createWrapper({ route }), ...renderOptions })
}

export { testI18n }
