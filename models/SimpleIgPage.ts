import IgPage from "~/models/IgPage";

export type SimpleIgPage = Pick<IgPage, "lastMediaData" | "fullName" | "pk" | "username">;