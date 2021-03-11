function menu() {    
    const svgNS = "http://www.w3.org/2000/svg";
    const view = new MenuView();
    const model = new MenuModel();
    const controller = new MenuController();
    //связываем части модуля
    view.init(document.getElementById("modalContent"), document.getElementById('modalMenuContainer'));
    model.init(view);
    controller.init(document.getElementById("modalContent"), document.getElementById('modalMenuContainer'), model);
    /* ------- begin view -------- */
    function MenuView() { 
        let modalContent = null; //контейнер с контентом
        let modalMenu = null; //контейнер с кнопками меню

        this.init = function(container, menuContainer){
            modalContent = container;
            modalMenu = menuContainer;

            let timerIDMove = setTimeout(() => { //появление окна меню
                modalMenu.style.top = 120 + "px";
            }, 0);
        }

        this.showContentWindow = function() {//показать окно с контентом
            modalMenu.style.width = 250+"px";
            modalMenu.style.left = 50+"px";
            modalContent.style.position = "relative";
            modalContent.style.right = 50+"px";
        }

        this.closeMenu = function() {//спрятать окна меню и контента и перейти на другую страницу
            modalMenu.style.top = -700+"px";
            modalContent.style.right = -1800+"px";
            let timerID = setTimeout(() => {
                window.location.hash = "#game";
            }, 1000);
        }

        this.showContent = function(link) {//вёрстка контента
            modalContent.innerHTML = linksMenu[link];
        }

        this.drawRules = function() {//анимация правил
            const svgRight = document.getElementById('svgRight');//левое поле svg
            const svgWrong = document.getElementById('svgWrong'); //правое поле svg
            const divAnimRules = document.querySelector('.animRules');//нижнее поле с анимацией
        
            let posArrRight=[1, 83, 49, 175, 217, 263];//начальное положение x для каждого квадрата двух карт в левом поле
            let posArrWrong=[1, 43, 89, 175, 217, 223]; //начальное положение x для каждого квадрата двух карт в правом поле
        
            let rectArrRight = svgRight.getElementsByTagName('rect');
            let rectArrWrong = svgWrong.getElementsByTagName('rect');
            for (let i=0; i<rectArrRight.length; i++) {
                rectArrRight[i].setAttributeNS(null, 'x', posArrRight[i]);//задать квадратам в полях svg начальное положение по х согласно posArr
                rectArrWrong[i].setAttributeNS(null, 'x', posArrWrong[i]);
            }
            if (divAnimRules.children.length>2) {//если анмация уже была запущена и были добавлены дополнительные символы, удалить их
                divAnimRules.lastChild.remove();
                divAnimRules.lastChild.remove();
            }
            drawСloser(svgRight, "&#10003");
            drawСloser(svgWrong, "&#10007");

            function drawСloser(svgContainer, symb) { //анимация правил, изменение координаты х для движения
                let rectArr = svgContainer.getElementsByTagName('rect');//найти квадраты в svg
                let posArr=[];//положение по х для всех квадратов в каждом svg
                for (let i=0; i<rectArr.length; i++) {//записать в массив положени по х для квадратов в 2-х картах
                    posArr[i] = rectArr[i].getAttributeNS(null,'x');
                }
                let timerID = setTimeout (()=>{
                    let timerIDAnim = requestAnimationFrame(function animationRules(){
                        for (let i=0; i<3; i++) {//левая карта движется вправо
                            ++posArr[i];
                            rectArr[i].setAttributeNS(null, "x", posArr[i]);
                        }
                        for (let i=3; i<6; i++) {//правая карта движется влево
                            --posArr[i];
                            rectArr[i].setAttributeNS(null, "x", posArr[i]);
                        }
                        if (posArr[0]==posArr[3]) {//еслиа границы карт сошлись
                            cancelAnimationFrame(timerIDAnim);//остановить амнимацию
                            let svgText = document.createElement('h1');
                            svgText.innerHTML = symb;//добавить символ
                            divAnimRules.append(svgText);
                            return;
                        }
                        timerIDAnim = requestAnimationFrame(animationRules);
                    });
                },1500)
            }
        }

        this.showSoundBtns = function(stateSound, stateMusic) {//отрисовка кнопок сотояния звука
            let btnMusic = modalContent.querySelector('#musicOnOff');
            let btnSound = modalContent.querySelector('#soundOnOff');
            btnMusic.innerHTML = stateMusic?"Выкл музыку":"Вкл музыку";
            btnSound.innerHTML = stateSound?"Выкл звук":"Вкл звук";
        }

        this.showBestPlayer = function(n, userArr) {//отрисовка лучших игроков
            let tdArr = modalContent.querySelectorAll('td');
            let liArr = tdArr[n].querySelectorAll('li');
            for (let i=0; i<userArr.length && userArr.length<11; i++) {
                liArr[i].innerHTML = `${userArr[i].nameUser}<strong>${userArr[i].scoreUser}</strong>`;//в каждую li записать игрока и результат из отсортированного массива
            }
        }

        this.showUserName = function(name) {//отрисовка имени игрока в настройках
            let userName = modalContent.querySelector('h2');
            userName.style.textAlign = "center";
            userName.innerText = "Игрок: " + name;
        }

        this.changeUserName = function() {//отрисовка инпута для изменения имени игрока в настройках
            let btnChangeName = modalContent.querySelector('#changeNameSet');
            let userName = modalContent.querySelector('h2');
            btnChangeName.innerHTML = 'Сохранить';
            let input = document.createElement('input');
            userName.innerText = "Игрок: ";
            userName.append(input);
        }

        this.hideInput = function() {//удалить инпут после измения имени игрока
            let btnChangeName = modalContent.querySelector('#changeNameSet');
            let input = modalContent.querySelector('input');
            btnChangeName.innerHTML = 'Сменить игрока';
            input.remove();
        }

        this.music = function(state) {//изменение музыки
            let btnMusic = modalContent.querySelector('#musicOnOff');
            if (state) {
                clickAudio.pause();
                btnMusic.innerText="Вкл музыку";
            }
            else {
                clickAudio.play();
                btnMusic.innerText="Выкл музыку";
            }
        }

        this.sound = function(state) {//изменение звука
            let btnSound = modalContent.querySelector('#soundOnOff');
            if (state) {
                volumeSound(0);
                btnSound.innerText="Вкл звук";
            }
            else {
                soundPlay.call(soundRight);
                volumeSound(0.5);
                btnSound.innerText="Выкл звук";
            }
        }
    }
    /* -------- end view --------- */
    /* ------- begin model ------- */
    function MenuModel() {
        let myView = null;
        let clientData = {
            "name": "User",
            "time": false,
            "score": 0
        };
        let activeMenuLink = null;

        this.init = function(view) {
            myView = view;
            clientData.name = localStorage.getItem('match')?(JSON.parse(localStorage.getItem('match')).name):"User";
        }

        this.showContentWindow = function() {//показать оокно с контентом
            myView.showContentWindow();
        }

        this.goToGame = function(state) {//переход в игру
            clientData.time = state;
            localStorage.setItem('match', JSON.stringify(clientData));
            myView.closeMenu();
        }

        this.changeActiveMenuLink = function(link) {//изменение контента
            activeMenuLink = link;
            myView.showContent(link);
            switch (activeMenuLink) {
                case "rules": //показать правила игры
                    myView.drawRules();
                    break;
                case "bestPlayers"://прочитать из базы лучших игроков
                    this.firebaseBestPlayers('timeOff');
                    this.firebaseBestPlayers('timeOn');
                    break;
                case "settings"://показать настройки
                    myView.showUserName(clientData.name);
                    myView.showSoundBtns(soundState, musicState);
                    break;
            }
        }

        this.firebaseBestPlayers = function(onOff){//чтение данных с firebase
            let userArr=[];//массив объектов с именами игроков и результатами
            firebase.database().ref(onOff).once('value')
            .then(function(snapshot){ //читать данные с firebase
                for (let key in snapshot.val()) {
                    userArr.push(snapshot.val()[key]);//записать игроков и результаты в массив
                }
                userArr.sort((a, b)=>b.scoreUser-a.scoreUser);//отсортировать массив по убыванию очков
                myView.showBestPlayer(onOff=='timeOff'?0:1, userArr);
            }).catch(function (error) {
                console.log("Error: " + error.code);
            }); 
        }

        this.changeUserName = function() {//изменить имя в настройках
            clientData.name = "User";
            myView.changeUserName();
        }

        this.saveName = function(_name) {//сохранить имя после изменений
            if (_name.length>0 && !_name.split('').every((v)=>v==" ")) {
                clientData.name=_name;
            }
            localStorage.setItem('match', JSON.stringify(clientData));
            myView.hideInput();
            myView.showUserName(clientData.name);
        }

        this.music = function(state) {//вкл-выкл музыку
            myView.music(state);
            musicState = !state;
        }

        this.sound = function(state) {//вкл-выкл звуки
            myView.sound(state);
            soundState = !state;
        }
    }
    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function MenuController() {
        let modalContent = null;
        let modalMenu = null;
        let myModel = null;

        this.init = function(container, menuContainer, model) {
            modalContent = container;//контент
            modalMenu = menuContainer;//окнос кнопками меню
            myModel = model;
            const btnRules = modalMenu.querySelector('#showRules');
            const btnBestPlayers = modalMenu.querySelector('#bestPlayers');
            const btnStartSimple = modalMenu.querySelector('#gameSimple');
            const btnStartTime = modalMenu.querySelector('#gameTime');
            const btnSettings = modalMenu.querySelector('#settings');

            modalMenu.addEventListener('click', (e)=>{
                if (e.target==btnRules || e.target==btnBestPlayers || e.target==btnSettings) {//клик по кнопками лучшие игроки, правила и настрройки
                    myModel.showContentWindow();
                    switch (e.target) {
                        case btnRules: //показать правила игры
                            myModel.changeActiveMenuLink("rules");
                            break;
                        case btnBestPlayers://показать лучших игроков
                            myModel.changeActiveMenuLink("bestPlayers");
                            break;
                        case btnSettings://настройки
                            myModel.changeActiveMenuLink("settings");
                            this.addClickSettingsBtn();//слушатель событий на кнопки настроек в контенте
                            break;
                    }
                }
            })

            btnStartSimple.addEventListener('click', (e)=>{//старт игры без времени
                myModel.goToGame(false);
            });
        
            btnStartTime.addEventListener('click', (e)=>{//старт игры на время
                myModel.goToGame(true);
            });
        }

        this.addClickSettingsBtn = function() {
            let btnChangeName = modalContent.querySelector('#changeNameSet');
            let btnMusic = modalContent.querySelector('#musicOnOff');
            let btnSound = modalContent.querySelector('#soundOnOff');

            btnChangeName.addEventListener('click', (e)=> {
                if (btnChangeName.innerHTML=="Сменить игрока") {//сменить игрока
                    myModel.changeUserName();
                }
                else {
                    myModel.saveName(modalContent.querySelector('input').value);//сохранить новое имя игрока
                }
            });

            btnMusic.addEventListener('click', (e)=>{
                myModel.music(btnMusic.innerText=="Выкл музыку");
            })

            btnSound.addEventListener('click', (e)=>{
                myModel.sound(btnSound.innerText=="Выкл звук");
            })
        }
    }
}