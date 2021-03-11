const mainLinks = {
    start: `<div id="modalStart" class="modal ">
        <div class="container">
            <h1>Добро пожаловать в МЭТЧ<span id="name"></span>!</h1>
            <div id="modalcontainer">
                <label for="clientName">Введите имя</label>
                <input type="text" id="clientName">
            </div>
            <div class="modalFooter">
                <button id="changeName">Сменить игрока</button>
                <button id="closeStart">Войти</button>
            </div>
        </div>
    </div>`,
    menu: `<div id="menu" class="menu">
        <div class="container" id="modalMenuContainer">
            <h1>МЭТЧ</h1>
            <ul>
                <li><button id="gameSimple">Простая игра</button></li>
                <li><button id="gameTime">Игра на время</button></li>
                <li><button id="showRules">Правила</button></li>
                <li><button id="bestPlayers">Лучшие игроки</button></li>
                <li><button id="settings">Настройки</button></li>
            </ul>
        </div>
        <div class="container " id="modalContent">
        </div>
    </div>`,
    game: `<div class = "game ">
        <table id="board" border=1>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>

        <div id = "step">
            <div id="flipBtns">
                <div id="flip"></div>
                <div class="buttons">
                    <button id="rotate" title="Повернуть карту по часовой стрелке">Повернуть <span>&#10558</span> </button>
                    <button id="flipX" title="Перевернуть карту относительо горизонтали">Перевернуть <span>&#10552</span> </button>
                    <button id="flipY" title="Перевернуть карту относительо вертикали">Перевернуть <span>&#10555</span> </button>
                </div>
            </div>
            
            <div id="matchAndBtn">
                <div id="match"></div>
                <div class="buttons">
                    <button id="matchBtn">МЭТЧ</button>
                    <button id="changeCards">Заменить карты</button>
                </div>
            </div>
            <h2 id="timeCount"></h2>
            <h2 id="score"></h2>
        </div>
        <a id="closeSave" title="Сохранить и выйти"> &#10007</a>
    </div>`,
    result: `<div id="bestRes" class="container">
        <h1><span></span>Ваш результат в МЭТЧ: <span></span></h1>
        <h2>Лучшие игроки</h2>
        <ol>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ol>
        <div class="btn">
            <button >Вернуться в "Меню"</button>
        </div>
    </div>`,
    error: `<div id="eror" class="modal ">
    <div class="container">
        <h1>Ошибка 404</h1>
        <div id="modalcontainer">
        <p>Страница не найдена, попробуйте вернуться <a href="#start">в начало</a>.</p>
        </div>
    </div>
</div>`
};