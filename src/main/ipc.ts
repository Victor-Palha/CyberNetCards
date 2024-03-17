import { ipcMain } from "electron";
import { IPC } from "../shared/constants/ipc";
import { CreateUserRequest, CreateUserResponse, SignInRequest, SignInResponse } from "../shared/types/ipc";
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