
"use strict";

const DATA_FILE = "JS/exercises.json";
const MUSCLE_IMAGES = {
    Chest: "img/CHESTOVERVIEW.png",
    Back: "img/BACKOVERVIEW.png",
    Arms: "img/ARMSOVERVIEW.png",
    Legs: "img/LEGOVERVIEW.png",
    Shoulders: "img/SHOULDERSOVERVIEW.png"
};

const main = document.querySelector("main");
let exerciseData = {};

// Creates the section that will display the interactive content.
function createExplorerSection() {
    const section = document.createElement("section");
    section.className = "section";
    section.id = "exercise-explorer";
    main.replaceChildren(section);
    return section;
}

const explorerSection = main ? createExplorerSection() : null;

// Displays a heading and description for the current screen.
function addPageHeading(title, description) {
    const heading = document.createElement("h1");
    heading.className = "section-heading";
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.className = "section-intro";
    paragraph.textContent = description;

    explorerSection.append(heading, paragraph);
}

// Displays loading messages and errors.
function showMessage(message, isError = false) {
    explorerSection.replaceChildren();

    addPageHeading(
        isError ? "Unable to Load Exercises" : "Exercise Explorer",
        message
    );

    const paragraph = explorerSection.querySelector(".section-intro");
    paragraph.setAttribute("role", isError ? "alert" : "status");
    paragraph.setAttribute("aria-live", "polite");

    if (isError) {
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "back-button";
        retryButton.textContent = "Try Again";
        retryButton.addEventListener("click", loadExercises);
        explorerSection.append(retryButton);
    }
}

// Creates a clickable card for a muscle group or exercise.
function createCard(title, imagePath, imageAlt, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "muscle-card explorer-card";
    button.addEventListener("click", onClick);

    if (imagePath) {
        const image = document.createElement("img");
        image.src = imagePath;
        image.alt = imageAlt || title;
        image.loading = "lazy";
        image.addEventListener("error", () => image.remove());
        button.append(image);
    }

    const heading = document.createElement("h2");
    heading.textContent = title;
    button.append(heading);

    return button;
}

// Creates a button to return to the previous selection.
function createBackButton(label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "back-button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}

// Displays all five muscle groups.
function showMuscleGroups() {
    explorerSection.replaceChildren();

    addPageHeading(
        "Exercise Explorer",
        "Select a muscle group to explore exercises, instructions, and the muscles involved."
    );

    const grid = document.createElement("div");
    grid.className = "muscle-grid";

    Object.keys(exerciseData).forEach((muscle) => {
        grid.append(
            createCard(
                muscle,
                MUSCLE_IMAGES[muscle],
                muscle + " muscles",
                () => showExercises(muscle)
            )
        );
    });

    explorerSection.append(grid);
}

// Displays exercises belonging to the selected muscle group.
function showExercises(muscle) {
    explorerSection.replaceChildren();

    explorerSection.append(
        createBackButton("All Muscle Groups", showMuscleGroups)
    );

    addPageHeading(
        muscle + " Exercises",
        "Choose an exercise to view its demonstration, instructions, and muscle information."
    );

    const grid = document.createElement("div");
    grid.className = "muscle-grid";

    exerciseData[muscle].forEach((exercise) => {
        grid.append(
            createCard(
                exercise.name,
                exercise.gif,
                exercise.gifAlt || exercise.name,
                () => showExerciseDetails(muscle, exercise)
            )
        );
    });

    explorerSection.append(grid);
}

// Displays a labeled list of muscles.


function addMuscleList(container, title, muscles) {
    const heading = document.createElement("h2");
    heading.textContent = title;

    const list = document.createElement("ul");

    (muscles || []).forEach((muscle) => {
        const item = document.createElement("li");
        item.textContent = muscle;
        list.append(item);
    });

    container.append(heading, list);
}



// Displays the selected exercise's complete information.
function showExerciseDetails(muscle, exercise) {
    explorerSection.replaceChildren();

    explorerSection.append(
        createBackButton(
            "Back to " + muscle + " Exercises",
            () => showExercises(muscle)
        )
    );

    addPageHeading(
        exercise.name,
        "Exercise instructions and muscle information."
    );

    const images = document.createElement("div");
    images.className = "exercise-images";

    if (exercise.image) {
        const anatomyImage = document.createElement("img");
        anatomyImage.src = exercise.image;
        anatomyImage.alt = exercise.imageAlt || exercise.name + " muscle diagram";
        anatomyImage.loading = "lazy";
        anatomyImage.addEventListener("error", () => anatomyImage.remove());
        images.append(anatomyImage);
    }

    if (exercise.gif) {
        const exerciseGif = document.createElement("img");
        exerciseGif.src = exercise.gif;
        exerciseGif.alt = exercise.gifAlt || exercise.name + " demonstration";
        exerciseGif.loading = "lazy";
        exerciseGif.addEventListener("error", () => exerciseGif.remove());
        images.append(exerciseGif);
    }

    explorerSection.append(images);

    const information = document.createElement("section");
    information.className = "exercise-information";

    const instructionsHeading = document.createElement("h2");
    instructionsHeading.textContent = "How to Perform";
    information.append(instructionsHeading);

    (exercise.howToPerform || []).forEach((instruction) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = instruction;
        information.append(paragraph);
    });

    explorerSection.append(information);

    
    const muscles = document.createElement("section");
    muscles.className = "exercise-information";

    addMuscleList(muscles, "Primary Muscles", exercise.primaryMuscles);
    addMuscleList(muscles, "Secondary Muscles", exercise.secondaryMuscles);

    explorerSection.append(muscles);

}

// Loads the exercise information from the external JSON file.
async function loadExercises() {
    if (!explorerSection) {
        return;
    }

    showMessage("Loading exercise information...");

    try {
        const response = await fetch(DATA_FILE);

        if (!response.ok) {
            throw new Error("The exercise data file could not be loaded.");
        }

        const data = await response.json();

        if (
            !data ||
            typeof data !== "object" ||
            Array.isArray(data) ||
            Object.keys(data).length === 0
        ) {
            throw new Error("The exercise data is invalid or empty.");
        }

        Object.values(data).forEach((exercises) => {
            if (!Array.isArray(exercises)) {
                throw new Error("The exercise data has an invalid format.");
            }
        });

        exerciseData = data;
        showMuscleGroups();
    } catch (error) {
        showMessage(
            "Exercise information could not be loaded.",
            true
        );
    }
}

// Starts loading the exercise data when the script runs.
loadExercises();
