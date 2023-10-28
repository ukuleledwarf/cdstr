import { renderTheme, renderQuestion, renderThemeProgress, renderThemeBulkConfirmationButton, renderThemeConfirmationStatus } from './render.js';

export function listenAppClicks(theory, api){
    document.addEventListener('click', e => {
        const sibling = e.target.closest('.section__question-sibling');
        if(sibling){
            const destElement = document.getElementById(sibling.dataset.id);
            destElement.scrollIntoView({behavior: 'smooth'});
            return;
        }
        if(e.target.matches('.section__theme-bulk-confirmation')){
            const themeEl = e.target.closest('.section__theme');
            const themeIndex = themeEl.dataset.themeIndex;
            const sectionIndex = e.target.closest('.section').dataset.sectionIndex;
            const themeObj = theory[sectionIndex].themes[themeIndex];
            const questions = themeObj.questions;
            const hasUnconfirmed = questions.some(q => !q.confirmed);
            const confirmText = hasUnconfirmed ? 
                'Вы уверены что хотите пометить все вопросы этой темы как проверенные?' :
                'Вы уверены что хотите отменить верификацию всех вопросов в этой теме?';
            if(!confirm(confirmText)){
                return;
            }
            const ids = questions.map(q => q.id);
            if(hasUnconfirmed){
                api.confirmAll(ids);
                const now = Date.now();
                questions.forEach(q => q.confirmed = +(new Date(now)));
            } else {
                api.unconfirmAll(ids);
                questions.forEach(q => q.confirmed = undefined);
            }
            themeEl.outerHTML = renderTheme(themeObj, themeIndex);
            return;
        }
        if(e.target.matches('.section__question-solution')){
            const questionId = e.target.closest('.section__question').id;
            const allQuestions = theory.map(section => section.themes.map(theme => theme.questions).flat()).flat();
            const question = allQuestions.find(q => q.id === questionId);
            document.body.insertAdjacentHTML('beforeend', `<div class="solution-modal">${question.solutionHTML}</div>`);
            return;
        }
        if(e.target.matches('.section__question-confirmation')){
            if(!window.cadastrAppConfig.canConfirm){
                return;
            }
            const questionEl = e.target.closest('.section__question');
            const questionId = questionEl.id;
            const themeEl = e.target.closest('.section__theme');
            const themeIndex = themeEl.dataset.themeIndex;
            const sectionIndex = e.target.closest('.section').dataset.sectionIndex;
            const themeObj = theory[sectionIndex].themes[themeIndex];
            const questions = themeObj.questions;
            const questionObj = questions.find(q => q.id === questionId);
            if(questionObj.confirmed){
                api.unconfirm(questionId);
                questionObj.confirmed = undefined;
            } else {
                api.confirm(questionId);
                questionObj.confirmed = Date.now();
            }
            themeEl.querySelector('.section__theme-bulk-confirmation-container').innerHTML = renderThemeBulkConfirmationButton(themeObj);
            themeEl.querySelector('.section__theme-confirmation-status').innerHTML = renderThemeConfirmationStatus(themeObj);
            questionEl.outerHTML = renderQuestion(questionObj, questions.indexOf(questionObj));
            return;
        }
        if(e.target.matches('.section__theme-title, .section__theme-title *') && !window.cadastrSearch){
            const themeEl = e.target.closest('.section__theme');
            const sectionEl = themeEl.closest('.section');
            const themeIndex = themeEl.dataset.themeIndex;
            const themeObj = theory[sectionEl.dataset.sectionIndex].themes[themeIndex];
            themeObj.open = !themeObj.open;
            themeEl.outerHTML = renderTheme(themeObj, themeIndex);
        }
        if(e.target.matches('.section__question-header, .section__question-header *') && !window.cadastrSearch){
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
            questionObj.learnt ? api.addLearnt(questionId) : api.deleteLearnt(questionId);
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