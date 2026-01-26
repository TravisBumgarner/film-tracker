// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const RN = require('react-native')
  return {
    Text: RN.Text,
    Provider: ({ children }) => children,
  }
})
