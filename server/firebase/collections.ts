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

export function mediaCollection(id: number) {
    return pageCollection().doc(id.toString()).collection("medias") as CollectionReference<IgMedia>;
}

export function trayCollection(id: number) {
    return pageCollection().doc(id.toString()).collection("trays") as CollectionReference<IgTray>;
}

export function storyCollection(id: number) {
    return pageCollection().doc(id.toString()).collection("stories") as CollectionReference<IgStory>;
}
