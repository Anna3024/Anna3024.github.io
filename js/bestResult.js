function closeSave() {
    const view = new ResView();
    const model = new ResModel();
    const controller = new ResController();
    //связываем части модуля
    view.init(document.getElementById("bestRes"));
    model.init(view);
    controller.init(document.getElementById("bestRes"), model);

    /* ------- begin view -------- */
    function ResView() {
        let myResContainer = null; 
        let h2 = null;
        let headerName = null; 
        let headerScore = null;
        let liArr = [];

        this.init = function(container) {
            myResContainer = container;
            h2 = myResContainer.querySelector('h2');
            headerName = myResContainer.querySelector('h1>span:first-child');
            headerScore = myResContainer.querySelector('h1>span:last-child');
            liArr = myResContainer.querySelectorAll('li');//найти все li
            let timerIDMove = setTimeout(() => { //появление окна
                container.style.top = 50 + "px";
            }, 0);
        }

        this.showHeader = function(name, score, time) {//показать имя игрока, счёт и тип игры
            headerName.innerText = name+", "; //отобразить имя игрока
            headerScore.innerText = score; //отобразить счёт
            h2.innerHTML+= (time)?(" (Игра на время):"):(" (Простая игра):");
        }

        this.writeResult = function(arr) {//записать лучшие результаты
            for (let i=0; i<arr.length; i++) {
                liArr[i].innerHTML = `${arr[i].nameUser}<strong>${arr[i].scoreUser}</strong>`;
            }
        }

        this.highlightResult = function(i) {//подсветить результат текущего игрока
            liArr[i].style.color = "mediumvioletred";
            liArr[i].style.fontWeight = "bolder";
        }

        this.hideWindow = function() {//закрыть модальное окно
            myResContainer.style.top = -1500 + "px";
            let timerId = setTimeout(() => {
                window.location.hash = "#menu";
            }, 1000);
        }
    }
    /* -------- end view --------- */
    /* ------- begin model ------- */
    function ResModel() {
        let myResView = null;
        let newResult = { 
            nameUser: "User",
            scoreUser: 0
        }
        let userTimeGame ;
        let userArr=[];
        
        this.init = function(view) {
            myResView = view;

            if (localStorage.getItem('match')) {//если есть данные в  ls
                newResult.nameUser = JSON.parse(localStorage.getItem('match')).name;
                newResult.scoreUser = JSON.parse(localStorage.getItem('match')).score;
                userTimeGame = JSON.parse(localStorage.getItem('match')).time;
            }

            myResView.showHeader(newResult.nameUser, newResult.scoreUser, userTimeGame);

            this.parseData(userTimeGame?'timeOn':'timeOff');
            this.clearResult();
        }

        this.parseData = function(onOff) {//прочитать из БД лучшие результаты и сравнить их с текущим
            let now = new Date;
            let userCount, minRes, minResName;
            let scoreArr = [];
            firebase.database().ref(onOff).once('value')
            .then(function(snapshot){//прочитать данные с firebase
                userCount = Object.keys(snapshot.val()).length;//кол-во сохранённых результатов
                
                for (let key in snapshot.val()) {//перебрать объект
                    userArr.push(snapshot.val()[key]);//каждый объект(результат и участник)  записать в массив
                    scoreArr.push(snapshot.val()[key].scoreUser);//массив результатов
                    minRes = scoreArr.reduce((r,v,i)=>Math.min(r,v),1000)//минимальный результат
                }
                if (userCount>=10 && minRes<newResult.scoreUser) {//если участников больше или = 10 и текущий результат больше минимального
                    for (let key in snapshot.val()) {
                        if (snapshot.val()[key].scoreUser==minRes) {
                            minResName = key;//имя с наименьшим результатом
                            break;
                        }
                    }
                    firebase.database().ref(`${onOff}/`+minResName).remove()
                    .catch(function (error) {
                        console.log("Error: " + error.code);
                    });//удалить наименьший результат из firebase
                }
                if (userCount<10 || minRes<newResult.scoreUser) {//если участников меньше 10 и текущий результат больше минимального
                    firebase.database().ref(`${onOff}/`+newResult.nameUser+now.getHours()+now.getMinutes()+now.getSeconds()).set({
                    nameUser: `${newResult.nameUser}`,
                    scoreUser: `${newResult.scoreUser}`
                    })
                    .catch(function (error) {
                        console.log("Error: " + error.code);
                    });
                    userArr.push(newResult);//добавить к массиву результатов текущий объект
                }
                userArr.sort((a, b)=>b.scoreUser-a.scoreUser);//отсортировать массив по убыванию очков
                if (userArr.length>10) userArr.pop();//если массив больше  10 удалить наименьший результат
                myResView.writeResult(userArr);//вывести результат на экран
                for (let i=0; i<userArr.length; i++) {
                    if (userArr[i].nameUser==newResult.nameUser && userArr[i].scoreUser==newResult.scoreUser) {//если текущий результат,  подсветить имя
                        myResView.highlightResult(i);
                    }
                }
            }).catch(function (error) {
                console.log("Error: " + error.code);
            }); 
        }

        this.clearResult = function() {//обнулить текущий результат
            localStorage.setItem('match', JSON.stringify({"name": newResult.nameUser, "time": JSON.parse(localStorage.getItem('match')).time, "score": 0}));
        }

        this.closeResult = function() {//закрыть модальное окно
            myResView.hideWindow();
        }
    }
    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function ResController() {
        let myResContainer = null;
        let btnReturn = null;

        this.init = function(container, model) {
            myResContainer = container;
            myResModel = model;
            btnReturn = myResContainer.querySelector('button');
            btnReturn.addEventListener('click', myResModel.closeResult)
        };
    }
    /* ------ end controller ----- */
} 