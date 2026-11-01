import { auth } from "./firebase-config.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("account.html");
    } else {
        document.documentElement.hidden = false;
    }
}, (error) => {
    console.error("Authentication error:", error);
    window.location.replace("account.html");
});
