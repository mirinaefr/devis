let currentStep = 0;
let choices = {};
const steps = [
    {
        title: "본인의 불어 실력을 선택하세요",
        options: ["A1", "A2", "B1", "B2", "C1", "C2"],
        key: "level"
    },
    {
        title: "수업 과정을 선택하세요",
        options: ["일반 회화", "시사 뉴스"],
        key: "courseType"
    },
    {
        title: "수업 시간을 선택하세요",
        options: ["15분", "30분"],
        key: "duration"
    },
    {
        title: "주당 수업 횟수를 선택하세요",
        options: ["1회", "2회", "3회"],
        key: "sessionsPerWeek"
    },
    {
        title: "첫 등록이신가요?",
        options: ["예", "아니오"],
        key: "firstTime"
    }
];

function setup() {
    noCanvas();
    let app = createDiv();
    app.id('app');
    
    
    let stepContainer = createDiv();
    stepContainer.id('step-container');
    app.child(stepContainer);
    
    let navigation = createDiv();
    navigation.id('navigation');
    let backBtn = createButton('뒤로');
    backBtn.id('back-btn');
    backBtn.style('display', 'none');
    backBtn.mousePressed(goBack);
    navigation.child(backBtn);
    app.child(navigation);
    
    displayStep();
}

function displayStep() {
    let stepContainer = select('#step-container');
    stepContainer.class('fade-out');
    
    setTimeout(() => {
        stepContainer.html('');
        stepContainer.removeClass('fade-out');
        
        if (currentStep < steps.length) {
            let step = steps[currentStep];
            stepContainer.child(createElement('h2', step.title).class('centered-text'));
            
            if (currentStep === 1) {
                if (choices.level === "A1" || choices.level === "A2") {
                    let infoMessage = createDiv('A1 및 A2 레벨에서는 일반 회화 과정만 이용 가능합니다');
                    infoMessage.class('info-message centered-text');
                    stepContainer.child(infoMessage);
                    selectOption("주제별 대화 수업");
                    let backBtn = select('#back-btn');
                    backBtn.style('display', 'inline-block');
                    return;
                } else if (["B1", "B2", "C1", "C2"].includes(choices.level)) {
                    let infoMessage = createDiv('주제별 대화 수업과 시사 대화 수업 중 선택하실 수 있습니다');
                    infoMessage.class('info-message centered-text');
                    stepContainer.child(infoMessage);
                }
            } else if (currentStep === 2 && (choices.level === "A1" || choices.level === "A2")) {
                let infoMessage = createDiv('이 수준에서는 15분 세션만 가능합니다');
                infoMessage.class('info-message centered-text');
                stepContainer.child(infoMessage);
                let card = createDiv('15분');
                card.class('card centered-card');
                card.mousePressed(() => selectOption('15분'));
                stepContainer.child(card);
                return;
            }
            
            let cardContainer = createDiv();
            cardContainer.class('card-container');
            step.options.forEach(option => {
                let card = createDiv(option);
                card.class('card');
                card.mousePressed(() => selectOption(option));
                cardContainer.child(card);
            });
            stepContainer.child(cardContainer);
        } else {
            displaySummary();
        }
        
        let backBtn = select('#back-btn');
        backBtn.style('display', currentStep > 0 ? 'inline-block' : 'none');
        
        stepContainer.class('fade-in');
    }, 300);
}
function selectOption(option) {
    choices[steps[currentStep].key] = option;
    currentStep++;
    
    if (currentStep < steps.length) {
        displayStep();
    } else {
        displaySummary();
    }
}

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        displayStep();
    }
}

function displaySummary() {
    let stepContainer = select('#step-container');
    stepContainer.html('');
    
    stepContainer.child(createElement('h2', '등록 원할 시 스크린샷 찍고 카카오 채널로 보내주세요!').class('centered-text'));
    
    let summary = createDiv();
    summary.id('summary');
    summary.child(createElement('p', `<strong>레벨:</strong> ${choices.level}`));
    summary.child(createElement('p', `<strong>과정:</strong> ${choices.courseType}`));
    summary.child(createElement('p', `<strong>수업 시간:</strong> ${choices.duration}`));
    summary.child(createElement('p', `<strong>주당 수업 횟수:</strong> ${choices.sessionsPerWeek}`));
    summary.child(createElement('p', `<strong>15% 할인 적용(첫 등록 혜택):</strong> ${choices.firstTime}`));
    
    stepContainer.child(summary);
    
    let price = calculatePrice();
    let priceDiv = createDiv();
    priceDiv.id('price');
    priceDiv.child(createElement('h3', `4주 총 가격(VAT포함): ${formatPrice(price)} 원`).class('centered-text'));
    stepContainer.child(priceDiv);
    
    let buttonContainer = createDiv();
    buttonContainer.class('button-container');
    
    let registerBtn = createButton('바로 등록하기');
    registerBtn.mousePressed(() => window.open('https://pf.kakao.com/_xnxdDxmT', '_blank'));
    let restartBtn = createButton('다시 시작하기');
    restartBtn.mousePressed(restart);
    
    buttonContainer.child(registerBtn);
    buttonContainer.child(restartBtn);
    stepContainer.child(buttonContainer);
 } 
function calculatePrice() {
    const basePrice = 62990;
    let price = basePrice;
    
    if (choices.duration === "30분") {
        price *= 2;
    }
    
    price *= parseInt(choices.sessionsPerWeek);
    
    if (choices.firstTime === "예") {
        price *= 0.85; // 15% 할인
    }
    
    // Arrondir le prix au millier inférieur et ajouter 990
    price = Math.floor(price / 1000) * 1000 + 990;
    
    return price;
}

function formatPrice(price) {
    return new Intl.NumberFormat('ko-KR').format(Math.round(price));
}

function restart() {
    currentStep = 0;
    choices = {};
    displayStep();
}