/* ----- spa init module --- */
const mySPA = (function() {
    /* ------- begin view -------- */
    function SpaView() {
        let mySpaContainer = null;  //контейнер

        //страницы
        const  StartComponent = {
            title: "МЭТЧ-приветствие",
            render: () => mainLinks.start,
            goFunc: start
        }

        const  MenuComponent = {
            title: "МЭТЧ-меню",
            render: () => mainLinks.menu,
            goFunc: menu
        }

        const  GameComponent = {
            title: "МЭТЧ-игра",
            render: () => mainLinks.game,
            goFunc: startGame
        }

        const  ResultComponent = {
            title: "МЭТЧ-результаты",
            render: () => mainLinks.result,
            goFunc: closeSave
        }

        const ErrorComponent = {
            title: "Ошибка",
            render: () => mainLinks.error,
            goFunc: function () {
                console.error('Страница не найдена')
            }
        };

        const router = { //все страницы
            start: StartComponent,
            menu: MenuComponent,
            game: GameComponent,
            result: ResultComponent,
            default: StartComponent,
            error: ErrorComponent
        }

        this.init = function(container) {
            mySpaContainer = container; //привязать контейнер
        }

        this.renderContent = function(hashPageName) {
            let routeName = "default";

            if (hashPageName.length > 0) { 
                routeName = hashPageName in router ? hashPageName : "error";  //если нет hash в router присоить hash "error"
            }

            window.document.title = router[routeName].title; //установить title
            mySpaContainer.innerHTML = router[routeName].render();//вёрстка страницы
            router[routeName].goFunc(); //запуск соответствующей функции
        }

    }
    /* -------- end view --------- */
    /* ------- begin model ------- */
    function SpaModel () {
        let mySpaView = null; 

        this.init = function(view) {
            mySpaView = view; //привязать view
        }

        this.updateState = function() {
            const hashPageName = window.location.hash.slice(1).toLowerCase(); //прочитать hash без # 
            mySpaView.renderContent(hashPageName); //вызвать метод view
        }
    }
    /* -------- end model -------- */
    /* ----- begin controller ---- */
    function SpaController () {
        let mySpaContainer = null; //контейнер
        let mySpaModel = null; //модель

        this.init = function(container, model) {
            mySpaContainer = container; //привязать контейнер и модель
            mySpaModel = model;

            // вешаем слушателей на событие hashchange и кликам по пунктам меню
            window.addEventListener("hashchange", this.updateState);//слушатель события на изменение хэша

            this.updateState(); //метод контроллера
        }

        this.updateState = function() {
            mySpaModel.updateState(); //вызвать метод модели
        }
    }
    /* ------ end controller ----- */

    return {
        init: function(container) {

            const view = new SpaView();
            const model = new SpaModel();
            const controller = new SpaController();

            //связываем части модуля
            view.init(document.getElementById(container));
            model.init(view);
            controller.init(document.getElementById(container), model);
        }
    }
}());

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init("SPA")); // инициализируем модуль как только DOM готов.