import { createContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { Player } from "./authContext";
import { env } from "~/src/shared/constants/config";

export type PrepareRoom = {
    room_id: string;
    room_name: string;
    host: string;
    players: {
        socket_id: string;
        player: string;
        ready: boolean;
    }[]
    messages: {
        playerName: string;
        message: string;
    }[]
    inConfront: boolean;
}

interface ConfrontContextProps {
    socket: Socket | undefined;
    player: Player | undefined;
}

export const confrontContext = createContext({} as ConfrontContextProps)
type ConfrontProviderProps = {
    children: React.ReactNode
}


export function ConfrontProvider({children}: ConfrontProviderProps){
    const [socket, setSocket] = useState<Socket | undefined>()
    const [player, setPlayer] = useState<Player>()

    function getPlayerInformation(){
        let player = localStorage.getItem('@player:cnt') as any
        console.log(player)
        player = player ? JSON.parse(player) as Player : null

        setPlayer(player)
    }
    
    useEffect(()=>{
        const socket = io(env.SOCKER_SERVER)
        setSocket(socket)
        getPlayerInformation()
    }, [])
    return (
        <confrontContext.Provider value={{socket, player}}>
            {children}
        </confrontContext.Provider>
    )
}