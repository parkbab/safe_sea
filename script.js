/* ========================= */
/* 장면 */
/* ========================= */

/*
 * 모바일 브라우저에서 주소창과 하단 바를 제외한
 * 실제로 보이는 화면 크기를 계산합니다.
 *
 * 일부 모바일 Chrome에서는 100vh와 100dvh가
 * 실제 표시 영역과 다르게 계산될 수 있기 때문에
 * visualViewport 값을 CSS로 전달합니다.
 */
function updateVisibleViewport() {
    const viewport = window.visualViewport;

    const width = viewport
        ? viewport.width
        : window.innerWidth;

    const height = viewport
        ? viewport.height
        : window.innerHeight;

    document.documentElement.style.setProperty(
        "--app-width",
        `${width}px`
    );

    document.documentElement.style.setProperty(
        "--app-height",
        `${height}px`
    );
}


/* 처음 페이지가 열렸을 때 화면 크기 계산 */
updateVisibleViewport();


/* 브라우저 화면 크기가 바뀌었을 때 다시 계산 */
window.addEventListener(
    "resize",
    updateVisibleViewport
);


/* 휴대폰을 가로 또는 세로로 회전했을 때 다시 계산 */
window.addEventListener(
    "orientationchange",
    updateVisibleViewport
);


/*
 * 모바일 브라우저의 주소창이 나타나거나 사라질 때
 * 실제 표시 영역의 크기를 다시 계산합니다.
 */
if (window.visualViewport) {
    window.visualViewport.addEventListener(
        "resize",
        updateVisibleViewport
    );

    window.visualViewport.addEventListener(
        "scroll",
        updateVisibleViewport
    );
}


/* ========================= */
/* 장면 */
/* ========================= */

const scenes = {
    main: document.getElementById("mainMenu"),
    controlModeSelect: document.getElementById("controlModeSelect"),
    mapSelect: document.getElementById("mapSelect"),
    dock: document.getElementById("dockScene"),
    beach: document.getElementById("beachScene"),
    fishingCutscene: document.getElementById("fishingCutsceneScene"),
    beachCutscene: document.getElementById("beachCutsceneScene")
};

/* ========================= */
/* 기본 버튼 */
/* ========================= */

const startBtn =
    document.getElementById("startBtn");

const dockBtn =
    document.getElementById("dockBtn");

const beachBtn =
    document.getElementById("beachBtn");

const backToMain =
    document.getElementById("backToMain");


/* ========================= */
/* 조작 방식 선택 */
/* ========================= */

const pcModeBtn =
    document.getElementById("pcModeBtn");

const mobileModeBtn =
    document.getElementById("mobileModeBtn");

const backToMainFromMode =
    document.getElementById("backToMainFromMode");

const rotateOverlay =
    document.getElementById("rotateOverlay");


/* ========================= */
/* 인벤토리 */
/* ========================= */

const equipmentButtons =
    document.querySelectorAll(".equipment-button");

const inventoryPanel =
    document.getElementById("inventoryPanel");

const inventoryCloseBtn =
    document.getElementById("inventoryCloseBtn");

const inventorySlots =
    document.querySelectorAll(".inventory-slot");


/* ========================= */
/* 플레이어 */
/* ========================= */

const dockPlayer =
    document.getElementById("dockPlayer");

const beachPlayer =
    document.getElementById("beachPlayer");


/* ========================= */
/* 상호작용 */
/* ========================= */

const interactionGuide =
    document.getElementById("interactionGuide");

const interactionText =
    document.getElementById("interactionText");

const mobileInteractionBtn =
    document.getElementById("mobileInteractionBtn");


/* ========================= */
/* 일반 대화창 */
/* ========================= */

const dialogueBox =
    document.getElementById("dialogueBox");

const dialogueName =
    document.getElementById("dialogueName");

const dialogueText =
    document.getElementById("dialogueText");

const dialogueCloseBtn =
    document.getElementById("dialogueCloseBtn");


/* ========================= */
/* 모바일 조작 */
/* ========================= */

const mobileControls =
    document.getElementById("mobileControls");

