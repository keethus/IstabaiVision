import {createContext, useContext, useState} from "react";

const StateContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {}
})

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
  const [rooms, setRooms] = useState({});

  const setToken = (token) => {
    _setToken(token);
    if(token) {
      localStorage.setItem('ACCESS_TOKEN', token);
      localStorage.setItem('User', user.id)
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  return (
    <StateContext.Provider value={{
      user,
      token,
      setUser,
      setToken,
        rooms,
        setRooms
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext)
