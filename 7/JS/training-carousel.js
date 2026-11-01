"use strict";

// Sets up independent previous/next controls for each training topic section.
function setupTrainingCarousels() {
    const cardGrids = document.querySelectorAll(".training-card-grid");

    cardGrids.forEach((cardGrid) => {
        const cards = Array.from(cardGrid.querySelectorAll(".training-card"));

        if (cards.length === 0) {
            return;
        }

        let currentCard = 0;
        const controls = document.createElement("div");
        controls.className = "training-carousel-controls";

        const previousButton = document.createElement("button");
        previousButton.type = "button";
        previousButton.className = "training-carousel-button";
        previousButton.textContent = "Previous";
        previousButton.setAttribute("aria-label", "Previous card");

        const counter = document.createElement("span");
        counter.className = "training-carousel-counter";
        counter.setAttribute("aria-live", "polite");

        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.className = "training-carousel-button";
        nextButton.textContent = "Next";
        nextButton.setAttribute("aria-label", "Next card");

        controls.append(previousButton, counter, nextButton);
        cardGrid.after(controls);

        // Shows one card and updates the navigation controls.
        function showCard(index) {
            currentCard = (index + cards.length) % cards.length;

            cards.forEach((card, cardIndex) => {
                card.hidden = cardIndex !== currentCard;
            });

            counter.textContent = `${currentCard + 1} of ${cards.length}`;
            previousButton.disabled = cards.length < 2;
            nextButton.disabled = cards.length < 2;
        }

        previousButton.addEventListener("click", () => {
            showCard(currentCard - 1);
        });

        nextButton.addEventListener("click", () => {
            showCard(currentCard + 1);
        });

        showCard(0);
    });
}

document.addEventListener("DOMContentLoaded", setupTrainingCarousels);