const leftBtn =
    document.getElementById("leftBtn");

const rightBtn =
    document.getElementById("rightBtn");


/* ========================= */
/* 사고 및 결과 화면 */
/* ========================= */

const accidentScene =
    document.getElementById("accidentScene");

const failScene =
    document.getElementById("failScene");

const clearScene =
    document.getElementById("clearScene");

const accidentTitle =
    document.getElementById("accidentTitle");

const accidentText =
    document.getElementById("accidentText");


/* ========================= */
/* 낚시 컷신 */
/* ========================= */

const fishingCutsceneScene =
    document.getElementById("fishingCutsceneScene");

const fishingSpeechBubble =
    document.getElementById("fishingSpeechBubble");

const fishingExpressionCharacter =
    document.getElementById("fishingExpressionCharacter");


/* ========================= */
/* 해수욕장 컷신 */
/* ========================= */

const beachCutsceneScene =
    document.getElementById("beachCutsceneScene");

const beachCutsceneCharacter =
    document.getElementById("beachCutsceneCharacter");

const beachExpressionCharacter =
    document.getElementById("beachExpressionCharacter");

const beachSpeechBubble =
    document.getElementById("beachSpeechBubble");


/* ========================= */
/* 게임 상태 */
/* ========================= */

let currentScene = "main";
let currentPlayer = null;
let playerX = 42;

// "pc" 또는 "mobile" - 조작 방식 선택 화면에서 결정된다.
let controlMode = "pc";

let movingLeft = false;
let movingRight = false;

let currentInteraction = null;
let dialogueOpen = false;

let hasLifeJacket = false;
let isLifeJacketEquipped = false;

let lastMapBeforeAccident = "beach";

let fishingCutsceneTimer = null;
let typingTimer = null;

let fishingLineIndex = 0;
let isTyping = false;
let cutscenePlaying = false;

let activeCutscene = null;

const moveSpeed = 0.35;


/* ========================= */
/* 이미지 경로 */
/* ========================= */

const PLAYER_NORMAL_IMAGE =
    "images/player.png";

const PLAYER_VEST_IMAGE =
    "images/player_vest.png";

const FISHING_CURIOUS_IMAGE =
    "images/player_curious.png";

const FISHING_SURPRISED_IMAGE =
    "images/player_surprised.png";


/* ========================= */
/* 맵 설정 */
/* ========================= */

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


/* ========================= */
/* 상호작용 구역 */
/* ========================= */

