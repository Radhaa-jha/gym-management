// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// add your Firebase configuration
//  Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Form handling
const form = document.getElementById("memberForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value;
  const plan = document.getElementById("plan").value;
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !age || !plan || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // ✅ Save under members/{uid}
      const memberRef = ref(database, "members/" + user.uid);
      return set(memberRef, {
        uid: user.uid,
        name,
        age,
        plan,
        email,
        timestamp: new Date().toISOString()
      });
    })
    .then(() => {
      alert("Member added and account created successfully!");
      form.reset();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Error: " + error.message);
    });
});