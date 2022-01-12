import {shopCollection} from "~/server/firebase/collections";

export default async () => {
  return {
    hot: await shopCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("followerCount", "desc")
      .limit(5)
      .get()
      .then(ss => ss.data()),
    latest: await shopCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("lastActivity", "desc")
      .limit(12)
      .get()
      .then(ss => ss.data()),
    active: await shopCollection()
      .where("deleted", "==", false)
      .where("private", "==", false)
      .orderBy("activeScore", "desc")
      .limit(12)
      .get()
      .then(ss => ss.data()),
  };
}
