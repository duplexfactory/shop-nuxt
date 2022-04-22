import {cert, getApps, initializeApp} from "firebase-admin/app";
import {Query, QuerySnapshot} from "@google-cloud/firestore";
import {getFirestore} from "firebase-admin/firestore";

declare module "@google-cloud/firestore" {
    interface QuerySnapshot<T> {
        data(): T[];
    }

    interface Query<T> {
        pick<Ks extends keyof T>(...fields: Ks[]): Query<Pick<T, Ks>>
    }
}
QuerySnapshot.prototype.data = function <T>(this: QuerySnapshot<T>) {
    return this.docs.map(doc => doc.data());
};

Query.prototype.pick = function <T, Ks extends keyof T>(this: Query<T>, ...fields: Ks[]) {
    return this.select(...fields as string[]) as Query<Pick<T, Ks>>
};

export function fields<T extends object, Ks extends keyof T>(...fields: Ks[]): Ks[] {
    return fields
}

export function initFirebase() {
    if (!getApps().length) {
        const config = useRuntimeConfig();
        initializeApp({
            credential: cert({
                projectId: config.FIREBASE_PROJECT_ID,
                clientEmail: config.FIREBASE_CLIENT_EMAIL,
                privateKey: config.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
        getFirestore().settings({ ignoreUndefinedProperties: true });
    }
}
