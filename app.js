import { sections } from './sections.js';
import { render } from './render.js';
import { listenAppClicks } from './click.js';
import { API } from './api.js';

const users = [
    'innaos',
    'yuriypros',
    'sergeystad',
];

const user = window.location.search.slice(1);

if(users.includes(user)){
    const api = new API(user);
    const learntQuestionIds = await api.get();
    const theory = sections.map(section => ({
        ...section,
        matched: true,
        themes: section.themes.map(theme => ({
            ...theme,
            matched: true,
            open: false,
            questions: theme.questions.map(question => ({
                ...question,
                matched: true,
                markedText: question.text,
                learnt: learntQuestionIds.includes(question.id),
            }))
        }))
    }));
    window.cadastrSearch = '';
    window.cadastrRender = () => {

        if(window.cadastrSearch){
            theory.forEach(section => {
                section.matched = false;
                section.themes.forEach(theme => {
                    theme.matched = false;
                    theme.questions.forEach(question => {
                        question.matched = false;
                        if(question.text.includes(window.cadastrSearch)){
                            question.matched = true;
                            theme.matched = true;
                            theme.open = true;
                            section.matched = true;
                            question.markedText = question.text.replaceAll(window.cadastrSearch, `<span class="search-match">${window.cadastrSearch}</span>`);
                        }
                    });
                });
            });
        } else {
            theory.forEach(section => {
                section.matched = true;
                section.themes.forEach(theme => {
                    theme.open = false;
                    theme.matched = true;
                    theme.questions.forEach(question => {
                        question.matched = true;
                        question.markedText = question.text;
                    });
                });
            });
        }
        
        const contentHTML = render(theory);
        document.getElementById('content').innerHTML = contentHTML;
    };
    cadastrRender();
    listenAppClicks(theory, api);   
} else {
    document.body.innerHTML = '<div style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; font-size: 20px; padding: 20px; text-align: center;">Пользователь не указан либо не имеет доступа</div>';
}