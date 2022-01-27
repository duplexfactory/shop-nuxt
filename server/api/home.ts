import {pageCollection} from "~/server/firebase/collections";

export default async () => {
    const [hot, latest, active, physical] = await Promise.all([
        pageCollection()
            .where("deleted", "==", false)
            .where("private", "==", false)
            .orderBy("followerCount", "desc")
            .limit(5)
            .get()
            .then(ss => ss.data()),
        pageCollection()
            .orderBy("lastMedia", "desc")
            .limit(12)
            .get()
            .then(async (ss) => ss.data().map(igPage => ({
                ...igPage.medias[0],
                igPage
            }))),
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
