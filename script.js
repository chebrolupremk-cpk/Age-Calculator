// ==============================
// AGE CALCULATOR
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    const dateInput = document.getElementById("dateOfBirth");
    const calculateBtn = document.getElementById("calculateBtn");
    const result = document.getElementById("result");

    if (!dateInput || !calculateBtn || !result) {
        return;
    }

    // Prevent selecting a future date
    const today = new Date();

    const todayYear = today.getFullYear();
    const todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    const todayDay = String(today.getDate()).padStart(2, "0");

    dateInput.max = `${todayYear}-${todayMonth}-${todayDay}`;


    calculateBtn.addEventListener("click", calculateAge);


    function calculateAge() {

        if (!dateInput.value) {

            result.innerHTML = `
                <div class="result-card">
                    <div class="result-value">
                        Please enter your date of birth.
                    </div>
                </div>
            `;

            return;
        }


        // Use the selected date without timezone problems
        const parts = dateInput.value.split("-");

        const birthYear = Number(parts[0]);
        const birthMonth = Number(parts[1]) - 1;
        const birthDay = Number(parts[2]);

        const birthDate = new Date(
            birthYear,
            birthMonth,
            birthDay
        );


        // Check future date
        if (birthDate > today) {

            result.innerHTML = `
                <div class="result-card">
                    <div class="result-value">
                        Date of birth cannot be in the future.
                    </div>
                </div>
            `;

            return;
        }


        // ==============================
        // EXACT AGE
        // ==============================

        let years =
            today.getFullYear() -
            birthDate.getFullYear();

        let months =
            today.getMonth() -
            birthDate.getMonth();

        let days =
            today.getDate() -
            birthDate.getDate();


        if (days < 0) {

            months--;

            const previousMonth =
                new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    0
                );

            days += previousMonth.getDate();
        }


        if (months < 0) {

            years--;
            months += 12;
        }


        // ==============================
        // DAY OF BIRTH
        // ==============================

        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday"
        ];

        const bornDay =
            dayNames[birthDate.getDay()];


        // ==============================
        // NEXT BIRTHDAY
        // ==============================

        let nextBirthday = new Date(
            today.getFullYear(),
            birthMonth,
            birthDay
        );


        if (nextBirthday < today) {

            nextBirthday = new Date(
                today.getFullYear() + 1,
                birthMonth,
                birthDay
            );
        }


        const millisecondsPerDay =
            1000 * 60 * 60 * 24;


        const daysUntilBirthday =
            Math.ceil(
                (nextBirthday - today) /
                millisecondsPerDay
            );


        // ==============================
        // TOTAL DAYS LIVED
        // ==============================

        const totalDays =
            Math.floor(
                (today - birthDate) /
                millisecondsPerDay
            );


        // ==============================
        // DISPLAY RESULTS
        // ==============================

        result.innerHTML = `

            <div class="result-card">

                <div class="result-title">
                    Your Exact Age
                </div>

                <div class="result-value">
                    ${years} Years,
                    ${months} Months,
                    ${days} Days
                </div>

            </div>


            <div class="result-card">

                <div class="result-title">
                    You Were Born On
                </div>

                <div class="result-value">
                    ${bornDay}
                </div>

            </div>


            <div class="result-card">

                <div class="result-title">
                    Days Until Your Next Birthday
                </div>

                <div class="result-value">
                    ${daysUntilBirthday} Days
                </div>

            </div>


            <div class="result-card">

                <div class="result-title">
                    Approximate Total Days Lived
                </div>

                <div class="result-value">
                    ${totalDays.toLocaleString()} Days
                </div>

            </div>

        `;
    }

});