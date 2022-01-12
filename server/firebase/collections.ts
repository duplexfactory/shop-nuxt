import {CollectionReference, getFirestore} from "firebase-admin/firestore";
import IgPage from "~/models/IgPage";
import Shop from "~/models/Shop";
import IgMedia from "~/models/IgMedia";
import IgTray from "~/models/IgTray";
import IgStory from "~/models/IgStory";

export function pageCollection() {
    return getFirestore().collection("pages") as CollectionReference<IgPage>;
}

export function shopCollection() {
    return getFirestore().collection("shops") as CollectionReference<Shop>;
}

export type IdInput = number | string | { id: string | number }

function idString(id: string | number) {
    return (typeof id === "string") ? id : id.toString();
}

export function toId(id: IdInput) {
    return idString((typeof id === "object") ? id.id : id);
}

export function mediaCollection(id: IdInput) {
    return pageCollection().doc(toId(id)).collection("medias") as CollectionReference<IgMedia>;
}

export function trayCollection(id: IdInput) {
    return pageCollection().doc(toId(id)).collection("trays") as CollectionReference<IgTray>;
}

export function storyCollection(id: IdInput) {
    return pageCollection().doc(toId(id)).collection("stories") as CollectionReference<IgStory>;
}
