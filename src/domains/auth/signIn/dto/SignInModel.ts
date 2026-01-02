export interface SignInCredentials {
    username: string;
    password: string;
}

export interface SignInResponse {
    data: {
        token: string;
    }
}

export interface UserModel {

    id: string;
    name: string;
    address: string;

}