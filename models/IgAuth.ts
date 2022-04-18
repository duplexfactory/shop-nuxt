export default interface IgAuth {
    pk?: number;
    username: string;
    localUserId: number;

    accessToken: string;
    expiry: Date;
}
