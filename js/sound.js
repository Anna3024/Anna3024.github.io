let musicState = true;
let soundState = true;

let clickAudio=new Audio;//фоновая музыка
clickAudio.src = "sound/backMusic.mp3";
clickAudio.loop = true;
clickAudio.volume = 0.5;

let soundCard = new Audio; //фоновые звуки
soundCard.src = 'sound/page-flip.wav';

let soundClap = new Audio;
soundClap.src = 'http://foto.teoteater.ee/muusika/1001%20Sound%20Effects/Applause/Large%20Crowd%20Applause%2003.wav';

let soundWrong = new Audio;
soundWrong.src = 'sound/WHISTLE.wav';

let soundRight = new Audio;
soundRight.src = 'http://www.superluigibros.com/downloads/sounds/GAMECUBE/SUPERMARIOSUNSHINE/WAV/shineselect.wav';

window.addEventListener('click', soundInit, {once: true});

function soundInit() { //инициализация звуков по первому клику на транице
    soundCard.play();
    soundCard.pause();
    soundClap.play();
    soundClap.pause();
    soundWrong.play();
    soundWrong.pause();
    soundRight.play();
    soundRight.pause();
    volumeSound(0.5);
}

function soundPlay() { //звук
    this.pause();
    this.currentTime=0; 
    this.play();
}

function volumeSound(vol) {
    soundCard.volume = vol;
    soundClap.volume = vol;
    soundWrong.volume = vol;
    soundRight.volume = vol;
}