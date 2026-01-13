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
    email: string
}