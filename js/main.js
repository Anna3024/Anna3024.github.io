function startGame() {
    let timeUse = localStorage.getItem('match')?(JSON.parse(localStorage.getItem('match')).time):false;
    const svgNS = "http://www.w3.org/2000/svg";
    const boardTable = document.querySelector('#board');
    const boardTableTD = boardTable.querySelectorAll('td');
    const flipField = document.querySelector('#flip');
    const matchField = document.querySelector('#match');
    const btnRotate = document.querySelector('#rotate');
    const btnFlipX = document.querySelector('#flipX');
    const btnFlipY = document.querySelector('#flipY');
    const btnMatch = document.querySelector('#matchBtn');
    const btnChangeCards = document.querySelector('#changeCards');
    const btnSave = document.querySelector('#closeSave');
    const score = document.querySelector('#score');
    const timeCount = document.querySelector('#timeCount');
    
    const cardHeight = document.body.offsetHeight/750*170; //найти высотку карты в зависимости от высоты экрана
    const cardWidth = cardHeight/170*125; //ширина карты
    const borderBoxWidth = cardHeight/170*35; //ширина квадрата в карте 
    for (let i=0; i<boardTableTD.length; i++) {
        boardTableTD[i].style.width = cardWidth+10+"px"; //задать высоту и ширину ячейки таблицы
        boardTableTD[i].style.height = cardHeight+5+"px";
    }
    flipField.style.width = cardWidth+5+"px"; //ширина и высота поля для трансформации
    flipField.style.height = cardHeight+"px";
    matchField.style.width = cardWidth+5+"px"; //ширина и высота поля мэтч
    matchField.style.height = cardHeight+"px";
    const flipFieldPosX = flipField.offsetLeft; //положение полей для трансформации и мэтч
    const flipFieldPosY = flipField.offsetTop;
    const matchFieldPosX = matchField.offsetLeft;
    const matchFieldPosY = matchField.offsetTop;

    const replaseTime = 350;//время css анимации

    let cardArr = [];//оставшиеся карты
    let tableCardArr = [];//карты на игровом поле
    let activeCard = null; //карта в поле для трансформации
    let matchCardArr = []; //карты в поле мэтч
    let scoreCount = 0; //счёт игры
    let timeStart = 180; //время игры
    score.innerText="Счёт: " + scoreCount;
    if (timeUse) {
        timeCount.innerText = "Оставшееся время: " +(timeStart-timeStart%60)/60+ " мин, " +timeStart%60 + " сек";
    }

    let timerIDToFlip = null;
    let timerIDRound = null;
    let timerIDFlip = null;
    let timerIDCountTime = null;

    function Card() {
        this.posBorder = randomNumBorder();
        let b = this.posBorder;
        this.posCenter = randomNumCenter();
        this.posBorderX = posX(this.posBorder);
        this.posBorderY = posY(this.posBorder);
        this.posCenterX = posX(this.posCenter);
        this.posCenterY = posY(this.posCenter);
        this.colorBorder = color(this.posBorder);
        this.colorCenter = color(this.posCenter);

        function randomNumBorder() {
            let a = Math.floor(Math.random()*(11-0+1));
            switch (a) {
                case 0:
                case 2:
                case 9:
                case 11:
                    // this.colorBorder = "blue";
                    ++countBlueBorder;
                    break;
                case 1:
                case 10:
                    // this.colorBorder = "green";
                    ++countGreenBorder;
                    break;
                case 4:
                case 7:
                    // this.colorBorder = "violet";
                    ++countVioletBorder;
                    break;
                case 3:
                case 5:
                case 6:
                case 8:
                    // this.colorBorder = "orange";
                    ++countOrangeBorder;
                    break;
            }
            if (countBlueBorder>18) {
                --countBlueBorder;
                randomNumBorder();
            }
            if (countGreenBorder>12) {
                --countGreenBorder;
                randomNumBorder();
            }
            if (countVioletBorder>12) {
                --countVioletBorder;
                randomNumBorder();
            }
            if (countOrangeBorder>18) {
                --countOrangeBorder;
                randomNumBorder();
            }
            return a;
        };
        
        function randomNumCenter() {
            let c = Math.floor(Math.random()*(11-0+1));
            if (c==b) {
                function changePos() {
                    c = Math.floor(Math.random()*(11-0+1));
                    (c==b)&&(changePos());
                }
                changePos();
            }
            switch (c) {
                case 0:
                case 2:
                case 9:
                case 11:
                    ++countBlueCenter;
                    break;
                case 1:
                case 10:
                    ++countGreenCenter;
                    break;
                case 4:
                case 7:
                    ++countVioletCenter;
                    break;
                case 3:
                case 5:
                case 6:
                case 8:
                    ++countOrangeCenter;
                    break;
            }
            if (countBlueCenter>18) {
                --countBlueCenter;
                randomNumCenter();
            }
            if (countGreenCenter>12) {
                --countGreenCenter;
                randomNumCenter();
            }
            if (countVioletCenter>12) {
                --countVioletCenter;
                randomNumCenter();
            }
            if (countOrangeCenter>18) {
                --countOrangeCenter;
                randomNumCenter();
            }
            return c;
        };

        function posX(pos) {
            switch (pos) {
                case 0:
                case 3:
                case 6:
                case 9:
                    return cardHeight/170*2.5;
                case 1:
                case 4:
                case 7:
                case 10:
                    return cardHeight/170*42.5;
                case 2:
                case 5:
                case 8:
                case 11:
                    return cardHeight/170*82.5;
            }
        };

        function posY(pos) {
            switch (pos) {
                case 0:
                case 1:
                case 2:
                    return cardHeight/170*4;
                case 3:
                case 4:
                case 5:
                    return cardHeight/170*45;
                case 6:
                case 7:
                case 8:
                    return cardHeight/170*86;
                case 9:
                case 10:
                case 11:
                    return cardHeight/170*127;
            }
        };

        function color(pos) {
            switch (pos) {
                case 0:
                case 2:
                case 9:
                case 11:
                    return "blue";
                case 1:
                case 10:
                    return "green";
                case 4:
                case 7:
                    return "violet";
                case 3:
                case 5:
                case 6:
                case 8:
                    return "orange";
            }
        };

        this.updatePosXPosY = function() {
            this.posBorderX = posX(this.posBorder);
            this.posBorderY = posY(this.posBorder);
            this.posCenterX = posX(this.posCenter);
            this.posCenterY = posY(this.posCenter);
        };

        this.drawCard = function(svgCard) { //перерисовать карту
            this.updatePosXPosY();
            let borderBox = document.createElementNS(svgNS, 'rect');
            borderBox.setAttributeNS(null, 'x', this.posBorderX);
            borderBox.setAttributeNS(null, 'y', this.posBorderY);
            borderBox.setAttributeNS(null, 'fill', "none");
            borderBox.setAttributeNS(null, 'stroke', this.colorBorder);
            borderBox.setAttributeNS(null, 'stroke-width', 5);
            borderBox.setAttributeNS(null, 'width', borderBoxWidth);
            borderBox.setAttributeNS(null, 'height', borderBoxWidth);
            svgCard.append(borderBox);
        
            let centerBox = document.createElementNS(svgNS, 'rect');
            centerBox.setAttributeNS(null, 'x', this.posCenterX+6);
            centerBox.setAttributeNS(null, 'y', this.posCenterY+6);
            centerBox.setAttributeNS(null, 'fill', this.colorCenter);
            centerBox.setAttributeNS(null, 'width', borderBoxWidth-12);
            centerBox.setAttributeNS(null, 'height', borderBoxWidth-12);
            svgCard.append(centerBox);    
        };

    }
    let countVioletBorder = 0; //счётчики для полей в картах
    let countGreenBorder = 0;
    let countOrangeBorder = 0;
    let countBlueBorder = 0;
    let countVioletCenter = 0;
    let countGreenCenter = 0;
    let countOrangeCenter = 0;
    let countBlueCenter = 0;

    function createCard() {
        cardArr.push(new Card);
    }

    function drawSVG(i) {
        let svgCard = document.createElementNS(svgNS, 'svg'); //создаём поле svg
        svgCard.setAttributeNS(null, 'width', cardWidth);
        svgCard.setAttributeNS(null, 'height', cardHeight);
        svgCard.style.top = -boardTableTD[i].offsetTop - 300 + "px";//за пределами видимого экрана
        svgCard.style.left = -boardTableTD[i].offsetLeft - 250 + "px";
        boardTableTD[i].append(svgCard);//вставляем в td
        let a = cardArr.pop();//убираем последнюю карту из колоды
        tableCardArr[i] = a;//записываем её в массив карт на столе
        a.drawCard(svgCard); //вызываем метод по отрисовке карты
    }

    for (let i=0; i<60; i++) { //создать 60 карт
        createCard();
    }

    function openCard() {
        let newCardCount = 0;//проверяем сколько карт нужно выложить на поле
        for (let i=0; i<boardTableTD.length; i++) { //для каждой td
            if (!boardTableTD[i].firstChild && cardArr.length) { //если td ничего не содержит и кары есть в колоде
                drawSVG(i); //создать SVG и нарисовать карту
                ++newCardCount; //увеличиваем счётчик карт
            }
        }
        let timerIDOpenCard = setInterval(()=>{
            for (let i=0; i<boardTableTD.length; i++) { //для каждой td
                if (!boardTableTD[i].firstChild) { //если td ничего не содержит
                    clearInterval(timerIDOpenCard); //очистить интервал
                }
                else {
                    if  (parseFloat(boardTableTD[i].firstChild.style.top)<0) {//если карта за пределами экрана
                        soundPlay.call(soundCard); //добавить звук
                        boardTableTD[i].firstChild.style.top = 0 + "px"; //присовоить карте top и left 0 относительно td;
                        boardTableTD[i].firstChild.style.left = 0 + "px";
                        break;
                    }
                }
            }
            --newCardCount; //уменьшить счётчик карт
            if (newCardCount<0) { //если новых карт не осталось
                clearInterval(timerIDOpenCard); //очистить интервал
            }
        }, 200)
    }

    (function openCardFirst() { //первая отрисовка карт
        let newCardCountStart = 16;
        for (let i=0; i<boardTableTD.length; i++) {
            drawSVG(i);
        }
        let timerIDOpenCardFirst = setInterval(()=>{ //выложить 16 карт
            soundPlay.call(soundCard);
            for (let i=0; i<boardTableTD.length; i++) {
                if  (parseFloat(boardTableTD[i].firstChild.style.top)<0) {
                    boardTableTD[i].firstChild.style.top = 0 + "px";
                    boardTableTD[i].firstChild.style.left = 0 + "px";
                    break;
                }
            }
            --newCardCountStart;
            if (newCardCountStart<0) {//через 16 карт
                clearInterval(timerIDOpenCardFirst); //очистить интервал
                eventListner(); //добавить слушателей событий
                if (timeUse) { //если игра на время
                    timerIDCountTime = setInterval(countDown, 1000); //запустить обратный отсчёт до конца игры
                }
            }
        }, 200)

    })();

    function countDown() {
        --timeStart; 
        timeCount.innerText = "Оставшееся время: " +(timeStart-timeStart%60)/60+ " мин, " +timeStart%60 + " сек";
        if (timeStart==0) {//когда время игры закончится
            saveLocalScore(scoreCount); //сохранить счёт
            clearInterval(timerIDCountTime); //очистить интервал
            timerIDCountTime=null;
            window.location.hash = "#result"; //перейти на страницу с результатами
            return;
        }
    }

    function eventListner() {
        boardTable.addEventListener('click',(e)=>{             //по клику на карту из игрового поля 4*4 переместить карту на поле для трансформации
            if (!activeCard) { //если на поле для трансформации нет карты                
                for (let i=0; i<boardTableTD.length; i++) {
                    if (e.path[1]==boardTableTD[i] || e.path[2]==boardTableTD[i]) {//найти карту на которой было событие
                        soundPlay.call(soundCard);
                        btnMatch.disabled = true; //задизейблить кнопки мэтч и заменить карты
                        btnChangeCards.disabled = true; 

                        let activeSvg = boardTableTD[i].firstChild; 
                        activeSvg.style.left = flipFieldPosX-boardTableTD[i].offsetLeft+"px";  //переместить карту на координаты поля для трансформаций
                        activeSvg.style.top = flipFieldPosY-boardTableTD[i].offsetTop+"px";
                        activeCard = tableCardArr[i]; //назначить карту активной
                        tableCardArr[i] = null; //убрать активную карту из игрового поля
                        let timerIDToFlip = setTimeout(()=>{ 
                            flipField.style.border = "none";
                            activeSvg.style.top = 0+"px";
                            activeSvg.style.left = 0+"px";
                            flipField.append(activeSvg);
                        },replaseTime)
                    }
                }
            }
        });
        
        boardTable.addEventListener('contextmenu',(e)=>{   //по правому клику на карту из игрового поля 4*4 переместить карту на поле мэтч
            soundPlay.call(soundCard);
            e.preventDefault();
            if (!timerIDToFlip){ 
                for (let i=0; i<boardTableTD.length; i++) {
                    if (e.path[1]==boardTableTD[i] || e.path[2]==boardTableTD[i]) { //найти где возникло событие
                        btnChangeCards.disabled = true; //задизейблить кнопку для смены карт
                        let activeSvg = boardTableTD[i].firstChild;
                        activeSvg.style.left = matchFieldPosX-boardTableTD[i].offsetLeft+"px"; //переместить крту на координаты поля мэтч
                        activeSvg.style.top = matchFieldPosY-boardTableTD[i].offsetTop+"px";
                        matchCardArr.push(tableCardArr[i]); //добавить карту в массив  мэтч
                        tableCardArr[i] = null; //присвоить null карте из массива карт на игровом поле
                        timerIDToFlip = setTimeout(()=>{ 
                            matchField.style.border = "none";
                            activeSvg.style.top = 0+"px";
                            activeSvg.style.left = 0+"px";
                            matchField.append(activeSvg);
                            timerIDToFlip = null;
                        },replaseTime)
                    }
                }
            }
            
        });
        
        flipField.addEventListener('click',(e)=>{ //по клику на поле трансформации переместить карту на поле мэтч
            if (flipField.innerHTML) {//если на поле для трансформации есть карта
                btnMatch.disabled = false; //раздизейблить кнопку мэтч
                soundPlay.call(soundCard); 
                let activeSvg = flipField.firstChild;
                activeSvg.style.left = matchFieldPosX-flipFieldPosX+"px"; //переместить карту на координаты поля мэтч
                activeSvg.style.top = matchFieldPosY-flipFieldPosY+"px";
                flipField.style.border = "1px solid black";
                matchCardArr.push(activeCard); //добавить активную карту в массив ддля проверки совпадений
                activeCard = null;
                // degStart = 0;
                let timerID = setTimeout(()=>{
                    matchField.style.border = "none";
                    activeSvg.style.top = 0+"px";
                    activeSvg.style.left = 0+"px";
                    matchField.append(activeSvg);
                },replaseTime)
            }
        })
        
        btnRotate.addEventListener('click', (e) => { //повернуть карту
            if (!flipField.firstChild || timerIDRound) return;
            soundPlay.call(soundCard);
            flipField.firstChild.style.transform=`rotate(180deg)`;//добавить трансформацию поворота 
            activeCard.posBorder = 11-activeCard.posBorder; //изменить позицию элемента рамки в карте 
            activeCard.posCenter = 11-activeCard.posCenter; //изменить позицию элемента центра в карте 
            timerIDRound = setTimeout(()=>{ //после трансформации перерисовать карту
                flipField.innerHTML = "";
                let svgCard = document.createElementNS(svgNS, 'svg');
                svgCard.setAttributeNS(null, 'width', cardWidth);
                svgCard.setAttributeNS(null, 'height', cardHeight);
                svgCard.style.top = 0 + "px";
                svgCard.style.left = 0 + "px";
                flipField.append(svgCard);
                activeCard.drawCard(svgCard);
                timerIDRound = null;
            },replaseTime);
        })
        
        btnFlipX.addEventListener('click', (e) => { //перевернуть карту относительно горизонтали
            if (!flipField.firstChild ||timerIDFlip) return;
            soundPlay.call(soundCard);
            let svg = flipField.firstChild; 
            svg.style.border = "none"; //перерисовать в svg границу как дочерний элемент rect
            let borderCard = document.createElementNS(svgNS, 'rect');
            borderCard.setAttributeNS(null, 'x', 0);
            borderCard.setAttributeNS(null, 'y', 0);
            borderCard.setAttributeNS(null, 'fill', "none");
            borderCard.setAttributeNS(null, 'stroke', "black");
            borderCard.setAttributeNS(null, 'stroke-width', 2);
            borderCard.setAttributeNS(null, 'rx', 5);
            borderCard.setAttributeNS(null, 'ry', 5);
            borderCard.setAttributeNS(null, 'width', cardWidth);
            borderCard.setAttributeNS(null, 'height', cardHeight);
            svg.append(borderCard);
        
            let borderBox = svg.firstChild; //найти элемент рамки в карте 
            let centerBox = borderBox.nextSibling; //найти элемент центра в карте 
        
            let firstBoxY = borderBox.getAttributeNS(null, 'y'); //найти положение Y и высоту элемента рамки в карте 
            let firstBoxHeight = borderBox.getAttributeNS(null, 'height');
        
            let secondBoxY = centerBox.getAttributeNS(null, 'y'); //найти положение Y и высоту элемента центра в карте 
            let secondBoxHeight = centerBox.getAttributeNS(null, 'height');
        
            let angl = 0; //начальный угол
            const deg = Math.PI/180;
            
            timerIDFlip = requestAnimationFrame(animFrame);
            function animFrame() {
                angl+=4; //поворачивать на 4 градуса
                let borderYMove = cardHeight/2-cardHeight/2*Math.cos(angl*deg); //изменять положение Y и высоту рамки карты
                let cardHeightMove = Math.abs(cardHeight*Math.cos(angl*deg));
        
                borderCard.setAttributeNS(null, 'y', (angl<=90)?borderYMove:(cardHeight-borderYMove));
                borderCard.setAttributeNS(null, 'height', cardHeightMove);
        
                function updateY(posY, heightEl) { //расчитать положение Y для внутренних элемеентов карты
                    if (posY<cardHeight/2) {//если элемент в верхней части карты
                        return (angl<=90)?(cardHeight/2-(cardHeight/2-posY)*Math.cos(angl*deg)):(Math.abs((cardHeight/2-posY-heightEl)*Math.cos(angl*deg))+cardHeight/2);
                    }
                    else {
                        return (angl<=90)?(cardHeight/2-(cardHeight/2-posY)*Math.cos(angl*deg)):(cardHeight/2-(cardHeight/2-posY-heightEl)*Math.cos(angl*deg));
                    }
                }
        
                function updateHeight(heightEl) { //расчитать высоту для внутренних элемеентов карты
                    return Math.abs((angl<=90)?(cardHeight/2-updateY(firstBoxY)-(cardHeight/2-firstBoxY-heightEl)*Math.cos(angl*deg)):((cardHeight/2-firstBoxY)*Math.cos(angl*deg)-(cardHeight/2-firstBoxY-heightEl)*Math.cos(angl*deg)));   
                }
        
                borderBox.setAttributeNS(null, 'y', updateY(firstBoxY, firstBoxHeight)); //перерисовать положение Y и высоту элемента рамки в карте
                borderBox.setAttributeNS(null, 'height', updateHeight(firstBoxHeight));
                
                centerBox.setAttributeNS(null, 'y', updateY(secondBoxY, secondBoxHeight));//перерисовать положение Y и высоту элемента центра в карте
                centerBox.setAttributeNS(null, 'height', updateHeight(secondBoxHeight));
                
                if (angl==180) {//если угол 180
                    cancelAnimationFrame(timerIDFlip); //прекратить анимацию
                    timerIDFlip = null;
                    updateFlipCard(); //перерисовать карту
                    return;
                }
                timerIDFlip = requestAnimationFrame(animFrame);
            }
        
            function newPosFlipX(pos) {
                if (pos<=2) return pos+9;
                if (pos>=3 && pos<=5) return pos+3;
                if (pos>=6 && pos<=8) return pos-3;
                if (pos>=9) return pos-9;
            }
            activeCard.posBorder = newPosFlipX(activeCard.posBorder); //пересчитать свойства карты
            activeCard.posCenter = newPosFlipX(activeCard.posCenter);
        
            function updateFlipCard() {
                flipField.firstChild.innerHTML = "";
                svg.style.border = "2px solid black";
                activeCard.drawCard(flipField.firstChild);
            }
        })
        
        btnFlipY.addEventListener('click', (e) => { //перевернуть карту относительно вертикали
            
            if (!flipField.firstChild ||timerIDFlip) return;
            soundPlay.call(soundCard);
            let svg = flipField.firstChild;
            svg.style.border = "none"; //перерисовать в svg границу как дочерний элемент rect
            let borderCard = document.createElementNS(svgNS, 'rect');
            borderCard.setAttributeNS(null, 'x', 0);
            borderCard.setAttributeNS(null, 'y', 0);
            borderCard.setAttributeNS(null, 'fill', "none");
            borderCard.setAttributeNS(null, 'stroke', "black");
            borderCard.setAttributeNS(null, 'stroke-width', 2);
            borderCard.setAttributeNS(null, 'rx', 5);
            borderCard.setAttributeNS(null, 'ry', 5);
            borderCard.setAttributeNS(null, 'width', cardWidth);
            borderCard.setAttributeNS(null, 'height', cardHeight);
            svg.append(borderCard);
        
            let borderBox = svg.firstChild; //найти элемент рамки в карте 
            let centerBox = borderBox.nextSibling; //найти элемент центра в карте 
            
            let firstBoxX = borderBox.getAttributeNS(null, 'x');  //найти положение Х и ширину элемента рамки в карте 
            let firstBoxWidth = borderBox.getAttributeNS(null, 'width');
        
            let secondBoxX = centerBox.getAttributeNS(null, 'x'); //найти положение Х и ширину элемента центра в карте 
            let secondBoxWidth = centerBox.getAttributeNS(null, 'width');
        
            let angl = 0; //начальный угол
            const deg = Math.PI/180;
        
            timerIDFlip = requestAnimationFrame(animFrame);
            function animFrame() {
                angl+=4; //поворачивать на 4 градуса
                let borderXMove = cardWidth/2-cardWidth/2*Math.cos(angl*deg); //изменять положение Х и ширину рамки карты
                let cardWidthMove = Math.abs(cardWidth*Math.cos(angl*deg));
        
                borderCard.setAttributeNS(null, 'x', (angl<=90)?borderXMove:(cardWidth-borderXMove));
                borderCard.setAttributeNS(null, 'width', cardWidthMove);
        
                function updateX(posX, widthEl) { //пересчитать положение Х элемента
                    if (posX==cardHeight/170*2.5 || posX==cardHeight/170*2.5+6) { //если элемент слева
                        return (angl<=90)?(cardWidth/2-(cardWidth/2-posX)*Math.cos(angl*deg)):(Math.abs((cardWidth/2-posX-widthEl)*Math.cos(angl*deg))+cardWidth/2);
                    }
                    else if (posX==cardHeight/170*42.5 || posX==cardHeight/170*42.5+6) { //если элемент посередине
                        return (angl<=90)?(cardWidth/2-(cardWidth/2-posX)*Math.cos(angl*deg)):(cardWidth/2+(cardWidth/2-posX)*Math.cos(angl*deg));
                    }
                    else if (posX==cardHeight/170*82.5 || posX==cardHeight/170*82.5+6) {//если элемент справа
                        return (angl<=90)?(cardWidth/2-(cardWidth/2-posX)*Math.cos(angl*deg)):(cardWidth/2-(cardWidth/2-posX-widthEl)*Math.cos(angl*deg));
                    }
                }
        
                function updateWidth(widthEl) { //пересчитать ширину элемента
                    return Math.abs((angl<=90)?(cardWidth/2-updateX(firstBoxX)-(cardWidth/2-firstBoxX-widthEl)*Math.cos(angl*deg)):((cardWidth/2-firstBoxX)*Math.cos(angl*deg)-(cardWidth/2-firstBoxX-widthEl)*Math.cos(angl*deg)));   
                }
        
                borderBox.setAttributeNS(null, 'x', updateX(firstBoxX, firstBoxWidth)); //перерисовать положение Х и ширину элемента рамки в карте
                borderBox.setAttributeNS(null, 'width', updateWidth(firstBoxWidth));
        
                centerBox.setAttributeNS(null, 'x', updateX(secondBoxX, secondBoxWidth)); //перерисовать положение Х и ширину элемента центра в карте
                centerBox.setAttributeNS(null, 'width', updateWidth(secondBoxWidth));
                
                if (angl==180) { //если угол 180
                    cancelAnimationFrame(timerIDFlip); //прекратить анимацию
                    timerIDFlip = null; 
                    updateFlipCard(); //перерисовать карту
                    return;
                }
                timerIDFlip = requestAnimationFrame(animFrame);
            }
        
            function newPosFlipY(pos) {
                if (pos%3==0) return pos+2;
                if (pos==1 || pos==4 || pos==7 || pos==10) return pos;
                if (pos==2 || pos==5 || pos==8 || pos==11) return pos-2;
            }
            activeCard.posBorder = newPosFlipY(activeCard.posBorder); //пересчитать свойства карты
            activeCard.posCenter = newPosFlipY(activeCard.posCenter);
        
            function updateFlipCard() {
                flipField.firstChild.innerHTML = "";
                svg.style.border = "2px solid black";
                activeCard.drawCard(flipField.firstChild);
            } 
        })
        
        btnMatch.addEventListener('click', (e) => { //проверка совпадений
            let winArr = [];//массив для отпределения положений внутренних элементов каждой карты
            for (let i=0; i<12; i++) {
                winArr[i] = 0;
            }
            for (let i=0; i<matchCardArr.length; i++) {//для каждой карты из стопки совпадений
                winArr[matchCardArr[i].posBorder] +=1; //в положение  элемента границы +1
                winArr[matchCardArr[i].posCenter] +=100; //в положение  элемента центра +100
            }
        
            if (!(winArr.some((v)=>(v!=0 && v!=101)))) {//если все элементы 0 или 101
                scoreCount+=(matchCardArr.length-1)*matchCardArr.length;//увеличиваем очки
                soundPlay.call(soundRight);
                openCard();//открываем новые карты
            }
            else { //иначе
                scoreCount+=-matchCardArr.length;//снижаем очки
                soundPlay.call(soundWrong);
                let wrongArr = matchField.querySelectorAll('svg'); //массив карт, которые нужно вернуть на игровое поле
                let n=0;
                for (let i=0; n<wrongArr.length; i++) {
                    if (!boardTableTD[i].firstChild) {//найти пустые места в таблице 
                        wrongArr[n].style.top = 0+"px";//переместить обратно карты
                        wrongArr[n].style.left = 0+"px";
                        boardTableTD[i].append(wrongArr[n]); 
                        tableCardArr[i] = matchCardArr[n]; //вернуть карты в массив игровых карт поля
                        n++;
                    }  
                }
            }
            score.innerText="Счёт: " + scoreCount;//показать счёт
            matchCardArr=[];//очистить массив совпадений
            match.innerHTML = "";//убрать карты из поля мэтч
            match.style.border = "1px solid black";
            
            if (cardArr.length>0) {
                btnChangeCards.disabled = false;//если карт не осталось в колоде задизейблить кнопку замены карт
            }
        
            if (!tableCardArr.some((v)=> v!=null)) {//если не осталось карт на столе 
                scoreCount+=100; //добавить 100 очков
                saveLocalScore(scoreCount); //сохранить счёт
                window.location.hash = "#result";
            }
        })
        
        btnSave.addEventListener('click', (e)=>{
            if (timeUse) {
                clearInterval(timerIDCountTime);
                timerIDCountTime=null;
            }
            saveLocalScore(scoreCount); //сохранить счёт
            window.location.hash = "#result"; //перейти к результатам
        })
        
        btnChangeCards.addEventListener('click', (e)=>{ //заменить 4 случайные карты
            let nrandom = 0;
            if (cardArr.length>0) { 
                for (let i=0; i<4; i++) {
                    let numRandom = Math.floor(Math.random()*(3-0+1)); //случайное число от 0 до 4
                    numRandom+=nrandom; 
                    nrandom += 4; //увеличить случайное число на 4 к следующей иттерации
                    cardArr.unshift(tableCardArr[numRandom]); //положить случайную карту в начало колоды
                    tableCardArr[numRandom] = null; //очистить ячейку таблицы
                    boardTableTD[numRandom].innerHTML = "";
                }
                openCard();//открыть карту
            }
        })     
    }

    function saveLocalScore(score) { //сохранить счёт пользователя в ls
        let clientData = {
            "name": JSON.parse(localStorage.getItem('match')).name,
            "time": JSON.parse(localStorage.getItem('match')).time,
            "score": score
        }
        soundPlay.call(soundClap);
        localStorage.setItem('match', JSON.stringify(clientData));
    } 
}