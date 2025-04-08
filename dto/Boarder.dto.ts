export class BoarderCreateInputs {
    name: string
    phone: string
    email: string
    password: string
}

export interface BoarderPayload {
    _id: string
    email: string,
    name: string
}