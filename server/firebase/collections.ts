import {CollectionGroup, CollectionReference, getFirestore} from "firebase-admin/firestore";
import IgPage from "~/models/IgPage";
import IgMedia from "~/models/IgMedia";
import IgTray from "~/models/IgTray";
import IgStory from "~/models/IgStory";
import {initFirebase} from "~/server/firebase/init";
import IgPageReview from "~/models/IgPageReview";
// import {firestore} from "firebase-admin/firestore";
// import CollectionGroup = firestore.CollectionGroup;
initFirebase();

export function pageCollection() {
    return getFirestore().collection("pages") as CollectionReference<IgPage>;
}

export function reviewCollection() {
    return getFirestore().collection("reviews") as CollectionReference<IgPageReview>;
}

export type IdInput = number | string | { id: string | number }

function idString(id: string | number) {
    return (typeof id === "string") ? id : id.toString();
}

export function toId(id: IdInput) {
    return idString((typeof id === "object") ? id.id : id);
}
