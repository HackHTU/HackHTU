var popupContainer = document.getElementById('popup-container');
var overlay = document.getElementById('overlay');

// 监听点击事件
overlay.addEventListener('click', closePopup);

function closePopup() {
  popupContainer.style.display = 'none';
  overlay.style.display = 'none';
}