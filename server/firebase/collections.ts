import {CollectionReference, getFirestore} from "firebase-admin/firestore";
import IgPage from "~/models/IgPage";
import IgMedia from "~/models/IgMedia";
import IgTray from "~/models/IgTray";
import IgStory from "~/models/IgStory";
import {getDatabase} from "firebase-admin/lib/database";
import {firestore} from "firebase-admin/lib/firestore/firestore-namespace";
import CollectionGroup = firestore.CollectionGroup;

export function pageCollection() {
    return getFirestore().collection("pages") as CollectionReference<IgPage>;
}

export type IdInput = number | string | { id: string | number }

function idString(id: string | number) {
    return (typeof id === "string") ? id : id.toString();
}

export function toId(id: IdInput) {
    return idString((typeof id === "object") ? id.id : id);
}

export function mediaCollectionGroup() {
    return firestore().collectionGroup("medias") as CollectionGroup<IgMedia>;
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