const interactionZones = {
    dock: [
        {
            minX: 24,
            maxX: 30,
            type: "warehouse",
            text: "조사"
        },
        {
            minX: 45,
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


/* ========================= */
/* 낚시 컷신 대사 */
/* ========================= */

const fishingCutsceneLines = [
    {
        text: "오늘은 날이 그럭저럭이네...",
        duration: 1700,
        alert: false,
        expression: "normal"
    },
    {
        text: "고기가 잘 잡히려나??",
        duration: 1700,
        alert: false,
        expression: "normal"
    },
    {
        text: "응? 저건 뭐지?",
        duration: 1500,
        alert: false,
        expression: "curious"
    },
    {
        text: "헉!! 파도잖아?!!",
        duration: 1800,
        alert: true,
        expression: "surprised"
    }
];


const beachLines = [
    {
        text: "모래성이 제법 잘 만들어졌는데?",
        duration: 1700,
        expression: "normal"
    },
    {
        text: "오늘 바다는 정말 잔잔하네.",
        duration: 1700,
        expression: "normal"
    },
    {
        text: "응? 파도 소리가 점점 커지는데?",
        duration: 1500,
        expression: "curious"
    },
    {
        text: "헉!! 큰 파도가 온다!!",
        duration: 1800,
        expression: "surprised",
        alert: true
    }
];

/* ========================= */
/* 장면 표시 */
/* ========================= */

function showScene(sceneName) {
    stopFishingCutsceneTimers();
    hideFishingExpression();
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

        if (controlMode === "mobile") {
            mobileControls.classList.add("show");
        } else {
            mobileControls.classList.remove("show");
        }
    }

    else if (sceneName === "beach") {
        currentPlayer = beachPlayer;

        resetPlayer("beach");

        if (controlMode === "mobile") {
            mobileControls.classList.add("show");
        } else {
            mobileControls.classList.remove("show");
        }
    }

    else {
        currentPlayer = null;

        mobileControls.classList.remove("show");
        interactionGuide.classList.remove("show");
        mobileInteractionBtn.classList.remove("show");
    }

    updateInteraction();
}


/* ========================= */
/* 플레이어 초기화 */
/* ========================= */

function resetPlayer(mapName) {
    const setting =
        mapSettings[mapName];

    playerX =
        setting.startX;

    currentPlayer.style.left =
        playerX + "%";

    currentPlayer.style.top =
        setting.top + "%";

    currentPlayer.style.transform =
        "scaleX(1)";

    updatePlayerSprite();
}


/* ========================= */
/* 플레이어 이미지 변경 */
/* ========================= */

function updatePlayerSprite() {
    const imagePath =
        isLifeJacketEquipped
            ? PLAYER_VEST_IMAGE
            : PLAYER_NORMAL_IMAGE;

    dockPlayer.style.backgroundImage =
        `url("${imagePath}")`;

    beachPlayer.style.backgroundImage =
        `url("${imagePath}")`;

    if (beachCutsceneCharacter) {
        beachCutsceneCharacter.src = imagePath;
    }
}

/* ========================= */
/* 플레이어 이동 */
/* ========================= */

function movePlayer() {
    if (
        currentPlayer &&
        !dialogueOpen &&
        !cutscenePlaying
    ) {
        const setting =
            mapSettings[currentScene];

        if (movingLeft) {
            playerX -= moveSpeed;

            currentPlayer.style.transform =
                "scaleX(-1)";
        }

        if (movingRight) {
            playerX += moveSpeed;

            currentPlayer.style.transform =
                "scaleX(1)";
        }

        if (playerX < setting.minX) {
            playerX = setting.minX;
        }

        if (playerX > setting.maxX) {
            playerX = setting.maxX;
        }

        currentPlayer.style.left =
            playerX + "%";

        updateInteraction();
    }

    requestAnimationFrame(movePlayer);
}


/* ========================= */
/* 상호작용 확인 */
/* ========================= */

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

    const zones =
        interactionZones[currentScene];

    zones.forEach(zone => {
        if (
            playerX >= zone.minX &&
            playerX <= zone.maxX
        ) {
            currentInteraction = zone;

            interactionText.textContent =
                zone.text;

            mobileInteractionBtn.textContent =
                zone.text;

            if (controlMode === "mobile") {
                mobileInteractionBtn.classList.add("show");
            } else {
                interactionGuide.classList.add("show");
            }
        }
    });
}


/* ========================= */
/* 상호작용 실행 */
/* ========================= */

function interact() {
    if (
        !currentInteraction ||
        dialogueOpen ||
        cutscenePlaying
    ) {
        return;
    }

    if (
        currentInteraction.type ===
        "warehouse"
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
        currentInteraction.type ===
        "rental"
    ) {
        openRentalDialogue();
    }

    if (
        currentInteraction.type ===
        "enterSea"
    ) {
        openEnterSeaDialogue();
    }
}


/* ========================= */
/* 일반 대화창 */
/* ========================= */

function openDialogue(name, text) {
    dialogueOpen = true;

    movingLeft = false;
    movingRight = false;

    dialogueName.textContent =
        name;

    dialogueText.innerHTML =
        text;

    dialogueBox.classList.add("open");

    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");
}

function closeDialogue() {
    dialogueOpen = false;

    dialogueBox.classList.remove("open");

    updateInteraction();
}


/* ========================= */
/* 대여소 */
/* ========================= */

function openRentalDialogue() {
    dialogueOpen = true;

    movingLeft = false;
    movingRight = false;

    dialogueName.textContent =
        "대여소 직원";

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


/* ========================= */
/* 활동 시작 확인 */
/* ========================= */

function openEnterSeaDialogue() {
    let placeText = "";

    if (currentScene === "dock") {
        placeText =
            "배를 타고 낚시를 하러 나가겠습니까?";
    }

    if (currentScene === "beach") {
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


/* ========================= */
/* 활동 시작 */
/* ========================= */

function startSeaActivity() {
    lastMapBeforeAccident = currentScene;

    closeDialogue();
    closeInventory();

    if (currentScene === "dock") {
        playFishingCutscene();
        return;
    }

    if (currentScene === "beach") {
        playBeachCutscene();
        return;
    }
}

/* ========================= */
/* 낚시 컷신 시작 */
/* ========================= */

function playFishingCutscene() {
    stopFishingCutsceneTimers();
    hideFishingExpression();

    cutscenePlaying = true;
    activeCutscene = "fishing";
    fishingLineIndex = 0;

    movingLeft = false;
    movingRight = false;

    Object.values(scenes).forEach(scene => {
        scene.classList.remove("active");
    });

    scenes.fishingCutscene.classList.add("active");

    currentScene = "fishingCutscene";
    currentPlayer = null;

    mobileControls.classList.remove("show");
    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");

    showFishingLine();
}

/* ========================= */
/* 해수욕장 컷신 시작 */
/* ========================= */

function playBeachCutscene() {
    stopFishingCutsceneTimers();
    hideFishingExpression();
    hideBeachExpression();

    cutscenePlaying = true;
    activeCutscene = "beach";
    fishingLineIndex = 0;

    movingLeft = false;
    movingRight = false;

    Object.values(scenes).forEach(scene => {
        scene.classList.remove("active");
    });

    scenes.beachCutscene.classList.add("active");

    currentScene = "beachCutscene";
    currentPlayer = null;

    updatePlayerSprite();

    mobileControls.classList.remove("show");
    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");

    showBeachLine();
}


/* ========================= */
/* 해수욕장 표정 변경 */
/* ========================= */

function updateBeachExpression(expression) {
    if (
        !beachExpressionCharacter ||
        !beachCutsceneCharacter
    ) {
        return;
    }

    beachExpressionCharacter.classList.remove(
        "show",
        "shocked"
    );

    beachExpressionCharacter.removeAttribute("src");

    if (expression === "normal") {
        beachCutsceneCharacter.style.visibility =
            "visible";

        return;
    }

    beachCutsceneCharacter.style.visibility =
        "hidden";

    if (expression === "curious") {
        beachExpressionCharacter.src =
            FISHING_CURIOUS_IMAGE;

        beachExpressionCharacter.classList.add(
            "show"
        );

        return;
    }

    if (expression === "surprised") {
        beachExpressionCharacter.src =
            FISHING_SURPRISED_IMAGE;

        beachExpressionCharacter.classList.add(
            "show",
            "shocked"
        );
    }
}


/* ========================= */
/* 해수욕장 표정 숨기기 */
/* ========================= */

function hideBeachExpression() {
    if (beachExpressionCharacter) {
        beachExpressionCharacter.classList.remove(
            "show",
            "shocked"
        );

        beachExpressionCharacter.removeAttribute("src");
    }

    if (beachCutsceneCharacter) {
        beachCutsceneCharacter.style.visibility =
            "visible";
    }
}


/* ========================= */
/* 해수욕장 대사 표시 */
/* ========================= */

function showBeachLine() {
    if (
        fishingLineIndex >=
        beachLines.length
    ) {
        finishBeachCutscene();
        return;
    }

    const line =
        beachLines[fishingLineIndex];

    beachSpeechBubble.classList.toggle(
        "alert",
        Boolean(line.alert)
    );

    updateBeachExpression(
        line.expression
    );

    typeText(
        beachSpeechBubble,
        line.text,
        function () {
            fishingCutsceneTimer =
                setTimeout(function () {
                    fishingLineIndex++;

                    showBeachLine();
                }, line.duration);
        }
    );
}


/* ========================= */
/* 해수욕장 대사 수동 넘기기 */
/* ========================= */

function advanceBeachCutscene() {
    if (
        !cutscenePlaying ||
        activeCutscene !== "beach"
    ) {
        return;
    }

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    if (fishingCutsceneTimer) {
        clearTimeout(fishingCutsceneTimer);
        fishingCutsceneTimer = null;
    }

    const line =
        beachLines[fishingLineIndex];

    if (!line) {
        finishBeachCutscene();
        return;
    }

    if (isTyping) {
        beachSpeechBubble.textContent =
            line.text;

        isTyping = false;

        fishingCutsceneTimer =
            setTimeout(function () {
                fishingLineIndex++;

                showBeachLine();
            }, 600);

        return;
    }

    fishingLineIndex++;

    showBeachLine();
}


/* ========================= */
/* 해수욕장 컷신 종료 */
/* ========================= */

function finishBeachCutscene() {
    stopFishingCutsceneTimers();
    hideBeachExpression();

    cutscenePlaying = false;
    activeCutscene = null;

    scenes.beachCutscene.classList.remove(
        "active"
    );

    if (isLifeJacketEquipped) {
        clearScene.classList.add("open");
    }

    else {
        failScene.classList.add("open");
    }
}

/* ========================= */
/* 낚시 컷신 표정 변경 */
/* ========================= */

function updateFishingExpression(expression) {
    if (!fishingExpressionCharacter) {
        return;
    }

    fishingExpressionCharacter.classList.remove(
        "show",
        "shocked"
    );

    if (expression === "normal") {
        fishingExpressionCharacter.removeAttribute("src");
        return;
    }

    if (expression === "curious") {
        fishingExpressionCharacter.src =
            FISHING_CURIOUS_IMAGE;

        fishingExpressionCharacter.classList.add(
            "show"
        );

        return;
    }

    if (expression === "surprised") {
        fishingExpressionCharacter.src =
            FISHING_SURPRISED_IMAGE;

        fishingExpressionCharacter.classList.add(
            "show",
            "shocked"
        );
    }
}


/* ========================= */
/* 낚시 컷신 표정 숨기기 */
/* ========================= */

function hideFishingExpression() {
    if (!fishingExpressionCharacter) {
        return;
    }

    fishingExpressionCharacter.classList.remove(
        "show",
        "shocked"
    );

    fishingExpressionCharacter.removeAttribute("src");
}


/* ========================= */
/* 낚시 컷신 대사 표시 */
/* ========================= */

function showFishingLine() {
    if (
        fishingLineIndex >=
        fishingCutsceneLines.length
    ) {
        finishFishingCutscene();
        return;
    }

    const line =
        fishingCutsceneLines[fishingLineIndex];

    fishingSpeechBubble.classList.toggle(
        "alert",
        line.alert
    );

    updateFishingExpression(
        line.expression
    );

    typeText(
        fishingSpeechBubble,
        line.text,
        function () {
            fishingCutsceneTimer =
                setTimeout(function () {
                    fishingLineIndex++;

                    showFishingLine();
                }, line.duration);
        }
    );
}


/* ========================= */
/* 한 글자씩 출력 */
/* ========================= */

function typeText(
    element,
    text,
    onComplete
) {
    if (typingTimer) {
        clearInterval(typingTimer);
    }

    element.textContent = "";

    let characterIndex = 0;

    isTyping = true;

    typingTimer =
        setInterval(function () {
            element.textContent +=
                text.charAt(characterIndex);

            characterIndex++;

            if (
                characterIndex >=
                text.length
            ) {
                clearInterval(typingTimer);

                typingTimer = null;
                isTyping = false;

                if (onComplete) {
                    onComplete();
                }
            }
        }, 65);
}


/* ========================= */
/* 컷신 대사 수동 넘기기 */
/* ========================= */

function advanceFishingCutscene() {
    if (!cutscenePlaying) {
        return;
    }

    if (typingTimer) {
        clearInterval(typingTimer);
        typingTimer = null;
    }

    if (fishingCutsceneTimer) {
        clearTimeout(fishingCutsceneTimer);
        fishingCutsceneTimer = null;
    }

    const line =
        fishingCutsceneLines[fishingLineIndex];

    if (!line) {
        finishFishingCutscene();
        return;
    }

    if (isTyping) {
        fishingSpeechBubble.textContent =
            line.text;

        isTyping = false;

        fishingCutsceneTimer =
            setTimeout(function () {
                fishingLineIndex++;

                showFishingLine();
            }, 600);

        return;
    }

    fishingLineIndex++;

    showFishingLine();
}


/* ========================= */
/* 컷신 종료 */
/* ========================= */

function finishFishingCutscene() {
    stopFishingCutsceneTimers();
    hideFishingExpression();

    cutscenePlaying = false;
    activeCutscene = null;

    scenes.fishingCutscene.classList.remove(
        "active"
    );

    if (isLifeJacketEquipped) {
        clearScene.classList.add("open");
    }

    else {
        failScene.classList.add("open");
    }
}


/* ========================= */
/* 컷신 타이머 정리 */
/* ========================= */

function stopFishingCutsceneTimers() {
    if (typingTimer) {
        clearInterval(typingTimer);

        typingTimer = null;
    }

    if (fishingCutsceneTimer) {
        clearTimeout(fishingCutsceneTimer);

        fishingCutsceneTimer = null;
    }

    isTyping = false;
}


/* ========================= */
/* 해수욕장 사고 이벤트 */
/* ========================= */

function showAccidentScene() {
    closeResultScenes();

    movingLeft = false;
    movingRight = false;

    mobileControls.classList.remove("show");
    interactionGuide.classList.remove("show");
    mobileInteractionBtn.classList.remove("show");

    if (
        lastMapBeforeAccident === "beach"
    ) {
        accidentTitle.textContent =
            "높은 파도 발생!";

        accidentText.innerHTML =
            "즐겁게 활동하던 중 갑자기 높은 파도가 밀려왔습니다." +
            "<br>" +
            "몸이 바다 쪽으로 휩쓸립니다.";
    }

    else {
        accidentTitle.textContent =
            "갑작스러운 사고 발생!";

        accidentText.innerHTML =
            "예상하지 못한 위험이 발생했습니다.";
    }

    accidentScene.classList.add("open");

    setTimeout(function () {
        accidentScene.classList.remove("open");

        if (isLifeJacketEquipped) {
            clearScene.classList.add("open");
        }

        else {
            failScene.classList.add("open");
        }
    }, 3000);
}


/* ========================= */
/* 결과 화면 닫기 */
/* ========================= */

function closeResultScenes() {
    accidentScene.classList.remove("open");
    failScene.classList.remove("open");
    clearScene.classList.remove("open");
}


/* ========================= */
/* 실패 후 맵 복귀 */
/* ========================= */

function returnToMap() {
    closeResultScenes();

    showScene(
        lastMapBeforeAccident
    );
}


/* ========================= */
/* 인벤토리 아이템 추가 */
/* ========================= */

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

            inventorySlots[i].dataset.item =
                name;

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


/* ========================= */
/* 인벤토리 아이템 선택 */
/* ========================= */

function handleInventoryItemClick(name) {
    if (name === "구명조끼") {
        if (isLifeJacketEquipped) {
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


/* ========================= */
/* 구명조끼 착용 */
/* ========================= */

function equipLifeJacket() {
    isLifeJacketEquipped = true;

    updatePlayerSprite();

    inventorySlots.forEach(slot => {
        if (
            slot.dataset.item ===
            "구명조끼"
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
        "구명조끼를 착용했다! 이제 예상하지 못한 사고에도 더 안전하게 대처할 수 있다."
    );
}


/* ========================= */
/* 인벤토리 열기 / 닫기 */
/* ========================= */

function closeInventory() {
    inventoryPanel.classList.remove("open");
}

function toggleInventory() {
    inventoryPanel.classList.toggle("open");
}


/* ========================= */
/* 기본 버튼 */
/* ========================= */

startBtn.addEventListener(
    "click",
    function () {
        showScene("controlModeSelect");
    }
);


/* ========================= */
/* 조작 방식 선택 버튼 */
/* ========================= */

pcModeBtn.addEventListener(
    "click",
    function () {
        controlMode = "pc";

        document.body.classList.remove("mode-mobile");
        document.body.classList.add("mode-pc");

        showScene("mapSelect");
    }
);

mobileModeBtn.addEventListener(
    "click",
    function () {
        controlMode = "mobile";

        document.body.classList.remove("mode-pc");
        document.body.classList.add("mode-mobile");

        showScene("mapSelect");
    }
);

backToMainFromMode.addEventListener(
    "click",
    function () {
        showScene("main");
    }
);


dockBtn.addEventListener(
    "click",
    function () {
        showScene("dock");
    }
);

beachBtn.addEventListener(
    "click",
    function () {
        showScene("beach");
    }
);

backToMain.addEventListener(
    "click",
    function () {
        showScene("main");
    }
);


/* ========================= */
/* 장비 버튼 */
/* ========================= */

equipmentButtons.forEach(button => {
    button.addEventListener(
        "click",
        function () {
            toggleInventory();
        }
    );
});

inventoryCloseBtn.addEventListener(
    "click",
    function () {
        closeInventory();
    }
);


/* ========================= */
/* 대화창 확인 */
/* ========================= */

dialogueCloseBtn.addEventListener(
    "click",
    function () {
        closeDialogue();
    }
);


/* ========================= */
/* 키보드 조작 */
/* ========================= */

document.addEventListener(
    "keydown",
    function (event) {
        if (
            cutscenePlaying &&
            (
                event.key === "Enter" ||
                event.key === " "
            )
        ) {
            event.preventDefault();

            if (
    cutscenePlaying &&
    (
        event.key === "Enter" ||
        event.key === " "
    )
) {
    event.preventDefault();

    if (activeCutscene === "fishing") {
        advanceFishingCutscene();
    }

    if (activeCutscene === "beach") {
        advanceBeachCutscene();
    }

    return;
}

            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();

            movingLeft = true;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();

            movingRight = true;
        }

        if (
            event.key === "e" ||
            event.key === "E"
        ) {
            interact();
        }

        if (event.key === "Escape") {
            closeInventory();
            closeDialogue();
        }
    }
);

document.addEventListener(
    "keyup",
    function (event) {
        if (event.key === "ArrowLeft") {
            movingLeft = false;
        }

        if (event.key === "ArrowRight") {
            movingRight = false;
        }
    }
);


/* ========================= */
/* 모바일 이동 */
/* ========================= */

leftBtn.addEventListener(
    "pointerdown",
    function (event) {
        event.preventDefault();

        movingLeft = true;
    }
);

leftBtn.addEventListener(
    "pointerup",
    function () {
        movingLeft = false;
    }
);

leftBtn.addEventListener(
    "pointerleave",
    function () {
        movingLeft = false;
    }
);

leftBtn.addEventListener(
    "pointercancel",
    function () {
        movingLeft = false;
    }
);

rightBtn.addEventListener(
    "pointerdown",
    function (event) {
        event.preventDefault();

        movingRight = true;
    }
);

rightBtn.addEventListener(
    "pointerup",
    function () {
        movingRight = false;
    }
);

rightBtn.addEventListener(
    "pointerleave",
    function () {
        movingRight = false;
    }
);

rightBtn.addEventListener(
    "pointercancel",
    function () {
        movingRight = false;
    }
);


/* ========================= */
/* 모바일 상호작용 */
/* ========================= */

mobileInteractionBtn.addEventListener(
    "click",
    function () {
        interact();
    }
);


/* ========================= */
/* 컷신 클릭 시 대사 넘기기 */
/* ========================= */

fishingCutsceneScene.addEventListener(
    "click",
    function () {
        advanceFishingCutscene();
    }
);

beachCutsceneScene.addEventListener(
    "click",
    function () {
        advanceBeachCutscene();
    }
);

/* ========================= */
/* 게임 시작 */
/* ========================= */

showScene("main");

updatePlayerSprite();

movePlayer();

function openCertificate() {

    window.open(
        "https://parkbab.github.io/marine-safety2/",
        "_blank"
    );

}