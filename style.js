document.addEventListener('DOMContentLoaded', function () {
    let maxNumber = 1000;
    let randomNumber = Math.floor(Math.random() * (maxNumber + 1));
    let timerInterval;
    let startTime = new Date().getTime();

    const userInput = document.getElementById('userInput');
    const timerDiv = document.getElementById('timer');
    const radios = document.getElementsByName('options');
    const scoreDisplay = document.getElementById('scoreDisplay');
    let scoreDisplayNumber = document.getElementById('scoreDisplayNumber');
    let shortestTime = localStorage.getItem('shortestTime');
    const progressBarFill = document.querySelector('.progress-bar-fill');

    time = (shortestTime || '');
    scoreDisplay.textContent = 'Score:';
    scoreDisplayNumber.textContent = time;

    const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    for (let i = 0; i < radios.length; i++) {
        radios[i].addEventListener('change', function () {
            switch (this.value) {
                case '1':
                    maxNumber = 100;
                    break;
                case '2':
                    maxNumber = 1000;
                    break;
                case '3':
                    maxNumber = 10000;
                    break;
                default:
                    maxNumber = 100;
            }
            startTimer();
            checkedDifferant();
            randomNumber = Math.floor(Math.random() * (maxNumber + 1));
            document.getElementById('randomNumber').textContent = convertNumberToEnglish(randomNumber);
            userInput.focus();
        });
        
        let refresh = document.getElementById('refresh-left');
        refresh.addEventListener('click', function () {
            startTimer();
            randomNumber = Math.floor(Math.random() * (maxNumber + 1));
            document.getElementById('randomNumber').textContent = convertNumberToEnglish(randomNumber);
            userInput.value = '';
            userInput.focus();

            let boxes = document.querySelectorAll('.box.active');
            boxes.forEach(function (box) {
                box.classList.remove('active');
            });
        });

        let answerTrue = document.getElementById('query');
        answerTrue.addEventListener('click', function () {
            userInput.value = randomNumber;
        })
    }

    function startTimer() {
        clearInterval(timerInterval);
        startTime = new Date().getTime();
        timerInterval = setInterval(function () {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            timerDiv.textContent = elapsedTime;
            if (elapsedTime >= 20000) {
                clearInterval(timerInterval);
                timerDiv.textContent = "Time's up!";
            }
        }, 100);
    }

    startTimer();

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function checkedDifferant() {
        userInput.value = '';
    }

    function convertNumberToEnglish(n) {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10) - 2] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
        if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convertNumberToEnglish(n % 100) : '');
        if (n < 10000) return ones[Math.floor(n / 1000)] + ' thousand' + (n % 1000 !== 0 ? ' ' + convertNumberToEnglish(n % 1000) : '');
        return 'Invalid number';
    }

    function checkAnswerAndTime() {
        const endTime = new Date().getTime();
        const timeElapsed = endTime - startTime;
        const userInputValue = parseInt(userInput.value.trim());

        if (userInputValue === randomNumber) {
            stopTimer();
            if (shortestTime === null | timeElapsed < shortestTime) {
                localStorage.setItem('shortestTime', timeElapsed);
                shortestTime = timeElapsed;
                const score = document.getElementById('score');
                score.innerHTML = 'New Record: <span style="color:green;">' + timeElapsed + '</span> Yey!';
                scoreDisplay.textContent = 'Score:';
                scoreDisplayNumber.textContent = timeElapsed;
                setTimeout(function () {
                    score.innerHTML = '';
                }, 3000);

                progressBarFill.style.width = '100%';
            } else if (timeElapsed > shortestTime) {
                progressBarFill.style.width = '25%';
            } else {
                let percentage = (timeElapsed / shortestTime) * 50;
                progressBarFill.style.width = `${Math.min(50, percentage)}%`;
            }

            randomNumber = Math.floor(Math.random() * (maxNumber + 1));
            document.getElementById('randomNumber').textContent = convertNumberToEnglish(randomNumber);
            startTimer();
            userInput.style.borderColor = 'green';
            userInput.value = '';
        }
    }

    userInput.addEventListener('input', function () {
        checkAnswerAndTime();
    });
    document.getElementById('randomNumber').textContent = convertNumberToEnglish(randomNumber);

    const boxes = document.querySelectorAll('.underside .box');

    boxes.forEach(box => {
        box.addEventListener('click', function () {
            boxes.forEach(box => box.classList.remove('active'));

            this.classList.add('active');
        });
    });
});

