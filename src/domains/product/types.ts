export interface Product {
    id: string,
    imageUrl?: string,
    description: string,
    name: string,
    price: number,
    stock: number,
    createdAt: string
}

export interface CreateProductReq {
    name: string,
    price: number,
    description: string,
    stock: string,
}

export interface EditProductReq {
    name: string,
    price: number,
    description: string,
    stock: string,
}