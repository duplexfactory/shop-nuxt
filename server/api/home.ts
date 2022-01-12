import {pageCollection} from "~/server/firebase/collections";

export default async () => {
  return {
    hot: await pageCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("followerCount", "desc")
      .limit(5)
      .get()
      .then(ss => ss.data()),
    latest: await pageCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("lastActivity", "desc")
      .limit(12)
      .get()
      .then(ss => ss.data()),
    active: await pageCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("activeScore", "desc")
      .limit(12)
      .get()
      .then(ss => ss.data()),
  };
}
