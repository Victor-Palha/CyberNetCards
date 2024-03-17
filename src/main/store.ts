import Store from 'electron-store';
import { SignInResponse } from '../shared/types/ipc';
interface StoreSchema {
    userAuth: SignInResponse;
}

export const localStore = new Store<StoreSchema>({
    name: "store",
    defaults: {
        userAuth: {
            token: "",
            player: {
                email: "",
                id_player: "",
                username: ""
            }
        },
    },
})

console.log(localStore.path)