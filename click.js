import { renderTheme, renderQuestion, renderThemeProgress } from './render.js';

export function listenAppClicks(theory, api){
    document.addEventListener('click', e => {
        const sibling = e.target.closest('.section__question-sibling');
        if(sibling){
            const destElement = document.getElementById(sibling.dataset.id);
            destElement.scrollIntoView({behavior: 'smooth'});
            return;
        }
        if(e.target.matches('.section__question-solution')){
            const questionId = e.target.closest('.section__question').id;
            const allQuestions = theory.map(section => section.themes.map(theme => theme.questions).flat()).flat();
            const question = allQuestions.find(q => q.id === questionId);
            document.body.insertAdjacentHTML('beforeend', `<div class="solution-modal">${question.solutionHTML}</div>`);
            return;
        }
        if(e.target.matches('.section__theme-title, .section__theme-title *')){
            const themeEl = e.target.closest('.section__theme');
            const sectionEl = themeEl.closest('.section');
            const themeIndex = themeEl.dataset.themeIndex;
            const themeObj = theory[sectionEl.dataset.sectionIndex].themes[themeIndex];
            themeObj.open = !themeObj.open;
            themeEl.outerHTML = renderTheme(themeObj, themeIndex);
        }
        if(e.target.matches('.section__question-text, .section__question-text *')){
            const questionEl = e.target.closest('.section__question');
            const questionId = questionEl.id;
            const themeEl = e.target.closest('.section__theme');
            const themeIndex = themeEl.dataset.themeIndex;
            const sectionIndex = e.target.closest('.section').dataset.sectionIndex;
            const questions = theory[sectionIndex].themes[themeIndex].questions;
            const questionObj = questions.find(q => q.id === questionId);
            questionObj.learnt = !questionObj.learnt;
            questionEl.outerHTML = renderQuestion(questionObj, questions.indexOf(questionObj));
            themeEl.querySelector('.section__theme-progress').innerHTML = renderThemeProgress(questions);
            questionObj.learnt ? api.add(questionId) : api.delete(questionId);
        }
        const label = e.target.closest('.section__question-option');
        if(label){
            label.classList.add('section__question-option_clicked');
            label.closest('.section__question').classList.add('section__question_revealed');
        }
        const solutionModal = e.target.closest('.solution-modal');
        if(solutionModal){
            solutionModal.remove();
        }
    });
}