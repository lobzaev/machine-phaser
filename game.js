var config = {
    type: Phaser.AUTO,
    //parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var numOfItems = 3;
var game = new Phaser.Game(config);
var screenCenter;
var sceneHref;

function preload() {

    this.load.atlas('mainatlas', 'src/mainSprite.png', 'src/mainSprite.json');

}

function create() {
    sceneHref = this;

    var greenScreenElementWidth;
    var background;
    var currentDraggableDetail = { detail: null, x: 0, y: 0, name: null };
    var screensArray = [];
    var holeSpritesArray = [];
    var holesContentArray = [];
    var screensContainer = sceneHref.add.container(0, 0);
    var holesContainer = sceneHref.add.container(0, 0);
    var tilesContainer = sceneHref.add.container(0, 0);
    var objectiveArray = [];
    var counter1_txt;
    var counter2_txt;
    var lamp1;
    var lamp2;
    var checkBtn;
    var detailsMap = new Map([
        ["circle", "figure-circle.png"],
        ["cross", "figure-cross.png"],
        ["gear", "figure-gear.png"],
        ["square", "figure-square.png"],
        ["tri", "figure-tri.png"],
    ]);

    setupGameScene();
    setupObjective();

    function setupObjective() {
        for (let i = 0; i < numOfItems; i++) {
            var items = Array.from(detailsMap);
            var rndElement = items[Math.floor(Math.random() * items.length)];
            objectiveArray.push(rndElement[0]);
        }
    }

    function showSolution() {
        //console.log("show solution function");
        for (let i = 0; i < screensArray.length; i++) {
            changeGreenIcon(screensArray[i].iconsMap, objectiveArray[i]);
        }
    }

    function testCondition() {
        var result = [0, 0];
        for (let i = 0; i < holesContentArray.length; i++) {
            if (objectiveArray[i] == holesContentArray[i]) {
                result[0] += 1;
            }
        }
        var tempArray = [];
        for (let k = 0; k < holesContentArray.length; k++) {
            var flag = true;
            if (tempArray.length > 0) {
                for (let n = 0; n < tempArray.length; n++) {
                    if (holesContentArray[k] == tempArray[n]) {
                        flag = false;
                    }
                }
            }
            if (flag) {
                for (let j = 0; j < objectiveArray.length; j++) {
                    if (objectiveArray[j] == holesContentArray[k]) {
                        if (k != j) {
                            result[1] += 1;
                        }
                    }
                }
                tempArray.push(holesContentArray[k]);
            }
        }
        console.log(tempArray);
        return result;
    }

    function showResultOfChecking(answer) {
        changeNumbersOnScreens(answer[0], answer[1]);
    }

    function checkHolesContentArray() {
        var result = true;
        for (let i = 0; i < holesContentArray.length; i++) {
            if (holesContentArray[i] == null) {
                result = false;
            }

        }
        return result;
    }

    function checkAnswer() {

        if (checkHolesContentArray && holesContentArray.length == numOfItems) {

            var answer = testCondition();
            if (answer[0] == numOfItems) {
                endGame();
            }
            showResultOfChecking(answer);
        } else {
            console.log("can NOT be checked");
        }
    }

    function changeNumbersOnScreens(new1, new2) {
        counter1_txt.text = new1;
        counter2_txt.text = new2;
    }

    function endGame() {

        showSolution();
    }

    function setupGameScene() {
        console.log(objectiveArray);
        sceneHref.cameras.main.setBackgroundColor('#737373');
        counter1_txt = sceneHref.add.text(572, 165, '0', { fill: '#4de852', fontSize: '40px', fontStyle: 'bold' });
        counter2_txt = sceneHref.add.text(635, 165, '0', { fill: '#4de852', fontSize: '40px', fontStyle: 'bold' });
        screenCenter = { "x": game.scale.width / 2, "y": game.scale.height / 2 };
        var provod = sceneHref.add.sprite(screenCenter.x, screenCenter.y, "mainatlas", "provod.png");
        provod.setOrigin(0, 0);
        setNewPosition(provod, 600, 0);
        var lamp1 = sceneHref.add.sprite(screenCenter.x, screenCenter.y, "mainatlas", "lamp-green.png");
        var lamp2 = sceneHref.add.sprite(screenCenter.x, screenCenter.y, "mainatlas", "lamp-red.png");
        setNewPosition(lamp1, 583, 130);
        setNewPosition(lamp2, 648, 130);

        background = sceneHref.add.sprite(screenCenter.x, screenCenter.y, "mainatlas", "panel.png");
        setupScreensAndHoles();
        setDetailsArray();
        var centerPunkt = 290;
        var deltaScreens = centerPunkt - ((greenScreenElementWidth / 2) * (numOfItems - 1));
        setNewPosition(screensContainer, deltaScreens, 164);
        setNewPosition(holesContainer, deltaScreens, 280);
        setNewPosition(tilesContainer, 80, 380);
        background.depth = -50;

        setupCheckButton();
    }

    function setupCheckButton() {
        checkBtn = sceneHref.add.sprite(644, 390, "mainatlas", "btn-check-up.png").setInteractive();

        //this.startBtn.on('pointerover', function (event) { /* Do something when the mouse enters */ });
        //sceneHref.startBtn.on('pointerout', function (event) { /* Do something when the mouse exits. */ });
        checkBtn.on('pointerdown', function () {
            checkAnswer();
            checkBtn.setTexture("mainatlas", 'btn-check-dn.png');
        });
        checkBtn.on('pointerup', function () {
            checkBtn.setTexture("mainatlas", 'btn-check-up.png');
        });
    }

    function setupScreensAndHoles() {
        for (let i = 0; i < numOfItems; i++) {
            const element = numOfItems[i];
            var screenSprite = sceneHref.add.sprite(0, 0, "mainatlas", "screen1.png");
            screenSprite.x = screenSprite.displayWidth * i;
            var greenIconsMap = setGreenIconsArray(screenSprite.x);
            var screenObj = { screenImage: screenSprite, iconsMap: greenIconsMap };
            screensArray[i] = screenObj;
            screensContainer.add(screenObj.screenImage);
            screensContainer.sendToBack(screenObj.screenImage);
            changeGreenIcon(screenObj.iconsMap, "question");

            var holeSprite = sceneHref.add.sprite(0, 0, "mainatlas", "hole.png");
            holeSprite.x = holeSprite.displayWidth * i;
            holeSpritesArray[i] = holeSprite;
            holesContainer.add(holeSpritesArray[i]);

            greenScreenElementWidth = screenSprite.displayWidth;
        }
    }

    function setNewPosition(item, nX, nY) {
        item.x = nX;
        item.y = nY;
    }

    function setDetailsArray() {

        var tempMap = new Map();
        detailsMap.forEach(function (value, key) {
            tempMap.set(key, sceneHref.add.sprite(0, 0, "mainatlas", value));
        });

        var i = 0;
        tempMap.forEach(function (value, key) {
            value.name = key;
            value.setInteractive();
            value.depth = 5;
            value.x = 75 * i;
            value.y = (i % 2 * 30);
            tilesContainer.add(value);
            sceneHref.input.setDraggable(value);
            i += 1;
        });


    }

    sceneHref.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        if (currentDraggableDetail.detail == null) {
            currentDraggableDetail.detail = gameObject;
            currentDraggableDetail.x = gameObject.x;
            currentDraggableDetail.y = gameObject.y;
        }
        gameObject.x = dragX;
        gameObject.y = dragY;
        tilesContainer.moveUp(gameObject);

    });

    sceneHref.input.on('dragend', function (pointer, gameObject) {

        var newX;
        var newY;
        for (let i = 0; i < holeSpritesArray.length; i++) {
            const hole = holeSpritesArray[i];
            var pointX = gameObject.x + tilesContainer.x;
            var pointY = gameObject.y + tilesContainer.y;
            var centerX = hole.x + holesContainer.x;
            var centerY = hole.y + holesContainer.y;

            if (checkCoordinateRadius(pointX, pointY, centerX, centerY) && holesContentArray[i] == null) {
                newX = centerX - tilesContainer.x;
                newY = centerY - tilesContainer.y;
                holesContentArray[i] = gameObject.name;
                break;
            } else {
                newX = currentDraggableDetail.x;
                newY = currentDraggableDetail.y;
            }

        }
        moveTweenDetail(gameObject, newX, newY);
        currentDraggableDetail.detail = null;

    });

    function moveTweenDetail(detail, newX, newY) {
        //console.log(holesContentArray);
        sceneHref.tweens.add({
            targets: detail,
            x: newX,
            y: newY,
            ease: 'Back',
            duration: 200
            //onComplete: onCompleteHandler,
            //onCompleteParams: [image]
        });
    }

    function setGreenIconsArray(posX) {

        var iconsArray = new Map();
        var circle = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-circle.png");
        iconsArray.set("circle", circle);
        var cross = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-cross.png");
        iconsArray.set("cross", cross);
        var gear = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-gear.png");
        iconsArray.set("gear", gear);
        var question = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-question.png");
        iconsArray.set("question", question);
        var square = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-square.png");
        iconsArray.set("square", square);
        var tri = sceneHref.add.sprite(0, 0, "mainatlas", "icon-green-tri.png");
        iconsArray.set("tri", tri);

        for (let value of iconsArray.values()) {

            value.x = posX;
            screensContainer.add(value);
            value.visible = false;
        }

        return iconsArray;
    }

    function changeGreenIcon(map, iconToShow) {
        for (let value of map.values()) {
            value.visible = false;
        }
        map.get(iconToShow).visible = true;
    }

    function checkCoordinateRadius(pointX, pointY, centerX, centerY) {
        var result = false;
        var radius = 40;
        if ((pointX - centerX) * (pointX - centerX) + (pointY - centerY) * (pointY - centerY) <= radius * radius) {
            result = true;
        }
        return result;
    }



}

function update() {
    //console.log(game.input.mousePointer.x, game.input.mousePointer.y);
}

