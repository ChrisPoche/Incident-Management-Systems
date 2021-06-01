let store = {
    page: 'template'
}

const loadPage = (page) => {
    if (page === 'template') {
        addTemplateToDOM();
        createDragAndDropArea();
        createFormInput();
    }
    console.log("We're on page:", page);
}

window.addEventListener('load', () => {
    let intro = sessionStorage.getItem('intro');
    if (intro === null) {
        createIntro();
        sessionStorage.setItem('intro', store.page);
        let introAnimation = document.getElementsByClassName('animate-intro')[0];
        introAnimation.addEventListener('animationend', () => {
            introAnimation.remove();
        })
    }
    else if (intro !== null) {
        document.getElementById('main-process').classList.remove('animate-main');
    }
    loadPage(store.page);
})

const createIntro = () => {
    let wrapper = document.createElement('div');
    wrapper.classList.add('animate-intro');
    wrapper.id = 'centered';
    let text = document.createElement('h1');
    text.id = 'intro';
    text.innerHTML = 'Welcome to <span class="relone">Day-to-Day</span><br><span class="intro-sub-header">RelativityOne Incident Management Systems</span>'
    wrapper.appendChild(text);
    document.body.insertBefore(wrapper, document.getElementById('main-process'));
}