import { sections } from './sections.js';
import { render } from './render.js';
import { listenAppClicks } from './click.js';
import { API } from './api.js';

const users = [
    'innaos',
];


const user = window.location.search.slice(1);

if(users.includes(user)){
    const api = new API(user);
    const learntQuestionIds = await api.get();
    const theory = sections.map(section => ({
        ...section,
        themes: section.themes.map(theme => ({
            ...theme,
            open: false,
            questions: theme.questions.map(question => ({
                ...question,
                learnt: learntQuestionIds.includes(question.id),
            }))
        }))
    }))
    const contentHTML = render(theory);
    document.getElementById('content').insertAdjacentHTML('afterbegin', contentHTML);
    listenAppClicks(theory, api);   
} else {
    document.body.innerHTML = '<div style="height: 100vh; width: 100vw; display: flex; justify-content: center; align-items: center; font-size: 20px; padding: 20px; text-align: center;">Пользователь не указан либо не имеет доступа</div>';
}