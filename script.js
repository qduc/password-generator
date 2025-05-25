function generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';

    let characters = '';
    if (includeLowercase) characters += lowercase;
    if (includeUppercase) characters += uppercase;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (characters.length === 0) {
        // This case should ideally be caught by the validation before calling this function
        return 'Error: No character types selected.';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    return password;
}

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const lengthInput = document.getElementById('length');
    const numPasswordsInput = document.getElementById('numPasswords'); // New input
    const includeLowercaseCheckbox = document.getElementById('includeLowercase');
    const includeUppercaseCheckbox = document.getElementById('includeUppercase');
    const includeNumbersCheckbox = document.getElementById('includeNumbers');
    const includeSymbolsCheckbox = document.getElementById('includeSymbols');
    const passwordsTextarea = document.getElementById('passwords');
    const copyAllBtn = document.getElementById('copyAllBtn'); // New button
    const errorMessageDiv = document.getElementById('errorMessage'); // New div

    generateBtn.addEventListener('click', function() {
        const length = parseInt(lengthInput.value, 10);
        const numPasswords = parseInt(numPasswordsInput.value, 10); // Read number of passwords
        const includeLowercase = includeLowercaseCheckbox.checked;
        const includeUppercase = includeUppercaseCheckbox.checked;
        const includeNumbers = includeNumbersCheckbox.checked;
        const includeSymbols = includeSymbolsCheckbox.checked;

        // Clear previous error message
        errorMessageDiv.textContent = '';
        errorMessageDiv.classList.add('hidden'); // Hide error message div

        // Basic validation: ensure at least one type is selected
        if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
             errorMessageDiv.textContent = 'Error: Select at least one character type.';
             errorMessageDiv.classList.remove('hidden'); // Show error message div
             passwordsTextarea.value = ''; // Clear textarea
             return;
        }

        // Basic validation: ensure length is valid
        if (length < 4 || length > 128 || isNaN(length)) {
            errorMessageDiv.textContent = 'Error: Password length must be between 4 and 128.';
            errorMessageDiv.classList.remove('hidden');
            passwordsTextarea.value = '';
            return;
        }

        // Basic validation: ensure number of passwords is valid
        if (numPasswords < 1 || numPasswords > 20 || isNaN(numPasswords)) { // Limit to 20 for performance/UI
             errorMessageDiv.textContent = 'Error: Number of passwords must be between 1 and 20.';
             errorMessageDiv.classList.remove('hidden');
             passwordsTextarea.value = '';
             return;
        }


        const generatedPasswords = [];

        for (let i = 0; i < numPasswords; i++) { // Use numPasswords variable
            generatedPasswords.push(generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols));
        }

        // Set the textarea value to the generated passwords, separated by newlines
        passwordsTextarea.value = generatedPasswords.join('\n');

        // Scroll to the bottom of the textarea to show the latest passwords
        passwordsTextarea.scrollTop = passwordsTextarea.scrollHeight;

        // Enable copy button if passwords were generated
        if (generatedPasswords.length > 0) {
            copyAllBtn.classList.remove('hidden');
        } else {
            copyAllBtn.classList.add('hidden');
        }
    });

    // Add event listener for the Copy All button
    copyAllBtn.addEventListener('click', function() {
        passwordsTextarea.select();
        passwordsTextarea.setSelectionRange(0, 99999); // For mobile devices

        try {
            navigator.clipboard.writeText(passwordsTextarea.value);
            // Optional: Provide feedback to the user that text was copied
            // alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optional: Provide feedback that copying failed
            // alert('Failed to copy passwords.');
        }
    });

    // Initially hide the copy button and error message div
    copyAllBtn.classList.add('hidden');
    errorMessageDiv.classList.add('hidden');
});
