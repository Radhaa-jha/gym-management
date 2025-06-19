
  // Import Firebase modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
  import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

  //add your firebase configuration
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

  // Form submission
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirmPassword = document.getElementById("regConfirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Register user with Firebase Auth
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        // Save additional user data to Firebase Realtime Database
        set(ref(database, "users/" + uid), {
          name: name,
          email: email,
          phone: phone,
          role: "member", // Optional role field for gym
          createdAt: new Date().toISOString()
        });

        alert("Registration successful!");
        window.location.href="login.html"
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert("Error: " + error.message);
      });
  });
