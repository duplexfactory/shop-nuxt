import {mediaCollectionGroup, pageCollection} from "~/server/firebase/collections";
import IgPage from "~/models/IgPage";

export default async () => {
    const [hot, latest, active, physical] = await Promise.all([
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .orderBy("followerCount", "desc")
            .limit(5)
            .get()
            .then(ss => ss.data()),
        mediaCollectionGroup()
            .orderBy("takenAt", "desc")
            .limit(12)
            .get()
            .then(async (ss) => {
                return await Promise.all(ss.docs.map(async (docSS) => {
                    const igPage = await docSS.ref.parent.parent.get().then((igPageSS) => igPageSS.data()) as IgPage;
                    return {
                        ...docSS.data(),
                        igPage
                    }
                }));
            }),
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .orderBy("activeScore", "desc")
            .limit(12)
            .get()
            .then(ss => ss.data()),
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .where("brickAndMortar", "==", true)
            .orderBy("activeScore", "desc")
            .limit(12)
            .get()
            .then(ss => ss.data())
    ])

    return {
        hot,
        latest,
        active,
        physical,
    };
}
