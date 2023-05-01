function toggleThemeContent(themeEl){
    const contentEl = themeEl.querySelector('.section__theme-content');
    if(contentEl){
        contentEl.remove();
        return;
    }
    const sectionEl = themeEl.closest('.section');
    const questionList = theory[sectionEl.dataset.sectionIndex].themes[themeEl.dataset.themeIndex].questions;
    const contentHTML = `
        <div class="section__theme-content">
            ${questionList.map((question, qIndex) => `
                <div class="section__question" id="${question.id}">
                    <div class="section__question-text">
                        <div class="section__question-text-number">${qIndex + 1}.&nbsp;</div>
                        <div>${question.text} ${question.siblings.map((sib, sInd) => `<span class="section__question-sibling" data-id="${sib}">Такой же ${sInd + 1}</span>`).join('')}</div>
                    </div>
                    <div class="section__question-options">
                        ${question.options.map(option => `
                            <label id="${option.id}" class="section__question-option ${option.id === question.answer ? 'section__question-option_answer' : ''}">
                                ${option.img ? 
                                    `<img class="section__question-img" src="${option.img}"/>` : 
                                    `<input class="section__question-radio" type="radio" name="radio-${question.answer}"></input>${option.text}`
                                }
                            </label>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    themeEl.insertAdjacentHTML('beforeend', contentHTML);
}

const contentHTML = theory.map((section, sectionIndex) => `
    <div class="section" data-section-index="${sectionIndex}">
        <div class="section__title">Раздел ${section.name}</div>
        <div class="section__content">
            ${section.themes.map((theme, themeIndex) => `
                <div class="section__theme" data-theme-index="${themeIndex}">
                    <div class="section__theme-title">${theme.title} <b>(${theme.questions.length})</b></div>
                </div>
            `).join('')}
        </div>
    </div>
`).join('');

document.getElementById('content').insertAdjacentHTML('afterbegin', contentHTML);