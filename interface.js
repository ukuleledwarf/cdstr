class QuestionOption {
    id = String;
    text = String;
    img = String || null;
}

class Question {
    id = String;
    text = String;
    options = [QuestionOption];
    answer = String;
    solutionHTML = String;
    siblings = [String];
    learnt = Boolean;
    /** timestamp when the question was confirmed */
    confirmed = Number || undefined;
    matched = Boolean;
    markedText = String;
}

class Theme {
    title = String;
    questions = [Question];
    open = Boolean;
    // percents of learnt questions
    progress = Number;
    matched = Boolean;
}

class Section {
    matched = Boolean;
}