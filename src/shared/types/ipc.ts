import { AvatarsProps } from "~/src/renderer/src/components/Avatar"
import { CardsProps } from "~/src/renderer/src/components/Card"

export interface CreateUserRequest {
    username: string
    email: string
    password: string
}
export interface CreateUserResponse {
    status: number
}

export interface SignInRequest {
    email: string
    password: string
}

export interface SignInResponse {
    player: PlayerInformation
    token: string
}

export interface MyDecksResponse {
    avatar_id: string,
    id_deck: string,
    name: string,
    player_id: string
}

export interface FetchCardsResponse {
    cards: CardsProps[]
    avatars: AvatarsProps[]
}

export interface CreateDeckRequest {
    deck_name: string
    avatar_id: string
    cards: string[]
}

export interface FetchDeckResponse {
    id_deck: string,
    deck_name: string,
    cards: CardsProps[],
    avatar: AvatarsProps
}

export interface UpdateDeckRequest{
    deck_id: string,
    deck_name: string,
    cards: string[],
    avatar_id: string
}

type PlayerInformation = {
    id_player: string,
    username: string,
    email: string
}