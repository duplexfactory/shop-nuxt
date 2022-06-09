export default interface IgAuth {
    userId: string;
    pageId: string;
    username: string;
    localUserId: number;

    accessToken: string;
    expiry: Date;
    invalid?: boolean;
}
