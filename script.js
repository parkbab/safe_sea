const scenes = {
    main: document.getElementById("mainMenu"),
    mapSelect: document.getElementById("mapSelect"),
    dock: document.getElementById("dockScene"),
    beach: document.getElementById("beachScene")
};

const startBtn = document.getElementById("startBtn");
const dockBtn = document.getElementById("dockBtn");
const beachBtn = document.getElementById("beachBtn");
const backToMain = document.getElementById("backToMain");

const equipmentButtons = document.querySelectorAll(".equipment-button");
const inventoryPanel = document.getElementById("inventoryPanel");
const inventoryCloseBtn = document.getElementById("inventoryCloseBtn");
const inventorySlots = document.querySelectorAll(".inventory-slot");

const dockPlayer = document.getElementById("dockPlayer");
const beachPlayer = document.getElementById("beachPlayer");

const interactionGuide = document.getElementById("interactionGuide");
const interactionText = document.getElementById("interactionText");
const mobileInteractionBtn = document.getElementById("mobileInteractionBtn");

const dialogueBox = document.getElementById("dialogueBox");
const dialogueName = document.getElementById("dialogueName");
const dialogueText = document.getElementById("dialogueText");
const dialogueCloseBtn = document.getElementById("dialogueCloseBtn");

const mobileControls = document.getElementById("mobileControls");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const accidentScene = document.getElementById("accidentScene");
const failScene = document.getElementById("failScene");
const clearScene = document.getElementById("clearScene");
const accidentTitle = document.getElementById("accidentTitle");
const accidentText = document.getElementById("accidentText");

let currentScene = "main";
let currentPlayer = null;
let playerX = 42;

let movingLeft = false;
let movingRight = false;

let currentInteraction = null;
let dialogueOpen = false;

let hasLifeJacket = false;
let isLifeJacketEquipped = false;

const PLAYER_NORMAL_IMAGE = "images/player.png";
const PLAYER_VEST_IMAGE = "images/player_vest.png";

let lastMapBeforeAccident = "beach";

const moveSpeed = 0.35;

const mapSettings = {
    dock: {
        startX: 42,
        minX: 24,
        maxX: 50,
        top: 54.5
    },

    beach: {
        startX: 42,
        minX: 13,
        maxX: 85,
        top: 53.5
    }
};

const interactionZones = {
    dock: [
        {
            minX: 24,
            maxX: 30,
            type: "warehouse",
            text: "조사"
        },
        {
            minX: 46,
            maxX: 50,
            type: "enterSea",
            text: "이동"
        }
    ],

    beach: [
        {
            minX: 13,
            maxX: 21,
            type: "rental",
            text: "대화"
        },
        {
            minX: 73,
            maxX: 83,
            type: "enterSea",
            text: "이동"
        }
    ]
};

function showScene(sceneName) {
    closeResultScenes();

    Object.values(scenes).forEach(scene => {
        scene.classList.remove("active");
    });

    scenes[sceneName].classList.add("active");
    currentScene = sceneName;

    closeInventory();
    closeDialogue();

    if (sceneName === "dock") {
        currentPlayer = dockPlayer;
        resetPlayer("dock");
        mobileControls.classList.add("show");
    }

    else if (sceneName === "beach") {
        currentPlayer = beachPlayer;
        resetPlayer("beach");
        mobileControls.classList.add("show");
    }

    else {
        currentPlayer = null;
        mobileControls.classList.remove("show");
    }

    updateInteraction();
}

function resetPlayer(mapName) {
    const setting = mapSettings[mapName];

    playerX = setting.startX;

    currentPlayer.style.left = playerX + "%";
    currentPlayer.style.top = setting.top + "%";
    currentPlayer.style.transform = "scaleX(1)";

    updatePlayerSprite();
}

function updatePlayerSprite() {
    const imagePath = isLifeJacketEquipped
        ? PLAYER_VEST_IMAGE
        : PLAYER_NORMAL_IMAGE;

    dockPlayer.style.backgroundImage = `url("${imagePath}")`;
    beachPlayer.style.backgroundImage = `url("${imagePath}")`;
}

function movePlayer() {
    if (currentPlayer && !dialogueOpen) {
        const setting = mapSettings[currentScene];

        if (movingLeft) {
            playerX -= moveSpeed;
            currentPlayer.style.transform = "scaleX(-1)";
        }

        if (movingRight) {
            playerX += moveSpeed;
            currentPlayer.style.transform = "scaleX(1)";
        }

        if (playerX < setting.minX) {
            playerX = setting.minX;
        }

        if (playerX > setting.maxX) {
            playerX = setting.maxX;
        }

        currentPlayer.style.left = playerX + "%";

        updateInteraction();
    }

    requestAnimationFrame(movePlayer);
}

