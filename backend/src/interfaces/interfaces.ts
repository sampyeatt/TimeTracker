export interface Time {
    id: number,
    client_name: string,
    key: string,
    userId: number,
    running: number,
    current_time: number,
    total_time: number
}

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    status: string
}

export interface Token {
    id: number,
    token: string,
    type: string,
    userId: number,
}