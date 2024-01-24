import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyARJ1qldMhgGK1jNOtlhAkedfaoJ6n69IA",
            authDomain: "blazeburst-a790b.firebaseapp.com",
            databaseURL: "https://blazeburst-a790b-default-rtdb.firebaseio.com",
            projectId: "blazeburst-a790b",
            storageBucket: "blazeburst-a790b.appspot.com",
            messagingSenderId: "958357916417",
            appId: "1:958357916417:web:5a45aeeb902c5dcb2be900"
        };

        const app = initializeApp(firebaseConfig);
        const db = getDatabase();
        const auth = getAuth(app);

        let Email = document.getElementById("email");
        let Password = document.getElementById("password");
        let Username = document.getElementById("username");
        let Main = document.getElementById("main");

        let RegisterUser = e => {

            e.preventDefault();

            createUserWithEmailAndPassword(auth, Email.value, Password.value)
            .then((credentials) => {

                set(ref(db, 'UserAuthList/' + credentials.user.uid), {
                    username: Username.value,
                    email: Email.value,
                    score: 0
                });
                alert('New User Created. Now go to Login Page to Enter the Game.');

            })
            .catch((error) => {

            alert(error.message);

            })
        }

        Main.addEventListener('submit', RegisterUser);