function updateInteraction() {
    currentInteraction = null;

    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");

    if (
        currentScene !== "dock" &&
        currentScene !== "beach"
    ) {
        return;
    }

    const zones = interactionZones[currentScene];

    zones.forEach(zone => {
        if (
            playerX >= zone.minX &&
            playerX <= zone.maxX
        ) {
            currentInteraction = zone;

            interactionText.textContent = zone.text;
            mobileInteractionBtn.textContent = zone.text;

            interactionGuide.classList.add("show");
            mobileInteractionBtn.classList.add("show");
        }
    });
}

function interact() {
    if (
        !currentInteraction ||
        dialogueOpen
    ) {
        return;
    }

    if (
        currentInteraction.type === "warehouse"
    ) {
        if (hasLifeJacket) {
            openDialogue(
                "창고",
                "이미 구명조끼를 챙겼다. 이제 장비에서 구명조끼를 착용해보자."
            );
        }

        else {
            hasLifeJacket = true;

            addItemToInventory(
                "🦺",
                "구명조끼"
            );

            openDialogue(
                "창고",
                "창고 안 선반을 살펴보니 구명조끼를 발견했다! 구명조끼가 장비에 추가되었다."
            );
        }
    }

    if (
        currentInteraction.type === "rental"
    ) {
        openRentalDialogue();
    }

    if (
        currentInteraction.type === "enterSea"
    ) {
        openEnterSeaDialogue();
    }
}

function openDialogue(name, text) {
    dialogueOpen = true;

    movingLeft = false;
    movingRight = false;

    dialogueName.textContent = name;
    dialogueText.innerHTML = text;

    dialogueBox.classList.add("open");

    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");
}

function closeDialogue() {
    dialogueOpen = false;

    dialogueBox.classList.remove("open");

    updateInteraction();
}

function openRentalDialogue() {
    dialogueOpen = true;

    movingLeft = false;
    movingRight = false;

    dialogueName.textContent = "대여소 직원";

    dialogueText.innerHTML = `
        필요한 장비를 골라주세요.

        <br><br>

        <button
            class="choice-button"
            onclick="selectRentalItem('tube')"
        >
            튜브
        </button>

        <button
            class="choice-button"
            onclick="selectRentalItem('parasol')"
        >
            파라솔
        </button>

        <button
            class="choice-button"
            onclick="selectRentalItem('lifejacket')"
        >
            구명조끼
        </button>
    `;

    dialogueBox.classList.add("open");

    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");
}

function selectRentalItem(item) {
    if (item === "tube") {
        addItemToInventory(
            "🛟",
            "튜브"
        );

        openDialogue(
            "대여소 직원",
            "튜브를 대여했다. 하지만 튜브는 구명조끼를 대신할 수 없다."
        );
    }

    if (item === "parasol") {
        addItemToInventory(
            "⛱️",
            "파라솔"
        );

        openDialogue(
            "대여소 직원",
            "파라솔을 대여했다. 햇빛을 피하는 데 좋지만 물놀이 안전장비는 아니다."
        );
    }

    if (item === "lifejacket") {
        if (!hasLifeJacket) {
            hasLifeJacket = true;

            addItemToInventory(
                "🦺",
                "구명조끼"
            );
        }

        openDialogue(
            "대여소 직원",
            "구명조끼를 대여했다! 이제 장비에서 구명조끼를 착용해보자."
        );
    }
}

function openEnterSeaDialogue() {
    let placeText = "";

    if (
        currentScene === "dock"
    ) {
        placeText =
            "배를 타고 낚시를 하러 나가겠습니까?";
    }

    if (
        currentScene === "beach"
    ) {
        placeText =
            "제트스키를 타고 수상 레저를 시작하겠습니까?";
    }

    openDialogue(
        "안내",
        `
        ${placeText}

        <br><br>

        <button
            class="choice-button"
            onclick="startSeaActivity()"
        >
            시작하기
        </button>

        <button
            class="choice-button"
            onclick="closeDialogue()"
        >
            취소
        </button>
        `
    );
}

function startSeaActivity() {
    lastMapBeforeAccident = currentScene;

    closeDialogue();
    closeInventory();

    showAccidentScene();
}

function showAccidentScene() {
    closeResultScenes();

    movingLeft = false;
    movingRight = false;

    mobileControls.classList.remove("show");
    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");

    if (
        lastMapBeforeAccident === "dock"
    ) {
        accidentTitle.textContent =
            "갑작스러운 기상 악화!";

        accidentText.innerHTML =
            "낚시를 하던 중 강한 바람과 파도가 몰아쳤습니다." +
            "<br>" +
            "배가 크게 흔들리기 시작합니다.";
    }

    if (
        lastMapBeforeAccident === "beach"
    ) {
        accidentTitle.textContent =
            "높은 파도 발생!";

        accidentText.innerHTML =
            "수상 레저를 즐기던 중 갑자기 높은 파도가 밀려왔습니다." +
            "<br>" +
            "몸이 바다 쪽으로 휩쓸립니다.";
    }

    accidentScene.classList.add("open");

    setTimeout(function () {
        accidentScene.classList.remove("open");

        if (
            isLifeJacketEquipped
        ) {
            clearScene.classList.add("open");
        }

        else {
            failScene.classList.add("open");
        }

    }, 3000);
}

