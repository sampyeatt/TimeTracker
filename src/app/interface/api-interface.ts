export interface Session {
    userId: number
    name: string
    email: string
}

export interface User {
    userId: number
    name: string
    email: string
}

export interface Time {
    id: number,
    client_name: string,
    key: string,
    userId: number,
    running: number,
    current_time: number,
    total_time: number
}

export interface UpdateResponse {
    message: string,
    time: Time
}

export interface StopResponse {
    message: string,
    times: Time[]
}
