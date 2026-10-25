
const form = document.getElementById("signup-form");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const dobInput = document.getElementById("dob");
const submitButton = document.getElementById("submit-btn");
const feedback = document.getElementById("form-feedback");

document.getElementById("year").textContent = new Date().getFullYear();

// Do not allow a future date of birth.
dobInput.max = new Date().toISOString().split("T")[0];

function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);

    errorElement.textContent = message;
    input.setAttribute("aria-invalid", "true");
}

function clearError(input, errorId) {
    const errorElement = document.getElementById(errorId);

    errorElement.textContent = "";
    input.removeAttribute("aria-invalid");
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.hidden = false;
    feedback.focus();
}

function hideFeedback() {
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
}

function validateEmail() {
    const email = emailInput.value.trim();

    if (!email) {
        showError(emailInput, "email-error", "Please enter your email address.");
        return false;
    }

    if (!emailInput.checkValidity()) {
        showError(emailInput, "email-error", "Please enter a valid email address.");
        return false;
    }

    clearError(emailInput, "email-error");
    return true;
}

function validatePassword() {
    const password = passwordInput.value;

    if (!password) {
        showError(passwordInput, "password-error", "Please enter a password.");
        return false;
    }

    const strongPassword =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password);

    if (!strongPassword) {
        showError(
            passwordInput,
            "password-error",
            "Use at least 8 characters, including uppercase, lowercase, a number and a symbol."
        );
        return false;
    }

    clearError(passwordInput, "password-error");
    return true;
}

function validateConfirmPassword() {
    if (!confirmPasswordInput.value) {
        showError(
            confirmPasswordInput,
            "confirm-error",
            "Please confirm your password."
        );
        return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(
            confirmPasswordInput,
            "confirm-error",
            "Passwords do not match."
        );
        return false;
    }

    clearError(confirmPasswordInput, "confirm-error");
    return true;
}

function validateDob() {
    if (!dobInput.value) {
        showError(dobInput, "dob-error", "Please select your date of birth.");
        return false;
    }

    const selectedDate = new Date(`${dobInput.value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(selectedDate.getTime()) || selectedDate > today) {
        showError(
            dobInput,
            "dob-error",
            "Date of birth cannot be in the future."
        );
        return false;
    }

    clearError(dobInput, "dob-error");
    return true;
}

function validateGender() {
    const selectedGender = form.querySelector('input[name="gender"]:checked');
    const errorElement = document.getElementById("gender-error");

    if (!selectedGender) {
        errorElement.textContent = "Please select your gender.";
        return false;
    }

    errorElement.textContent = "";
    return true;
}

function validateTerms() {
    const terms = document.getElementById("terms");
    const errorElement = document.getElementById("terms-error");

    if (!terms.checked) {
        errorElement.textContent = "Please accept the Terms and Conditions.";
        terms.setAttribute("aria-invalid", "true");
        return false;
    }

    errorElement.textContent = "";
    terms.removeAttribute("aria-invalid");
    return true;
}

// Validate fields when the user finishes editing them.
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
dobInput.addEventListener("change", validateDob);

passwordInput.addEventListener("input", () => {
    if (passwordInput.value) {
        validatePassword();
    }

    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});

confirmPasswordInput.addEventListener("input", () => {
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});

form.querySelectorAll('input[name="gender"]').forEach((radio) => {
    radio.addEventListener("change", validateGender);
});

document.getElementById("terms").addEventListener("change", validateTerms);

form.addEventListener("input", hideFeedback);
form.addEventListener("change", hideFeedback);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const validations = [
        validateEmail(),
        validatePassword(),
        validateConfirmPassword(),
        validateDob(),
        validateGender(),
        validateTerms()
    ];

    if (validations.includes(false)) {
        showFeedback(
            "Please correct the highlighted errors and try again.",
            "error"
        );

        const firstInvalid = form.querySelector('[aria-invalid="true"]');

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    showFeedback(
        "Signup form completed successfully! This is a front-end demo; your details have not been saved to a server.",
        "success"
    );

    // This demo does not send data to a backend.
    // Connect a secure backend/API to create real user accounts.
});