function closeResultScenes() {
    accidentScene.classList.remove("open");
    failScene.classList.remove("open");
    clearScene.classList.remove("open");
}

function returnToMap() {
    closeResultScenes();

    showScene(
        lastMapBeforeAccident
    );
}

function addItemToInventory(icon, name) {
    for (
        let i = 0;
        i < inventorySlots.length;
        i++
    ) {
        if (
            inventorySlots[i]
                .innerHTML
                .trim() === ""
        ) {
            inventorySlots[i].innerHTML = `
                <div class="item-icon">
                    ${icon}
                </div>

                <div class="item-name">
                    ${name}
                </div>
            `;

            inventorySlots[i].dataset.item = name;

            inventorySlots[i].addEventListener(
                "click",
                function () {
                    handleInventoryItemClick(
                        name
                    );
                }
            );

            return;
        }
    }

    openDialogue(
        "장비",
        "장비 칸이 가득 찼다."
    );
}

function handleInventoryItemClick(name) {
    if (
        name === "구명조끼"
    ) {
        if (
            isLifeJacketEquipped
        ) {
            openDialogue(
                "장비",
                "구명조끼를 이미 착용하고 있다."
            );
        }

        else {
            openDialogue(
                "장비",
                `
                구명조끼를 착용하시겠습니까?

                <br><br>

                <button
                    class="choice-button"
                    onclick="equipLifeJacket()"
                >
                    착용하기
                </button>
                `
            );
        }
    }

    else {
        openDialogue(
            "장비",
            `${name}을(를) 확인했다.`
        );
    }
}

function equipLifeJacket() {
    isLifeJacketEquipped = true;

    updatePlayerSprite();

    inventorySlots.forEach(slot => {
        if (
            slot.dataset.item === "구명조끼"
        ) {
            slot.innerHTML = `
                <div class="item-icon">
                    🦺
                </div>

                <div class="item-name">
                    구명조끼
                </div>

                <div class="equipped-label">
                    착용 중
                </div>
            `;
        }
    });

    openDialogue(
        "장비",
        "구명조끼를 착용했다! 이제 예상치 못한 사고에도 더 안전하게 대처할 수 있다."
    );
}

function closeInventory() {
    inventoryPanel.classList.remove("open");
}

function toggleInventory() {
    inventoryPanel.classList.toggle("open");
}

startBtn.addEventListener(
    "click",
    function () {
        showScene(
            "mapSelect"
        );
    }
);

dockBtn.addEventListener(
    "click",
    function () {
        showScene(
            "dock"
        );
    }
);

beachBtn.addEventListener(
    "click",
    function () {
        showScene(
            "beach"
        );
    }
);

backToMain.addEventListener(
    "click",
    function () {
        showScene(
            "main"
        );
    }
);

equipmentButtons.forEach(
    button => {
        button.addEventListener(
            "click",
            function () {
                toggleInventory();
            }
        );
    }
);

inventoryCloseBtn.addEventListener(
    "click",
    function () {
        closeInventory();
    }
);

dialogueCloseBtn.addEventListener(
    "click",
    function () {
        closeDialogue();
    }
);

document.addEventListener(
    "keydown",
    function (event) {
        if (
            event.key === "ArrowLeft"
        ) {
            movingLeft = true;
        }

        if (
            event.key === "ArrowRight"
        ) {
            movingRight = true;
        }

        if (
            event.key === "e" ||
            event.key === "E"
        ) {
            interact();
        }

        if (
            event.key === "Escape"
        ) {
            closeInventory();
            closeDialogue();
        }
    }
);

document.addEventListener(
    "keyup",
    function (event) {
        if (
            event.key === "ArrowLeft"
        ) {
            movingLeft = false;
        }

        if (
            event.key === "ArrowRight"
        ) {
            movingRight = false;
        }
    }
);

leftBtn.addEventListener(
    "mousedown",
    function () {
        movingLeft = true;
    }
);

leftBtn.addEventListener(
    "mouseup",
    function () {
        movingLeft = false;
    }
);

leftBtn.addEventListener(
    "touchstart",
    function () {
        movingLeft = true;
    }
);

leftBtn.addEventListener(
    "touchend",
    function () {
        movingLeft = false;
    }
);

rightBtn.addEventListener(
    "mousedown",
    function () {
        movingRight = true;
    }
);

rightBtn.addEventListener(
    "mouseup",
    function () {
        movingRight = false;
    }
);

rightBtn.addEventListener(
    "touchstart",
    function () {
        movingRight = true;
    }
);

rightBtn.addEventListener(
    "touchend",
    function () {
        movingRight = false;
    }
);

mobileInteractionBtn.addEventListener(
    "click",
    function () {
        interact();
    }
);

showScene("main");

updatePlayerSprite();

movePlayer();