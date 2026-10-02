document.addEventListener("DOMContentLoaded", function () {

    // ================================
    // Get HTML Elements
    // ================================

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const clearButton = document.getElementById("clear-button");

    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-level");
    const mediumLabel = document.getElementById("medium-level");
    const hardLabel = document.getElementById("hard-level");

    const cardStatsContainer = document.querySelector(".stats-card");


    // ================================
    // Hide Statistics Initially
    // ================================

    statsContainer.style.display = "none";


    // ================================
    // Clear Button
    // ================================

    usernameInput.addEventListener("input", function () {

        if (usernameInput.value.length > 0) {

            clearButton.style.display = "block";

        } else {

            clearButton.style.display = "none";

        }

    });


    clearButton.addEventListener("click", function () {

        usernameInput.value = "";

        clearButton.style.display = "none";

        statsContainer.style.display = "none";

        usernameInput.focus();

    });


    // ================================
    // Validate Username
    // ================================

    function validateUsername(username) {

        if (username.trim() === "") {
            alert("Username should not be empty!");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,30}$/;

        if (!regex.test(username)) {
            alert("Invalid LeetCode username!");
            return false;
        }

        return true;
    }


    // ================================
    // Fetch User Details
    // ================================

    async function fetchUserDetails(username) {

        try {

            searchButton.disabled = true;
            searchButton.innerText = "Loading...";


            const url =
                `https://leetpulse-api.vercel.app/api/leetcode/solved/${encodeURIComponent(username)}`;


            const response = await fetch(url);


            if (!response.ok) {
                throw new Error("User not found");
            }


            const data = await response.json();

            console.log("API Response:", data);


            if (data.error) {
                throw new Error(data.error);
            }


            // ================================
            // Get Solved Problems
            // ================================

            const easySolved = Number(data.easySolved || 0);

            const mediumSolved = Number(data.mediumSolved || 0);

            const hardSolved = Number(data.hardSolved || 0);

            const totalSolved = Number(
                data.solvedProblem ||
                (easySolved + mediumSolved + hardSolved)
            );


            // ================================
            // Total Problems
            // ================================

            let easyTotal = 0;
            let mediumTotal = 0;
            let hardTotal = 0;


            if (Array.isArray(data.allQuestionsCount)) {

                data.allQuestionsCount.forEach(function (item) {

                    if (item.difficulty === "Easy") {
                        easyTotal = Number(item.count);
                    }

                    if (item.difficulty === "Medium") {
                        mediumTotal = Number(item.count);
                    }

                    if (item.difficulty === "Hard") {
                        hardTotal = Number(item.count);
                    }

                });

            }


            // ================================
            // Calculate Progress
            // ================================

            const easyPercentage =
                easyTotal > 0
                    ? (easySolved / easyTotal) * 100
                    : 0;

            const mediumPercentage =
                mediumTotal > 0
                    ? (mediumSolved / mediumTotal) * 100
                    : 0;

            const hardPercentage =
                hardTotal > 0
                    ? (hardSolved / hardTotal) * 100
                    : 0;


            // ================================
            // Update Circles
            // ================================

            easyProgressCircle.style.setProperty(
                "--progress-degree",
                `${easyPercentage}%`
            );

            mediumProgressCircle.style.setProperty(
                "--progress-degree",
                `${mediumPercentage}%`
            );

            hardProgressCircle.style.setProperty(
                "--progress-degree",
                `${hardPercentage}%`
            );


            // ================================
            // Update Labels
            // ================================

            easyLabel.innerText =
                `${easySolved}/${easyTotal}`;

            mediumLabel.innerText =
                `${mediumSolved}/${mediumTotal}`;

            hardLabel.innerText =
                `${hardSolved}/${hardTotal}`;


            // ================================
            // Show Statistics
            // ================================

            statsContainer.style.display = "block";


            // ================================
            // Statistics Cards
            // ================================

            cardStatsContainer.innerHTML = `

                <div class="stats-card-item">
                    <h3>Username</h3>
                    <p>${username}</p>
                </div>

                <div class="stats-card-item">
                    <h3>Total Solved</h3>
                    <p>${totalSolved}</p>
                </div>

                <div class="stats-card-item">
                    <h3>Easy</h3>
                    <p>${easySolved}</p>
                </div>

                <div class="stats-card-item">
                    <h3>Medium</h3>
                    <p>${mediumSolved}</p>
                </div>

                <div class="stats-card-item">
                    <h3>Hard</h3>
                    <p>${hardSolved}</p>
                </div>

            `;


        } catch (error) {

            console.error("Error:", error);

            statsContainer.style.display = "none";

            alert(
                "Unable to find this LeetCode user.\n\n" +
                "Please check the username and try again."
            );

        } finally {

            searchButton.disabled = false;
            searchButton.innerText = "Search";

        }

    }


    // ================================
    // Search Button
    // ================================

    searchButton.addEventListener("click", function () {

        const username = usernameInput.value.trim();


        if (!validateUsername(username)) {
            return;
        }


        fetchUserDetails(username);

    });


    // ================================
    // Enter Key Search
    // ================================

    usernameInput.addEventListener("keypress", function (event) {

        if (event.key === "Enter") {

            const username = usernameInput.value.trim();


            if (!validateUsername(username)) {
                return;
            }


            fetchUserDetails(username);

        }

    });

});