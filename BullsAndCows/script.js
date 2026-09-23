const SECRET_CODE = "28315"; // The target code, per user request

const dials = document.querySelectorAll('.dial');
const checkBtn = document.getElementById('check-btn');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');
const successModal = document.getElementById('success-modal');
const restartBtn = document.getElementById('restart-btn');
const introModal = document.getElementById('intro-modal');
const introOkBtn = document.getElementById('intro-ok-btn');

// Initialize with a sequence of unique digits
let currentGuess = [0, 1, 2, 3, 4];

function updateUI() {
    dials.forEach((dial, index) => {
        dial.querySelector('.value').textContent = currentGuess[index];
        dial.classList.remove('error');
    });

    // Check for duplicates
    const counts = {};
    let hasDuplicates = false;
    currentGuess.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
    });

    currentGuess.forEach((val, index) => {
        if (counts[val] > 1) {
            dials[index].classList.add('error');
            hasDuplicates = true;
        }
    });

    if (hasDuplicates) {
        checkBtn.disabled = true;
        errorMessage.classList.remove('hidden');
    } else {
        checkBtn.disabled = false;
        errorMessage.classList.add('hidden');
    }
}

dials.forEach((dial, index) => {
    const upBtn = dial.querySelector('.up');
    const downBtn = dial.querySelector('.down');

    upBtn.addEventListener('click', () => {
        currentGuess[index] = (currentGuess[index] + 1) % 10;
        updateUI();
    });

    downBtn.addEventListener('click', () => {
        currentGuess[index] = (currentGuess[index] - 1 + 10) % 10;
        updateUI();
    });
});

function calculateBullsAndCows(guessStr, secretStr) {
    let bulls = 0;
    let cows = 0;

    for (let i = 0; i < 5; i++) {
        if (guessStr[i] === secretStr[i]) {
            bulls++;
        } else if (secretStr.includes(guessStr[i])) {
            cows++;
        }
    }

    return { bulls, cows };
}

checkBtn.addEventListener('click', () => {
    const guessStr = currentGuess.join('');
    const { bulls, cows } = calculateBullsAndCows(guessStr, SECRET_CODE);

    // Add to history
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item' + (bulls === 5 ? ' success' : '');
    historyItem.innerHTML = `
        <span class="history-guess">${guessStr}</span>
        <span class="history-feedback">
            <span class="bulls">${bulls} Быки</span>
            <span class="cows">${cows} Коровы</span>
        </span>
    `;
    historyList.prepend(historyItem); // Add to top

    if (bulls === 5) {
        showSuccess();
    }
});

function showSuccess() {
    const spans = successModal.querySelectorAll('.secret-display span');
    spans[0].textContent = SECRET_CODE[0];
    spans[1].textContent = SECRET_CODE[1];
    spans[2].textContent = SECRET_CODE[2];
    spans[3].textContent = SECRET_CODE[3];
    spans[4].textContent = SECRET_CODE[4];
    successModal.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
    currentGuess = [0, 1, 2, 3, 4];
    historyList.innerHTML = '';
    updateUI();
});

introOkBtn.addEventListener('click', () => {
    introModal.classList.add('hidden');
});

// Initial setup
updateUI();
