
import { auth } from "./firebase-config.js";
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const $ = (id) => document.getElementById(id);
const message = $("account-message");
let busy = false;

function showMessage(text, kind = "") {
    message.textContent = text;
    message.dataset.kind = kind;
}

function showMode(mode) {
    $("login-form").hidden = mode !== "login";
    $("signup-form").hidden = mode !== "signup";
    $("show-login").setAttribute("aria-pressed", String(mode === "login"));
    $("show-signup").setAttribute("aria-pressed", String(mode === "signup"));
    showMessage("");
}

function setBusy(value) {
    busy = value;
    document.querySelectorAll("#signed-out button, #signed-in button").forEach((button) => {
        button.disabled = value;
    });
}

async function runAction(action, progressMessage, successMessage = "") {
    if (busy) return;
    setBusy(true);
    showMessage(progressMessage);

    try {
        await action();
        showMessage(successMessage, "success");
    } catch (error) {
        const readable = {
            "auth/email-already-in-use": "An account already exists with that email address.",
            "auth/invalid-email": "Enter a valid email address.",
            "auth/invalid-credential": "Incorrect email or password.",
            "auth/weak-password": "Choose a stronger password (at least 6 characters).",
            "auth/too-many-requests": "Too many attempts. Please try again later.",
            "auth/network-request-failed": "Network error. Check your internet connection and try again.",
            "auth/operation-not-allowed": "Email/password sign-in is not enabled in Firebase."
        };

        showMessage(
            readable[error.code] || error.message || "Something went wrong. Please try again.",
            "error"
        );
    } finally {
        setBusy(false);
    }
}

$("show-login").addEventListener("click", () => showMode("login"));
$("show-signup").addEventListener("click", () => showMode("signup"));

$("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    runAction(async () => {
        await signInWithEmailAndPassword(
            auth,
            $("login-email").value.trim(),
            $("login-password").value
        );
        $("login-form").reset();
    }, "Logging in...", "Logged in successfully.");
});

$("signup-form").addEventListener("submit", (event) => {
    event.preventDefault();

    if ($("signup-password").value !== $("signup-confirm").value) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    runAction(async () => {
        await createUserWithEmailAndPassword(
            auth,
            $("signup-email").value.trim(),
            $("signup-password").value
        );
        $("signup-form").reset();
    }, "Creating your account...", "Account created successfully.");
});

$("password-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const current = $("current-password").value;
    const next = $("new-password").value;

    if (next !== $("confirm-new-password").value) {
        showMessage("New passwords do not match.", "error");
        return;
    }

    runAction(async () => {
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("You must be logged in to change your password.");
        }

        const credential = EmailAuthProvider.credential(user.email, current);

        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, next);

        $("password-form").reset();
    }, "Updating password...", "Your password was changed successfully.");
});

$("logout-button").addEventListener("click", () => {
    runAction(
        () => signOut(auth),
        "Logging out...",
        "You have logged out."
    );
});

onAuthStateChanged(auth, (user) => {
    $("account-loading").hidden = true;
    $("signed-out").hidden = Boolean(user);
    $("signed-in").hidden = !user;
    $("account-email").textContent = user?.email || "";
}, (error) => {
    $("account-loading").textContent = "Unable to check your login status.";
    showMessage(error.message, "error");
});
