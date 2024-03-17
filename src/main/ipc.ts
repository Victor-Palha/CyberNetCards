import { ipcMain } from "electron";
import { IPC } from "../shared/constants/ipc";
import { CreateUserRequest, CreateUserResponse, MyDecksResponse, SignInRequest, SignInResponse } from "../shared/types/ipc";
import { API } from "./lib/axios";
import { localStore } from "./store";

ipcMain.handle(
    IPC.USERS.CREATE,
    async (_, {email, password, username}:CreateUserRequest): Promise<CreateUserResponse> => {
        const response = await API.post("/api/signup", {
            email,
            password,
            username,
        })
        console.log(response.status)

        return {
            status: response.status
        }
    }
)

ipcMain.handle(
    IPC.USERS.SIGNIN,
    async (_, {email, password}: SignInRequest): Promise<SignInResponse> => {
        const {data} = await API.post("/api/login", {
            email,
            password,
        }) as {data: SignInResponse}
        
        localStore.set("userAuth", data)

        return data
    }
)

ipcMain.handle(
    IPC.USERS.GET_INFO,
    (): SignInResponse => {
        const {token, player} = localStore.get("userAuth") as SignInResponse
        return {
            token,
            player
        }
    }
)

ipcMain.handle(
    IPC.DECKS.MY_DECKS,
    async (): Promise<MyDecksResponse[]> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        const response = await API.get("/api/myDecks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.decks
    }
)

ipcMain.handle(
    IPC.DECKS.DELETE,
    async (_, id: string): Promise<void> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        await API.delete("/api/deck/"+id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
)