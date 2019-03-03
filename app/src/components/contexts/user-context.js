import {createContext} from 'react'

let defaultUser = {isAdmin: false,username: '', isLoggedIn: false}
const {Consumer: UserConsumer,Provider: UserProvider} = createContext(defaultUser)

export {
    UserConsumer,
    UserProvider,
    defaultUser
}
