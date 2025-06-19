
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
  import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

//add your firebase configuration
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  // Login button event
  document.getElementById("btn").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const dbRef = ref(db);

      console.log("Logged in UID:", uid);

      const memberSnap = await get(child(dbRef,`members/${uid}`));
      const adminSnap = await get(child(dbRef, `users/${uid}`));

      if (memberSnap.exists()) {
        alert("Logged in as Member");
        window.location.href = "members.html";
      } else if (adminSnap.exists()) {
        alert("Logged in as Admin");
        window.location.href = "main.html";
      } else {
        alert("User role not found in database.");
        console.log("UID not found in members or users node.");
      }

    } catch (error) {
      alert("Login error: " + error.message);
      console.error("Login error:", error);
    }
  });
