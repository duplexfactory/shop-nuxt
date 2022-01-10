import {getFirestore} from "firebase-admin/firestore";

export default async () => {
  const l = await getFirestore().listCollections();
  return {
    cols: l.map(c => c.id)
  };
}
