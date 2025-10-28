const btngame = document.querySelector('.btn-game')
    const navbar = document.querySelector('.navbar')

    btngame.addEventListener('click', () => {
        navbar.classList.toggle('active')
    });