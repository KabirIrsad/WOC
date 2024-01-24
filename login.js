import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, get, ref, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const dbRef = ref(db);

let Email = document.getElementById("email");
let Password = document.getElementById("password");
let Main = document.getElementById("main");

let SignInUser = e => {

    e.preventDefault();

    signInWithEmailAndPassword(auth, Email.value, Password.value)
    .then((credentials) => {

        get(child(dbRef, 'UserAuthList/' + credentials.user.uid)).then((snapshot) => {
            if (snapshot.exists){
                sessionStorage.setItem("user-info", JSON.stringify({
                    username: snapshot.val().username,
                    email: snapshot.val().email,
                    score: snapshot.val().score
                }))
                sessionStorage.setItem("user-cred", JSON.stringify(credentials.user));
                window.location.href = 'index.html';
            }
        });
    })
    .catch((error) => {

        alert(error.message);

    });
}

Main.addEventListener('submit', SignInUser);
