const button = document.getElementById("calculateBtn");

button.addEventListener("click", function () {

    const dobInput = document.getElementById("dateOfBirth").value;
    const result = document.getElementById("result");

    // Check if date is entered
    if (dobInput === "") {
        result.innerHTML = `
            <div class="result-card">
                <div class="result-value">
                    Please enter your date of birth.
                </div>
            </div>
        `;
        return;
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Convert selected date
    const [year, month, day] = dobInput.split("-").map(Number);

    const dob = new Date(year, month - 1, day);
    dob.setHours(0, 0, 0, 0);

    // Prevent future dates
    if (dob > today) {
        result.innerHTML = `
            <div class="result-card">
                <div class="result-value">
                    Date of birth cannot be in the future.
                </div>
            </div>
        `;
        return;
    }

    // Calculate age
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;

        const previousMonth = new Date(
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

    // Day of birth
    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];

    const birthDay = dayNames[dob.getDay()];

    // Next birthday
    let nextBirthday = new Date(
        today.getFullYear(),
        dob.getMonth(),
        dob.getDate()
    );

    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }

    // Days until next birthday
    const difference = nextBirthday - today;

    const daysUntilBirthday = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

    // Total days lived
    const totalDifference = today - dob;

    const totalDays = Math.floor(
        totalDifference / (1000 * 60 * 60 * 24)
    );

    // Display results
    result.innerHTML = `
        <div class="result-card">
            <div class="result-title">Your Age</div>
            <div class="result-value">
                ${years} Years · ${months} Months · ${days} Days
            </div>
        </div>

        <div class="result-card">
            <div class="result-title">Born On</div>
            <div class="result-value">
                ${birthDay}
            </div>
        </div>

        <div class="result-card">
            <div class="result-title">Next Birthday</div>
            <div class="result-value">
                ${daysUntilBirthday} Days
            </div>
        </div>

        <div class="result-card">
            <div class="result-title">Total Days Lived</div>
            <div class="result-value">
                ${totalDays.toLocaleString()} Days
            </div>
        </div>
    `;

});