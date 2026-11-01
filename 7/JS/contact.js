
"use strict";

import { auth, db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const form = document.querySelector(".contact-form");
const status = document.getElementById("contact-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
        return;
    }

    if (!auth.currentUser) {
        status.textContent = "You must be logged in to submit the form.";
        return;
    }

    submitButton.disabled = true;
    status.textContent = "Submitting your message...";

    const formData = new FormData(form);

    try {
        await addDoc(collection(db, "contactSubmissions"), {
            name: formData.get("name").trim(),
            phone: formData.get("phone").trim(),
            email: formData.get("email").trim(),
            message: formData.get("message").trim(),
            userId: auth.currentUser.uid,
            createdAt: serverTimestamp()
        });

        status.textContent = "Your message was submitted successfully!";
        form.reset();

    } catch (error) {
        console.error("Contact form error:", error);
        status.textContent = "Unable to submit your message. Please try again.";

    } finally {
        submitButton.disabled = false;
    }
});
