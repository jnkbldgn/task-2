// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function(b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function(b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

// START =====================  Код второй двери =======================
/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    let buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    let unlockAreas = [
        this.popup.querySelector('.door-riddle__unlock-area_0'),
        this.popup.querySelector('.door-riddle__unlock-area_1'),
        this.popup.querySelector('.door-riddle__unlock-area_2')
    ];

    const contentElement = this.popup.querySelector('.popup__content');

    let cloneElement = null;

    buttons.forEach((b, index) => {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointermove', _onButtonPointerMove.bind(this, index));
        b.addEventListener('pointerleave', _onButtonPointerLeave.bind(this));
        b.parentElement.addEventListener('pointermove', _onButtonPointerMove.bind(this, index));
        b.parentElement.addEventListener('pointerup', _onParentPointerUp.bind(this, index));
    });

    function _onButtonPointerDown(e){
        if(e.target.classList.contains('button-disabled')){
            return;
        }
        cloneElement = e.target.cloneNode(true);
        
        if(cloneElement){
            cloneElement.classList.add('door-riddle__button-clone');
            contentElement.appendChild(cloneElement);
            cloneElement.hidden = true;
        }
        e.target.classList.add('door-riddle__button_pressed');
    }
    
    function _onButtonPointerUp(e) {
        cloneElement = removeClone(cloneElement);
        unPressedButton(e.target);
    }
    function _onParentPointerUp(index, e){
        cloneElement = removeClone(cloneElement);
        unPressedButton(e.target.querySelector('.door-riddle__button_pressed'));
        const isFocusArea = checkArea(e.clientX, e.clientY, index);
        if(isFocusArea){
            buttons[index].classList.add('button-disabled');
            unlockAreas[index].classList.add('complite');
            if(buttons[index + 1] && buttons[index + 1].classList.contains('button-disabled')){
                buttons[index + 1].classList.remove('button-disabled')
            } else {
                setTimeout(checkCondition.bind(this), 500);
            }
        }
    }
    function _onButtonPointerMove(index, e){
        if(cloneElement){
            moveClone(cloneElement, e);
            cloneElement.hidden = true;
            const isFocusArea = checkArea(e.clientX, e.clientY, index);
            if(isFocusArea){
                unlockAreas[index].classList.add('focus-area');
            } else if(unlockAreas[index].classList.contains('focus-area')){
                unlockAreas[index].classList.remove('focus-area');
            }
            cloneElement.hidden = false;
            
        }
    }
    function _onButtonPointerLeave(e){
        e.target.parentElement.setPointerCapture(e.pointerId);
    }
    //Проверяем какой элемент под указателем
    function checkArea(x, y, index){
        elementPoint = document.elementFromPoint(x, y)
        return elementPoint.classList.contains('door-riddle__unlock-area_' + index);
    }

    //Перемещение клона елемента
    function moveClone(element, e){
        element.hidden = false;
        element.style.left =  (e.clientX - contentElement.getBoundingClientRect().left) - element.offsetHeight/2 + 'px';
        element.style.top = (e.clientY - contentElement.getBoundingClientRect().top)- element.offsetWidth/2 + 'px';
    }

    //Обработка отрыва указателя от кнопки
    function unPressedButton(element){
        element && element.classList.contains('door-riddle__button_pressed') && element.classList.remove('door-riddle__button_pressed');
    }

    //Удаляем клон
    function removeClone(element){
        contentElement.contains(element) && contentElement.removeChild(element);
        return null;
    }

    //Проверяем дверь на открытие
    function checkCondition() {
        var isOpened = true;
        unlockAreas.forEach(function(area) {
            if (!area.classList.contains('complite')) {
                isOpened = false;
            }
        });
        if (isOpened) {
            this.unlock();
        }
    }

}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

// END =====================  Код второй двери =======================

