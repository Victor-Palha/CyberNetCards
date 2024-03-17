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

type PlayerInformation = {
    id_player: string,
    username: string,
    email: string
}