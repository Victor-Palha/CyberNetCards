import { ipcMain } from "electron";
import { IPC } from "../shared/constants/ipc";
import { CreateDeckRequest, CreateUserRequest, CreateUserResponse, FetchCardsResponse, FetchDeckResponse, MyDecksResponse, SignInRequest, SignInResponse, UpdateDeckRequest } from "../shared/types/ipc";
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

ipcMain.handle(
    IPC.CARDS.FETCH_CARDS,
    async (_, search: string): Promise<FetchCardsResponse> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        const response = await API.get("/api/card", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                search
            }
        })
        return {
            cards: response.data.cards,
            avatars: response.data.avatars
        }
    }
)

ipcMain.handle(
    IPC.DECKS.CREATE,
    async (_, {deck_name, avatar_id, cards}: CreateDeckRequest): Promise<void> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        await API.post("/api/deck", {
            deck_name,
            avatar_id,
            cards
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
)

ipcMain.handle(
    IPC.DECKS.FETCH_DECK,
    async (_, id: string): Promise<FetchDeckResponse> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        const response = await API.get("/api/deck/"+id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return {
            avatar: response.data.deck.avatar,
            cards: response.data.deck.cards,
            deck_name: response.data.deck.deck_name,
            id_deck: response.data.deck.id_deck
        }
    }
)

ipcMain.handle(
    IPC.DECKS.UPDATE_DECK,
    async (_, {deck_id, deck_name, cards, avatar_id}: UpdateDeckRequest): Promise<void> => {
        const {token} = localStore.get("userAuth") as SignInResponse
        await API.put("/api/deck/"+deck_id, {
            deck_name,
            avatar_id,
            cards
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
)