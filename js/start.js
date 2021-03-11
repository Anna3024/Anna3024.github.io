function start() {
    const view = new StartView();
    const model = new StartModel();
    const controller = new StartController();

    //связываем части модуля
    view.init(document.getElementById("modalStart"));
    model.init(view);
    controller.init(document.getElementById("modalStart"), model);

    /* ------- begin view -------- */
    function StartView() {
        let myStartContainer = null; 
        let modalContainer = null; //контейнер c инпутом
        let nameUser = null; //имя игрока в header
        let changeName = null; //кнопка "Сменить игрока"

        this.init = function(container) {
            myStartContainer = container; //привязать контейнер и элементы
            modalContainer = myStartContainer.querySelector('#modalcontainer');
            nameUser = myStartContainer.querySelector('#name');
            changeName = myStartContainer.querySelector('#changeName');
        }

        this.sayHi = function(name) {
            modalContainer.classList.add('closed'); //скрыть input
            nameUser.innerText = ", " + name; //записать имя игрока
        }

        this.askName = function() {
            modalContainer.classList.remove('closed'); //показать input
            changeName.classList.add('closed');//скрыть кнопку "Сменить игрока"
        }

        this.hideName = function() {
            nameUser.innerText = "";//очистить инпут
            this.askName();
        }

        this.playMusic = function() {
            clickAudio.play();
        }

        this.changeHash = function() {
            window.location.hash = "#menu";
        }
    }
    /* -------- end view --------- */
    /* ------- begin model ------- */
    function StartModel() {
        let myStartView = null; 
        let userName = "User"; //имя игрока по умолчанию

        this.init = function(view) {
            myStartView = view; //привязать view

            if (localStorage.getItem('match')) {//если есть данные в  ls
                userName = JSON.parse(localStorage.getItem('match')).name;
                myStartView.sayHi(userName);
            }
            else {
                myStartView.askName();
            }
        }

        this.saveName = function(name) {
            if (!localStorage.getItem('match')) {
                this.saveNameLS(name);
            }
            myStartView.playMusic();
            myStartView.changeHash();
        }

        this.saveNameLS = function(name) {
            userName = "User";
            if (name.length>0 && !name.split('').every((v)=>v==" ")) {
                userName=name;//если name не пустая строка сохраняем 
            }
            let clientData = {
                "name": userName,
                "time": false,
                "score": 0
            }
            localStorage.setItem('match', JSON.stringify(clientData));
        }

        this.changeName = function() {
            localStorage.removeItem('match');//удалить из ls 'match'
            myStartView.hideName();
        }

    }
    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function StartController() {
        let myStartContainer = null;
        let myStartModel = null;
        let closeStart = null;//кнопка войти
        let inputName = null;//инпут

        this.init = function(container, model) {
            myStartContainer = container;
            myStartModel = model;
            closeStart = myStartContainer.querySelector('#closeStart');
            inputName = myStartContainer.querySelector('#clientName');

            closeStart.addEventListener('click', this.saveName); //сохранить пользователя
            inputName.addEventListener('keypress', (e) => {
                if (e.key == "Enter") {
                    this.saveName();
                }
            })

            changeName.addEventListener('click', myStartModel.changeName) //сменить пользователя
        }

        this.saveName = function() {
            myStartModel.saveName(inputName.value);
        }
    }
    /* ------ end controller ----- */
}