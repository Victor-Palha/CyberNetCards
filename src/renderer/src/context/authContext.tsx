import { createContext, useEffect, useState } from "react";

interface AuthContextProps {
    isAuth: boolean,
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    player: Player | undefined
}
export const authContext = createContext({} as AuthContextProps)

export interface Player{
    id_player: string,
    username: string,
    email: string
}
interface AuthProviderProps {
    children: React.ReactNode
}

export function AuthProvider({children}: AuthProviderProps){
    const [isAuth, setIsAuth] = useState(false)
    const [player, setPlayer] = useState<Player>()

    useEffect(()=>{
        window.api.getPlayerInfo()
            .then((data)=> {
                if(data.token){
                    setPlayer(data.player)
                    setIsAuth(true)
                }else{
                    setIsAuth(false)
                }
            })
    }, [isAuth])
    return (
        <authContext.Provider value={{isAuth, setIsAuth, player}}>
            {children}
        </authContext.Provider>
    )
}