import Reactotron, {trackGlobalErrors} from 'reactotron-react-native'

Reactotron.clear()

console.tron = Reactotron
Reactotron
  .configure({ host: '172.24.17.240' })
  .use(trackGlobalErrors)
  .useReactNative()
  .connect()