// START =====================  Код третьей двери =======================
/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    let buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];
    
    let buttonsInCircle = []; 

    const unlockCircle = this.popup.querySelector('.door-riddle__unlock-circle'); 
    const contentElement = this.popup.querySelector('.popup__content');
    let positions = []; 

    buttons.forEach((b, index) => {
        positions.push({left: b.offsetLeft + "px", top: b.offsetTop + "px"});
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointermove', _onButtonPointerMove.bind(this, index));
        b.addEventListener('pointerleave', _onButtonPointerLeave.bind(this));
    });

    function _onButtonPointerDown(e){
        e.target.classList.add('door-riddle__button_pressed');
    }
    function _onButtonPointerMove(index, e){
        if(!e.target.classList.contains('door-riddle__button_pressed')){
         return;   
        }
        moveElement(e.target, e);
        e.target.hidden = true;
        const isFocusArea = checkComplite(e.clientX, e.clientY);
        let inCircleIndex = buttonsInCircle.indexOf(index);
        if(isFocusArea){
            e.target.classList.add('in-circle');
            !(inCircleIndex >= 0) && buttonsInCircle.push(index); 
        } else if (inCircleIndex >= 0){
            e.target.classList.remove('in-circle');
            buttonsInCircle.splice(inCircleIndex, 1);
        }
        e.target.hidden = false;
        if (checkCompliteAll()){
            unlockCircle.classList.add("door-riddle__unlock-circle-complite");
        } else {
            unlockCircle.classList.remove("door-riddle__unlock-circle-complite");
        };
    }

    function _onButtonPointerUp(e){
        checkCondition.apply(this);
    }
    
    function _onButtonPointerLeave(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    //Перемещение елемента
    function moveElement(element, e){
        element.style.left =  (e.clientX - contentElement.getBoundingClientRect().left) - element.offsetHeight/2 + 'px';
        element.style.top = (e.clientY - contentElement.getBoundingClientRect().top)- element.offsetWidth/2 + 'px';
    }

    //Проверяем елемент под указателем
    function checkComplite(x, y, index){
        elementPoint = document.elementFromPoint(x, y)
        return elementPoint.classList.contains('door-riddle__unlock-circle');
    }

   //Проверяем что все указатели в круге
    function checkCompliteAll() {
        return buttonsInCircle.length === 3;
    }

    //Сброс на первоначальное состояние
    function resetElements(){
        buttonsInCircle = [];
        buttons.forEach((b, index) => { 
            b.classList.remove('door-riddle__button_pressed');
            b.style.left = positions[index].left;
            b.style.top = positions[index].top;
        });
        unlockCircle.classList.remove("door-riddle__unlock-circle-complite");
    }

    //Проверяем дверь на открытие
    function checkCondition() {
        if (checkCompliteAll()) {
            this.unlock();
        } else {
            resetElements();
        }
    }
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

// END =====================  Код третьей двери =======================

// START =====================  Код сундука =======================
/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    let countComplited = 0;

    let buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1')
    ];

    let unlockAreas = [
        this.popup.querySelector('.door-riddle__unlock-area_0'),
        this.popup.querySelector('.door-riddle__unlock-area_1'),
        this.popup.querySelector('.door-riddle__unlock-area_2'),
        this.popup.querySelector('.door-riddle__unlock-area_3'),
        this.popup.querySelector('.door-riddle__unlock-area_4'),
        this.popup.querySelector('.door-riddle__unlock-area_5'),
    ];
    const contentElement = this.popup.querySelector('.popup__content');
    let positions = [];
    let buttonsInArea = [];

    buttons.forEach((b, index) => {
        positions.push({left: b.offsetLeft + "px", top: b.offsetTop + "px"});
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointermove', _onButtonPointerMove.bind(this, index));
        b.addEventListener('pointerleave', _onButtonPointerLeave.bind(this));
    });

    function _onButtonPointerDown(e){
        e.target.classList.add('door-riddle__button_pressed');
        this.popup.querySelectorAll('.unlock-area_' + countComplited).forEach(elem => {
            elem.classList.remove("area-disabled");
        });
    }
    function _onButtonPointerMove(index, e){
        if(!e.target.classList.contains('door-riddle__button_pressed')){
         return;   
        }
        moveElement(e.target, e);
        e.target.hidden = true;
        const isFocusArea = checkComplite(e.clientX, e.clientY, index);
        if(isFocusArea){
            this.popup.querySelectorAll('.unlock-area_' + countComplited).forEach(elem => {
                elem.classList.add("complite");
            });
        }
        checkCompliteArea.apply(this);
        e.target.hidden = false;
    }

    function _onButtonPointerUp(e){
        if (!checkCondition.apply(this));{
            resetElements();
        }
    }
    
    function _onButtonPointerLeave(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }
    //Перемещение элемента
    function moveElement(element, e){
        element.style.left =  (e.clientX - contentElement.getBoundingClientRect().left) - element.offsetHeight/2 + 'px';
        element.style.top = (e.clientY - contentElement.getBoundingClientRect().top)- element.offsetWidth/2 + 'px';
    }

    //Проверяем елемент под указателем
    function checkComplite(x, y, index){
        let twoPoints = true;
        let indexInComplite = buttonsInArea.indexOf(index);
        buttons.forEach(button => {
            if (!button.classList.contains('door-riddle__button_pressed')){
                twoPoints = false;
            }
        });
        elementPoint = document.elementFromPoint(x, y);
        if(elementPoint.classList.contains('unlock-area_' + countComplited) && !elementPoint.classList.contains('complite')){
            indexInComplite == -1 && buttonsInArea.push(index);
        } else if (!elementPoint.classList.contains('unlock-area_' + countComplited)){
            indexInComplite >=  0 && buttonsInArea.splice(indexInComplite, 1);
        }
        return twoPoints && buttonsInArea.length === 2;
    }

    function checkCompliteArea(){
        let complite = true;

        this.popup.querySelectorAll('.unlock-area_' + countComplited).forEach(elem => {
            if (!elem.classList.contains('complite')){
                complite = false;
            }
        });

        if(complite){
            this.popup.querySelectorAll('.unlock-area_' + countComplited).forEach(elem => {
                elem.classList.add("complite");
            });
            buttonsInArea = [];
            countComplited += 1;
            this.popup.querySelectorAll('.unlock-area_' + countComplited).forEach(elem => {
                elem.classList.remove("area-disabled");
            });
        }
        checkCondition.apply(this);
    }

    //Сброс на первоначальное состояние
    function resetElements(){
        buttons.forEach((button, index) => {
            button.classList.contains('door-riddle__button_pressed') && button.classList.remove('door-riddle__button_pressed');
            button.style.left = positions[index].left;
            button.style.top = positions[index].top;
        });
        unlockAreas.forEach(area => {
            area.classList.contains('complite') && area.classList.remove('complite');
            area.classList.add('area-disabled');
        });
        buttonsInArea = [];
        countComplited = 0;
    }

    //Проверяем что выполнены все действия для открытия
    function checkCompliteAll(){
        return countComplited === 3;
    }

    function checkCondition() {
        if (checkCompliteAll()) {
            this.unlock();
        }
        return false;
    }
    
    this.showCongratulations = function() {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;

// END =====================  Код сундука =======================
