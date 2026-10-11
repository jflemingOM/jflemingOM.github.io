document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("changeThemeBtn");
    const hero = document.getElementById("heroSection");

    const ids = [
        "styleName", "heroTitle", "heroDesc",
        "sec1Title", "sec1Subtitle", "sec2Title", "sec2Subtitle"
    ];

    const grids = ["sec1Grid", "sec2Grid"];
    const originalText = ids.map(id => document.getElementById(id).textContent);
    const originalCards = grids.map(getCards);
    const originalTitle = document.title;
    let snowboarding = false;
    let data;

    button.addEventListener("click", async function () {
        if (!snowboarding) {
            try {
                if (!data) {
                    const response = await fetch("js/boardingData.json");
                    if (!response.ok) throw new Error("JSON failed to load");
                    data = await response.json();
                }

                const values = [
                    data.header, data.hero.headline, data.hero.description,
                    data.sections.overview.title, data.sections.overview.subtitle,
                    data.sections.equipment.title, data.sections.equipment.subtitle
                ];

                ids.forEach((id, i) => {
                    document.getElementById(id).textContent = values[i];
                });

                grids.forEach((grid, i) =>
                    setCards(grid, data.sections[i === 0 ? "overview" : "equipment"].cards)
                );

                document.title = data.title;
                hero.style.setProperty("--hero-img", 'url("img/alpineBoarding.jpg")');
                button.textContent = "Back to Skiing";
                snowboarding = true;
            } catch (error) {
                console.error(error);
            }
        } else {
            ids.forEach((id, i) => {
                document.getElementById(id).textContent = originalText[i];
            });

            grids.forEach((grid, i) => setCards(grid, originalCards[i]));

            document.title = originalTitle;
            hero.style.setProperty("--hero-img", 'url("img/alpineSki.jpeg")');
            button.textContent = "Change";
            snowboarding = false;
        }
    });

    function getCards(grid) {
        return [...document.querySelectorAll(`#${grid} .card`)].map(card => [
            card.querySelector("h3").textContent,
            card.querySelector("p").textContent
        ]);
    }

    function setCards(grid, cards) {
        document.querySelectorAll(`#${grid} .card`).forEach((card, i) => {
            if (cards[i]) {
                card.querySelector("h3").textContent = cards[i].title;
                card.querySelector("p").textContent = cards[i].description;
            }
        });
    }
});