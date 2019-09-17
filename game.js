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
    var currentDraggableDetail = { detail: null, x: 0, y: 0 ,name:null};
    var screensArray = [];
    var holeSpritesArray = [];
    var holesContentArray = [];
    var screensContainer = sceneHref.add.container(0, 0);
    var holesContainer = sceneHref.add.container(0, 0);
    var tilesContainer = sceneHref.add.container(0, 0);
    var objectiveArray = [];
    var detailsMap = new Map([
        ["circle", "figure-circle.png"],
        ["cross", "figure-cross.png"],
        ["gear", "figure-gear.png"],
        ["square", "figure-square.png"],
        ["tri", "figure-tri.png"],
    ]);

    setupGameScene();
    setupObjective();


        const helloButton = this.add.text(100, 100, 'Hello Phaser!', { fill: '#0f0' });
        helloButton.setInteractive();


    function setupObjective() {
        for (let i = 0; i < numOfItems; i++) {
            var items = Array.from(detailsMap);
            var rndElement = items[Math.floor(Math.random() * items.length)];
            objectiveArray.push(rndElement[0]);
        }
    }

    function showSolution() {
        for (let i = 0; i < screensArray.length; i++) {
            changeGreenIcon(screensArray[i].iconsMap, objectiveArray[i]);
        }
    }

    function testCondition() {
        //проверка условия победы
        // return array[1,2,3];
    }

    function showResultOfChecking() {
        //вывод ответа проверки
    }

    function checkAnswer() {
        var answer = testCondition;
        if (testCondition[0] == numOfItems) {
            endGame();
        }
        showResultOfChecking();
    }

    function endGame() {
        showSolution();
    }

    function setupGameScene() {
        screenCenter = { "x": game.scale.width / 2, "y": game.scale.height / 2 };
        background = sceneHref.add.sprite(screenCenter.x, screenCenter.y, "mainatlas", "panel.png");
        setupScreensAndHoles();
        setDetailsArray();
        var centerPunkt = 290;
        var deltaScreens = centerPunkt - ((greenScreenElementWidth / 2) * (numOfItems - 1));
        setNewPosition(screensContainer, deltaScreens, 164);
        setNewPosition(holesContainer, deltaScreens, 280);
        setNewPosition(tilesContainer, 80, 380);
        background.depth = -50;
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
            value.depth= 5;
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
            
            if (checkCoordinateRadius(pointX, pointY, centerX, centerY) && holesContentArray[i]==null) {
                newX = centerX - tilesContainer.x;
                newY = centerY - tilesContainer.y;
                holesContentArray[i] = gameObject.name;
                break;
            } else {
                newX = currentDraggableDetail.x;
                newY = currentDraggableDetail.y;
            }

        }
        moveTweenDetail(gameObject,newX,newY);
        currentDraggableDetail.detail = null;
        
    });

    function moveTweenDetail(detail, newX, newY) {
        console.log(holesContentArray);
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

    //checkCoordinateRadius(game.input.mousePointer.x, game.input.mousePointer.y, holeSpritesArray[1].x + holesContainer.x, holeSpritesArray[1].y + holesContainer.y);
    //console.log(holeSpritesArray[1].x + holesContainer.x);
}

