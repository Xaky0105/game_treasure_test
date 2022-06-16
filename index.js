const map = document.getElementById('map');
const mapWrapper = document.getElementById('mapWrapper');
const hints = [
    {text: 'Найден!', color: 'salmon'},
    {text: "Жарко", color: 'red'},
    {text: 'Теплее', color: 'orange'},
    {text: 'Холодно', color: 'skyblue'},
    {text: 'Очень холодно', color: 'blue'},
];

function game() {
    let count = 0;
    const hiddenTreasure = generateCoords(map);
    console.log(hiddenTreasure);
    function mapClickHandler(e) {
        count++
        const clickCoord = {
            x: e.offsetX,
            y: e.offsetY
        }
        const length = getLengthBetweenPoints(clickCoord, hiddenTreasure);
        const hintNumber = getHint(length);
        const hint = hints[hintNumber];
        showHint(hint);
        showExcavation(clickCoord);

        if (hintNumber === 0) {
            e.target.removeEventListener('click', mapClickHandler);
            playVictoryMusic()
            showTreasure(clickCoord);
            showPopup(count);
        } else {
            playExcavationMusic();
        }
    }

    map.addEventListener('click', mapClickHandler);

    function generateCoords({height, width}) {
        const vGap = Math.floor(height / 100 * 10);
        const hGap = Math.floor(width / 100 * 10);
        return {
            x: Math.floor(Math.random() * (width - hGap * 2) - hGap),
            y: Math.floor(Math.random() * (height - vGap * 2) - vGap)
        }
    }

    function getLengthBetweenPoints(p1, p2) {
        return Math.round(Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2));
    }

    function getHint(length) {
        if (length < 30) {
            return 0;
        } else if (length < 60) {
            return 1;
        } else if (length < 100) {
            return 2;
        } else if (length < 140) {
            return 3;
        } else {
            return 4;
        }
    }

    function showHint(hint) {
        const hintContainer = document.getElementById('hint');
        hintContainer.textContent = hint.text;
        hintContainer.style.color = hint.color;
        hintContainer.style.opacity = 1;
    }
    function showTreasure({x, y}) {
        const treasure = document.createElement('img');
        treasure.classList.add('treasure');
        treasure.src = './img/treasure.png';
        treasure.style.opacity = 0;
        treasure.style.position = 'absolute';
        treasure.style.transition = 'all .5s linear';
        treasure.style.top = `${y}px`;
        treasure.style.left = `${x}px`
        treasure.style.transform = 'translate(-50%, -50%)';
        treasure.style.width = '5rem';
        setTimeout(() => {
            treasure.style.opacity = 1;
        })
        mapWrapper.append(treasure);
    }
    function showExcavation({x, y}) {
        const excavation = document.createElement('img');
        excavation.src = './img/excavation.png';
        excavation.style.position = 'absolute';
        excavation.style.top = `${y}px`;
        excavation.style.left = `${x}px`;
        excavation.style.width = '3rem';
        excavation.style.transform = 'translate(-50%, -50%)';
        mapWrapper.append(excavation);
        setTimeout(() => {
            excavation.remove();
        },100)
    }
    function hideTreasure() {
        const treasure = document.getElementsByClassName('treasure')[0];
        treasure.remove();
    }
    function hideHint() {
        const hint = document.getElementById('hint');
        hint.textContent = '';
    }
    function showPopup(count) {
        setTimeout(() => {
            const popup = document.createElement('div');
            const text = document.createElement('h2');
            const btn = document.createElement('button');
            popup.classList.add('popup');
            text.classList.add('text');
            btn.classList.add('refresh');
            text.textContent = `Вы нашли клад за ${count} попыток`;
            btn.textContent = 'Начать заново';
            mapWrapper.append(popup);
            popup.append(text, btn);
            setTimeout(() => {
                popup.style.opacity = 1;
            })

            btn.addEventListener('click', () => {
                popup.remove();
                hideTreasure();
                hideHint();
                return game();
            })
        }, 1500);
    }
    function playVictoryMusic() {
        const audio = new Audio();
        audio.src = './sound/win.mp3';
        audio.autoplay = true;
    }
    function playExcavationMusic() {
        const audio = new Audio();
        audio.src = './sound/excavation.mp3';
        audio.autoplay = true;
    }
}

game()