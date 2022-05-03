export default interface IgAuth {
    pageId: string;
    username: string;
    localUserId: number;

    accessToken: string;
    expiry: Date;
}
