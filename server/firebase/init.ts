import config from "#config";
import {cert, getApps, initializeApp} from "firebase-admin/app";
import {QuerySnapshot} from "@google-cloud/firestore";

declare module "@google-cloud/firestore" {
    interface QuerySnapshot<T> {
        data(): T[];
    }
}
QuerySnapshot.prototype.data = function <T>(this: QuerySnapshot<T>) {
    return this.docs.map(doc => doc.data());
};

export function initFirebase() {
    if (!getApps().length) {
        initializeApp({
            credential: cert({
                projectId: config.FIREBASE_PROJECT_ID,
                clientEmail: config.FIREBASE_CLIENT_EMAIL,
                privateKey: config.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            })
        });
    }
}
