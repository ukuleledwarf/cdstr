document.addEventListener('click', e => {
    const sibling = e.target.closest('.section__question-sibling');
    if(sibling){
        const destElement = document.getElementById(sibling.dataset.id);
        destElement.scrollIntoView({behavior: 'smooth'});
        return;
    }
    if(e.target.matches('.section__theme-title')){
        toggleThemeContent(e.target.parentElement);
    }
    const label = e.target.closest('.section__question-option');
    if(label){
        label.classList.add('section__question-option_clicked');
        label.closest('.section__question').classList.add('section__question_revealed');
    }
    if(e.target.matches('.section__question-text, .section__question-text *')){
        const questionId = e.target.closest('.section__question').id;
        const allQuestions = theory.map(section => section.themes.map(theme => theme.questions).flat()).flat();
        const question = allQuestions.find(q => q.id === questionId);
        console.log(question);
        document.body.insertAdjacentHTML('beforeend', `<div class="solution-modal">${question.solutionHTML}</div>`);
    }
    const solutionModal = e.target.closest('.solution-modal');
    if(solutionModal){
        solutionModal.remove();
    }
});