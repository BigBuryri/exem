import { createContext, useContext } from 'react'
import banketamConfig from '../variants/banketam.js'

const ConfigContext = createContext({})

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}

export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider value={{ config: banketamConfig }}>
      {children}
    </ConfigContext.Provider>
  )
}
