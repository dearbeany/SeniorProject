/*!
* Start Bootstrap - New Age v6.0.4 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

// copy-call 의 값 복사 기능 구현 
document.getElementById("btn-copy-call").onclick = function(){ 
    // div 내부 텍스트 취득 
    const valOfDIV = document.getElementById("copy-call").innerText; 
  
    // textarea 생성 
    const textArea = document.createElement('textarea'); 
  
    // textarea 추가 
    document.body.appendChild(textArea); 
  
    // textara의 value값으로 div내부 텍스트값 설정 
    textArea.value = valOfDIV; 
  
    // textarea 선택 및 복사 
    textArea.select(); 
    document.execCommand('copy'); 
  
    // textarea 제거 
    document.body.removeChild(textArea); 
  
    alert("전화번호가 클립보드에 복사되었습니다.");
}

  
// copy-git 의 값 복사 기능 구현 
document.getElementById("btn-copy-git").onclick = function(){ 
    // div 내부 텍스트 취득 
    const valOfDIV = document.getElementById("copy-git").innerText; 
  
    // textarea 생성 
    const textArea = document.createElement('textarea'); 
  
    // textarea 추가 
    document.body.appendChild(textArea); 
  
    // textara의 value값으로 div내부 텍스트값 설정 
    textArea.value = valOfDIV; 
  
    // textarea 선택 및 복사 
    textArea.select(); 
    document.execCommand('copy'); 
  
    // textarea 제거 
    document.body.removeChild(textArea); 
  
    alert("Git 주소가 클립보드에 복사되었습니다.");
}
  
  
// copy-mail 의 값 복사 기능 구현 
document.getElementById("btn-copy-mail").onclick = function(){ 
    // div 내부 텍스트 취득 
    const valOfDIV = document.getElementById("copy-mail").innerText; 
  
    // textarea 생성 
    const textArea = document.createElement('textarea'); 
  
    // textarea 추가 
    document.body.appendChild(textArea); 
  
    // textara의 value값으로 div내부 텍스트값 설정 
    textArea.value = valOfDIV; 
  
    // textarea 선택 및 복사 
    textArea.select(); 
    document.execCommand('copy'); 
  
    // textarea 제거 
    document.body.removeChild(textArea); 
  
    alert("이메일주소가 클립보드에 복사되었습니다.");
}