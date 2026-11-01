/* =========================================================
   Contador global de tsurus — Firebase Firestore
   Documento: contadores/tsurus  →  { total: <número> }
   Avisa o main.js pelo evento "tsurus:total" e expõe window.tsuruStore.increment()
   ========================================================= */
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";

if (firebaseConfig.apiKey) {
  try {
    const [{ initializeApp }, fs] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-firestore.js`),
    ]);
    const db = fs.getFirestore(initializeApp(firebaseConfig));
    const ref = fs.doc(db, "contadores", "tsurus");

    window.tsuruStore = {
      // increment() é atômico no servidor: cliques simultâneos não se perdem
      increment: () => fs.setDoc(ref, { total: fs.increment(1) }, { merge: true }),
    };

    fs.onSnapshot(ref, (snap) => {
      const total = (snap.exists() && snap.data().total) || 0;
      window.dispatchEvent(new CustomEvent("tsurus:total", { detail: total }));
    }, (err) => console.warn("Contador de tsurus indisponível:", err.message));
  } catch (err) {
    console.warn("Não foi possível carregar o Firebase:", err);
  }
}
