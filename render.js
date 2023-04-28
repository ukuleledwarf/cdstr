const contentHTML = theory.map(section => `
    <div class="section">
        <div class="section__title">Раздел ${section.name}</div>
        <div class="section__content">
            ${section.themes.map(theme => `
                <div class="section__theme">
                    <div class="section__theme-title">${theme.title}</div>
                    <div class="section__theme-content">
                        ${theme.questions.map((question, qIndex) => `
                            <div class="section__question">
                                <div class="section__question-text">
                                    <div class="section__question-text-number">${qIndex + 1}.&nbsp;</div>
                                    ${question.text}
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
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
`).join('');

document.getElementById('content').insertAdjacentHTML('afterbegin', contentHTML);