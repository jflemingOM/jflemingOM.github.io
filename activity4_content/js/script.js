document.addEventListener("DOMContentLoaded", function () {
    const changeButton = document.getElementById("changeThemeBtn");
    const heroSection = document.getElementById("heroSection");

    let isSnowboarding = false;
    let snowboardingData = null;

    const skiingContent = {
        title: document.title,
        header: document.getElementById("styleName").textContent,
        heroTitle: document.getElementById("heroTitle").textContent,
        heroDesc: document.getElementById("heroDesc").textContent,
        sec1Title: document.getElementById("sec1Title").textContent,
        sec1Subtitle: document.getElementById("sec1Subtitle").textContent,
        sec2Title: document.getElementById("sec2Title").textContent,
        sec2Subtitle: document.getElementById("sec2Subtitle").textContent,
        sec1Cards: getCards("sec1Grid"),
        sec2Cards: getCards("sec2Grid")
    };

    const skiingImage = new URL("img/alpineSki.jpeg", document.baseURI).href;

    changeButton.addEventListener("click", async function () {
        if (isSnowboarding) {
            document.title = skiingContent.title;
            document.getElementById("styleName").textContent = skiingContent.header;
            document.getElementById("heroTitle").textContent = skiingContent.heroTitle;
            document.getElementById("heroDesc").textContent = skiingContent.heroDesc;
            document.getElementById("sec1Title").textContent = skiingContent.sec1Title;
            document.getElementById("sec1Subtitle").textContent = skiingContent.sec1Subtitle;
            document.getElementById("sec2Title").textContent = skiingContent.sec2Title;
            document.getElementById("sec2Subtitle").textContent = skiingContent.sec2Subtitle;

            setCards("sec1Grid", skiingContent.sec1Cards);
            setCards("sec2Grid", skiingContent.sec2Cards);

            heroSection.style.setProperty("--hero-img", `url("${skiingImage}")`);

            isSnowboarding = false;
            changeButton.textContent = "Change";
            return;
        }

        try {
            changeButton.disabled = true;

            if (!snowboardingData) {
                const response = await fetch("js/boardingData.json");

                if (!response.ok) {
                    throw new Error("Could not load the JSON file.");
                }

                snowboardingData = await response.json();
            }

            const data = snowboardingData;

            document.title = data.title;
            document.getElementById("styleName").textContent = data.header;
            document.getElementById("heroTitle").textContent = data.hero.headline;
            document.getElementById("heroDesc").textContent = data.hero.description;
            document.getElementById("sec1Title").textContent = data.sections.overview.title;
            document.getElementById("sec1Subtitle").textContent = data.sections.overview.subtitle;
            document.getElementById("sec2Title").textContent = data.sections.equipment.title;
            document.getElementById("sec2Subtitle").textContent = data.sections.equipment.subtitle;

            setCards("sec1Grid", data.sections.overview.cards);
            setCards("sec2Grid", data.sections.equipment.cards);

            const snowboardingImage = new URL(
                "img/alpineBoarding.jpg",
                document.baseURI
            ).href;

            heroSection.style.setProperty(
                "--hero-img",
                `url("${snowboardingImage}")`
            );

            isSnowboarding = true;
            changeButton.textContent = "Back to Skiing";
        } catch (error) {
            console.error("Error loading snowboarding data:", error);
            alert("Could not load the snowboarding data. Make sure you are using Live Server.");
        } finally {
            changeButton.disabled = false;
        }
    });
});

function getCards(gridId) {
    return Array.from(document.querySelectorAll(`#${gridId} .card`)).map(function (card) {
        return {
            title: card.querySelector("h3").textContent,
            description: card.querySelector("p").textContent
        };
    });
}

function setCards(gridId, cards) {
    const cardElements = document.querySelectorAll(`#${gridId} .card`);

    cardElements.forEach(function (card, index) {
        if (cards[index]) {
            card.querySelector("h3").textContent = cards[index].title;
            card.querySelector("p").textContent = cards[index].description;
        }
    });
}