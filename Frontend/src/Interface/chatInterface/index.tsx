export interface ChatInterface {
    id?: string
    senderId: string
    receiverId: string
    content: string 
    updatedAt: string
    createdAt: string
    isRead: boolean
    chatsId: string
}

export interface MessageInterface {
    id?: string
    members?: string[];
    createdAt?: string
    isGroupChat?: boolean
    messages?: ChatInterface[]
}