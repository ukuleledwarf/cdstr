export function renderQuestion(question, qIndex){
    return question.matched ? `
        <div class="section__question ${(question.learnt && !window.cadastrSearch) ? 'section__question_learnt' : ''}" id="${question.id}">
            <div class="section__question-text">
                <div class="section__question-text-number">${qIndex + 1}.&nbsp;</div>
                <div>
                    ${question.markedText}
                    ${question.siblings.map(
                        (sib, sInd) => `<span class="section__question-sibling" data-id="${sib}">Такой же ${sInd + 1}</span>`
                    ).join('')}
                    ${(function(){
                        const poinerClass = window.cadastrAppConfig.canConfirm ? 'section__question-confirmation_pointer' : '';
                        const confirmedTitleEnding = window.cadastrAppConfig.canConfirm ? ' Нажмите чтобы отменить проверенность.' : '';
                        if(question.confirmed){
                            return `<span title="Вопрос проверен (сверен с офиц. тестами) ${new Date(+question.confirmed)}.${confirmedTitleEnding}" class="section__question-confirmation section__question-confirmation_confirmed ${poinerClass}">✔</span>`;
                        }
                        if(window.cadastrAppConfig.canConfirm){
                            return `<span title="Нажмите чтобы подтвердить правильность вопроса и ответа" class="section__question-confirmation ${poinerClass}">✔</span>`;
                        }
                        return '';
                    })()}
                    <span title="Решение" class="section__question-solution">?</span>
                </div>
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
    ` : ''
}

export function renderThemeProgress(questions){
    const learntCount = questions.filter(q => q.learnt).length;
    const percents = learntCount * 100 / questions.length;
    return Math.floor(percents);
}

export function renderTheme(theme, themeIndex){
    const content = theme.open ? `<div class="section__theme-content">
        ${theme.questions.map((question, qIndex) => renderQuestion(question, qIndex)).join('')}
    </div>` : '';
    return theme.matched ? `
        <div class="section__theme" data-theme-index="${themeIndex}">
            <div class="section__theme-title">${theme.title} <b>(${theme.questions.length})</b><span class="section__theme-progress">${renderThemeProgress(theme.questions)}</span></div>
            ${content}
        </div>
    ` : '';
}

export function render(theory){
    return theory.map((section, sectionIndex) => section.matched ? `
        <div class="section" data-section-index="${sectionIndex}">
            <div class="section__title">Раздел ${section.name}</div>
            <div class="section__content">
                ${section.themes.map((theme, themeIndex) => renderTheme(theme, themeIndex)).join('')}
            </div>
        </div>
    ` : '').join('');
}