const wheel = document.getElementById('wheel');
const songList = document.getElementById('songList');
const songItems = document.querySelectorAll('.song-item');
const highlightBar = document.querySelector('.highlight-bar');
const screenContent = document.querySelector('.screen-content');
const welcomeScreen = document.getElementById('welcomeScreen');
const ipodContainer = document.querySelector('.ipod-container');

// ระบบเสียงคลิก wheel
const clickSound = new Audio('click.mp3'); 
clickSound.volume = 0.3;

window.addEventListener('DOMContentLoaded', () => {
    // เซ็ตคลาสธีมเริ่มต้นเป็นธีมสีออริจินอล
    ipodContainer.classList.add('theme-original');
    
    setTimeout(() => {
        if (welcomeScreen) {
            welcomeScreen.classList.add('fade-out');
        }
    }, 3500); 
});

// 🌟 ฟังก์ชันการเปลี่ยนธีมสีแบบยกเซต (บอดี้ + แถบไฮไลต์ + ฟอนต์)
function changeIpodColor(colorName) {
    // ล้างคลาสธีมเก่าออกให้หมด
    ipodContainer.classList.remove('theme-original', 'theme-pink', 'theme-purple', 'theme-black');
    
    // ใส่คลาสธีมใหม่ตามปุ่มที่กดเลือก
    ipodContainer.classList.add(`theme-${colorName}`);
}

let currentActiveIndex = 0;
let isDragging = false;
let startAngle = 0;
let accumulatedAngle = 0;
const rowHeight = 36; 

function getAngle(x, y) {
    const rect = wheel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
}

function startDrag(e) {
    isDragging = true;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    startAngle = getAngle(clientX, clientY);
    accumulatedAngle = 0;
}

function doDrag(e) {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (!clientX || !clientY) return;

    const currentAngle = getAngle(clientX, clientY);
    let angleDiff = currentAngle - startAngle;

    if (angleDiff > 180) angleDiff -= 360;
    if (angleDiff < -180) angleDiff += 360;

    accumulatedAngle += angleDiff;
    
    if (accumulatedAngle >= 20) {
        changeActiveSong(1);
        accumulatedAngle = 0;
    } else if (accumulatedAngle <= -20) {
        changeActiveSong(-1);
        accumulatedAngle = 0;
    }
    startAngle = currentAngle;
}

function stopDrag() {
    isDragging = false;
}

function changeActiveSong(direction) {
    const oldIndex = currentActiveIndex;
    
    songItems[currentActiveIndex].classList.remove('active');
    currentActiveIndex += direction;
    
    if (currentActiveIndex < 0) currentActiveIndex = 0;
    if (currentActiveIndex >= songItems.length) currentActiveIndex = songItems.length - 1;

    songItems[currentActiveIndex].classList.add('active');

    if (oldIndex !== currentActiveIndex) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => console.log("Sound check"));
    }

    const screenHeight = screenContent.clientHeight;
    const highlightPosition = currentActiveIndex * rowHeight;
    
    let listOffset = highlightPosition - (screenHeight / 2) + (rowHeight / 2);
    if (listOffset < 0) listOffset = 0;

    songList.style.top = `-${listOffset}px`;
    highlightBar.style.top = `${highlightPosition - listOffset}px`;
}

wheel.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', doDrag);
window.addEventListener('mouseup', stopDrag);

wheel.addEventListener('touchstart', startDrag, { passive: false });
wheel.addEventListener('touchmove', doDrag, { passive: false });
wheel.addEventListener('touchend', stopDrag);