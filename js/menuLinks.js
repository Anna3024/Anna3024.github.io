let linksMenu = {
    rules: `<h1>Правила игры</h1>
    <ol>
        <li>На игровом поле из колоды раскладываются 16 прозрачных карт.</li>
        <li>Игроку нужно выбрать из предложенных карты, которые соберут максимально возможное количество МЭТЧей (совпадений)</li>
        <li>Игрок должен показать совпадения наложив карты друг на друга. Если совпадение верное игрок получает очки, а карты больше не учавствуют в игре. Если игрок ошибается и не может завершить МЭТЧ, он штрафутся на количество очков, равных количеству выбранных карт, а карты возвращаются на игровое поле. </li>
        <li>При необходимости любую карту с игрового стола можно повернуть или перевернуть в специальном поле. </li>
        <li>Если игрок выбрал карту, то игрок должен завершить с ней МЭТЧ либо получить штраф.</li>
        <li>В случае, если колода ещё не закончилась, а игрок не находит совпадений на игровом поле, можно поменять 4 случайные карты на игровом поле.</li>
        <li>На игровом столе есть 3 участка: игровое поле 4х4, поле для трансформации карты и поле для проверки МЭТЧ. По ЛКМ карта перемещвется с игрового поля на поле трансформаций и с поля трансформаций на поле МЭТЧ. По ПКМ карта перемещается с игрового поля без трансформаций на поле МЭТЧ. </li>
        <li>Если игрок собрал МЭТЧи из всех 60 карт, он дополнительно получает 100 очков.</li>
    </ol>
    <div class="animRules">
        <svg id="svgRight" width="300" height="180" xmlns='http://www.w3.org/2000/svg'>
            <rect y=0 width=125 height=170 stroke='black' rx=5 ry=5 stroke-width=2 fill='none' id="card1Board"/>
            <rect y=86 width=35 height=35 stroke='orange' stroke-width=5 fill='none' id="card1BoardEl"/>
            <rect y=133 width=23 height=23 fill='green' id="card1CenterEl"/>

            <rect y=0 width=125 height=170 stroke='black' rx=5 ry=5 stroke-width=2 fill='none' id="card2Board"/>
            <rect y=127 width=35 height=35 stroke='green' stroke-width=5 fill='none' id="card2BoardEl"/>
            <rect y=92 width=23 height=23 fill='orange' id="card2CenterEl"/>
            
        </svg>
        <svg id="svgWrong" width="300" height="180" xmlns='http://www.w3.org/2000/svg'>
            <rect y=0 width=125 height=170 stroke='black' rx=5 ry=5 stroke-width=2 fill='none'/>
            <rect y=86 width=35 height=35 stroke='violet' stroke-width=5 fill='none' id="card1BoardEl"/>
            <rect y=92 width=23 height=23 fill='orange' id="card1CenterEl"/>

            <rect y=0 width=125 height=170 stroke='black' rx=5 ry=5 stroke-width=2 fill='none'/>
            <rect y=127 width=35 height=35 stroke='green' stroke-width=5 fill='none' id="card2BoardEl"/>
            <rect y=92 width=23 height=23 fill='violet' id="card2CenterEl"/>
        </svg>
    </div>`,
    bestPlayers:`<h1>Лучшие игроки</h1>
        <table id="showBestResult" border=1>
            <tr>
                <th>Простая игра</th>
                <th>Игра на время</th>
            </tr>
            <tr>
                <td>
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
                </td>
                <td>
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
                </td>
            </tr>
        </table>`,
    settings: `<h1>Настройки</h1>
        <h2></h2> 
        <button id="changeNameSet">Сменить игрока</button> 
        <button id="soundOnOff"></button>
        <button id="musicOnOff"></button>`    
}