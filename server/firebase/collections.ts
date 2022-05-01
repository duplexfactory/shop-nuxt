import {CollectionReference, getFirestore} from "firebase-admin/firestore";
import IgPage from "~/models/IgPage";
import {initFirebase} from "~/server/firebase/init";
import IgPageReview from "~/models/IgPageReview";
import User from "~/models/user/User";
import MediaPriceSuggestion from "~/models/MediaPriceSuggestion";
import ShopSuggestion from "~/models/ShopSuggestion";
// import {firestore} from "firebase-admin/firestore";
// import CollectionGroup = firestore.CollectionGroup;
initFirebase();

const config = useRuntimeConfig();

function checkDev(name: string) {
    return config.DEV_DB ? "dev-" + name : name
}

export function pageCollection() {
    return getFirestore().collection(checkDev("pages")) as CollectionReference<IgPage>;
}

export function reviewCollection() {
    return getFirestore().collection(checkDev("reviews")) as CollectionReference<IgPageReview>;
}

export function userCollection() {
    return getFirestore().collection(checkDev("user")) as CollectionReference<User>;
}

export function mediaPriceSuggestionCollection() {
    return getFirestore().collection("priceSuggests") as CollectionReference<MediaPriceSuggestion>;
}

export function shopSuggestionCollection() {
    return getFirestore().collection("shopSuggests") as CollectionReference<ShopSuggestion>;
}

export type IdInput = number | string | { id: string | number }

function idString(id: string | number) {
    return (typeof id === "string") ? id : id.toString();
}

export function toId(id: IdInput) {
    return idString((typeof id === "object") ? id.id : id);
}
