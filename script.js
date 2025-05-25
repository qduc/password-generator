let passwordHistory = [];

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
    
    // Check if all required character types are included
    let hasLower = !includeLowercase || /[a-z]/.test(password);
    let hasUpper = !includeUppercase || /[A-Z]/.test(password);
    let hasNumber = !includeNumbers || /[0-9]/.test(password);
    let hasSymbol = !includeSymbols || /[^a-zA-Z0-9]/.test(password);
    
    // If any required type is missing, regenerate the password
    if (!(hasLower && hasUpper && hasNumber && hasSymbol) && length >= 4) {
        return generatePassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols);
    }

    return password;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Return strength level: 0-3 (weak), 4-5 (medium), 6-7 (strong)
    if (strength <= 3) return "weak";
    if (strength <= 5) return "medium";
    return "strong";
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
    
    // Load password history from localStorage
    const savedHistory = localStorage.getItem('passwordHistory');
    if (savedHistory) {
        passwordHistory = JSON.parse(savedHistory);
    }
    
    // Add a history button
    const historyBtn = document.createElement('button');
    historyBtn.id = 'historyBtn';
    historyBtn.className = 'ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded text-sm';
    historyBtn.textContent = 'Show History';
    copyAllBtn.parentNode.insertBefore(historyBtn, copyAllBtn.nextSibling);

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

        // Store the new passwords in history (limit to last 50)
        passwordHistory = [...generatedPasswords, ...passwordHistory].slice(0, 50);
        localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));

        // Clear the textarea first
        passwordsTextarea.value = '';
        
        // Create container for individual password elements
        const passwordsContainer = document.createElement('div');
        passwordsContainer.className = 'passwords-container';

        generatedPasswords.forEach((password, index) => {
            const passwordRow = document.createElement('div');
            passwordRow.className = 'flex items-center justify-between mb-2 bg-gray-100 p-2 rounded';
            
            const passwordText = document.createElement('code');
            passwordText.className = 'font-mono text-sm flex-grow';
            passwordText.textContent = password;
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'ml-2 bg-gray-300 hover:bg-gray-400 text-xs px-2 py-1 rounded';
            copyBtn.textContent = 'Copy';
            copyBtn.onclick = function() {
                navigator.clipboard.writeText(password);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
            };
            
            passwordRow.appendChild(passwordText);
            passwordRow.appendChild(copyBtn);
            passwordsContainer.appendChild(passwordRow);
            
            // Also add to textarea for the copy all functionality
            passwordsTextarea.value += password + '\n';
        });

        // Replace textarea with our container
        const existingContainer = document.querySelector('.passwords-container');
        if (existingContainer) {
            existingContainer.remove();
        }
        passwordsTextarea.parentNode.insertBefore(passwordsContainer, passwordsTextarea.nextSibling);
        passwordsTextarea.classList.add('hidden'); // Hide the textarea

        // Enable copy button if passwords were generated
        if (generatedPasswords.length > 0) {
            copyAllBtn.classList.remove('hidden');
            
            // Show password strength for the first password
            const strength = calculatePasswordStrength(generatedPasswords[0]);
            const strengthBar = document.getElementById('strengthBar');
            const strengthText = document.getElementById('strengthText');
            const strengthIndicator = document.getElementById('strengthIndicator');
            
            strengthIndicator.classList.remove('hidden');
            strengthText.textContent = `${strength.charAt(0).toUpperCase() + strength.slice(1)}`;
            
            // Reset classes
            strengthBar.className = 'h-2 w-full rounded';
            
            // Add appropriate color class
            if (strength === 'weak') {
                strengthBar.classList.add('bg-red-500');
                strengthText.className = 'text-sm mt-1 text-red-500';
            } else if (strength === 'medium') {
                strengthBar.classList.add('bg-yellow-500');
                strengthText.className = 'text-sm mt-1 text-yellow-600';
            } else {
                strengthBar.classList.add('bg-green-500');
                strengthText.className = 'text-sm mt-1 text-green-600';
            }
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
            // Provide visual feedback
            const originalText = copyAllBtn.textContent;
            copyAllBtn.textContent = 'Copied!';
            copyAllBtn.classList.add('bg-green-500', 'text-white');
            
            setTimeout(() => {
                copyAllBtn.textContent = originalText;
                copyAllBtn.classList.remove('bg-green-500', 'text-white');
            }, 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            copyAllBtn.textContent = 'Failed!';
            copyAllBtn.classList.add('bg-red-500', 'text-white');
            
            setTimeout(() => {
                copyAllBtn.textContent = 'Copy All';
                copyAllBtn.classList.remove('bg-red-500', 'text-white');
            }, 1500);
        }
    });
    
    // Add event listener for history button
    historyBtn.addEventListener('click', function() {
        if (passwordHistory.length === 0) {
            alert('No password history available');
            return;
        }
        
        // Display history in the textarea
        passwordsTextarea.value = passwordHistory.join('\n');
        passwordsTextarea.classList.remove('hidden');
        // Hide any custom password display
        const customContainer = document.querySelector('.passwords-container');
        if (customContainer) customContainer.classList.add('hidden');
        
        // Show copy button
        copyAllBtn.classList.remove('hidden');
    });

    // Initially hide the copy button and error message div
    copyAllBtn.classList.add('hidden');
    errorMessageDiv.classList.add('hidden');
});
