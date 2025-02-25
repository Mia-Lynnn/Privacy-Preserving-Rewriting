// Scenario list variable.
var sceList= [];
var factList = {}; // To store facts by scenario ID for quick lookup Mia

// Store the courtCasePageNumber button Ids.
var courtCasePageNumberIds = [];

// Store related section buttons Ids.
var relatedSectionBtnIds = [];

var currentCourtCaseCount = 1;

// function that runs all necessary initial retrieval.
function init() {
    // Get the first id scenerio from db.
    getSceData();
    //getScenarioList();
    createRelationButtons();
    displayUser();
    getLegalConcepts();
    createReasonButtons();

}

function getSceData(){
     $.getJSON('./data/dataRewrite.json', function(data) {
       $.each(data, function(i, f) {
          //console.log(f.ID,f.Scenario)
          //console.log("f",f.ID);
          var tmp = f.ID+ ","+f.Scenario;
          //console.log("tmp",tmp);
          sceList.push(f);
     });
     getScenarioList();
   });
   console.log("scelist ",sceList);

   // Fetch facts
   $.getJSON('./data/facts.json', function(data) {
    data.forEach(fact => {
        factList[fact.ID] = fact.RewrittenFacts; 
    });
   });
}



// The the list of scenarios available in the database.
function getScenarioList() {
    // get all declared scenarios.

    var scenarioSelect = document.getElementById("scenarioSelect");

    $.each(sceList, function (index, value) {
        //console.log("valud ID ",value.ID);
        scenarioSelect.innerHTML +=
            ('<option value="' + value.ID + '">' + value.ID + '</option>\n');

    });

    //console.log(sceList);
}

// get scenario based on id.
function getScenario() {
    const scenarioSelect = document.getElementById('scenarioSelect');


    let selectedId = scenarioSelect.value;

    if (selectedId == 0) {
        var element = document.getElementById("ScenarioText");
        element.innerHTML = null;
        return;
    }

    $.each(sceList, function (index, value) {
        if (value.ID == selectedId) {
            changeScenarioText(value);

        }
    });

    // Clear all annotations.
    r.clearAnnotations();

    // Clear all annotation buttons and reset the annotation button array.
    removeAllAnnotationBtnIds();
    annotationBtnIds = [];

    displayFacts(selectedId);//Mia get facts when choose
}

// Change the scenario text based on retrieved scenario text from db.
function changeScenarioText(scenario) {
    console.log("scenario var ",scenario.Issue);
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.Scenario;

    //update other fileds
    document.getElementById("issues").value = scenario.Issue;
    document.getElementById("decompositions").value = scenario.DecomQ;

}
// Display rewritten facts for the selected scenario ID
function displayFacts(scenarioId) {
    const rewrittenFacts = factList[scenarioId] || [];
    const factTableBody = document.getElementById("factTableBody");
    factTableBody.innerHTML = ""; // Clear previous entries

    rewrittenFacts.forEach((fact, index) => {
        const row = factTableBody.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.innerHTML = index + 1;
        cell2.innerHTML = fact;
    });
}

function createRelationButtons() {
    // Const relation.
    const relationData = [
        { name: ' { IF  ELSE  }', text: '{ IF......ELSE......  } ' },
        { name: ' { IF  THEN }', text: '{ IF ..... THEN .... } ' },
        { name: ' { ONLY IF }', text: '{ ONLY IF......} ' },
        { name: ' { AND }', text: '{AND}' },
        { name: ' { OR }', text: '{OR}' },
        { name: ' { HOWEVER }', text: '{HOWEVER}' },
    ];

    // Get relation btn div id.
    var relationBtnDiv = document.getElementById('relationBtns');

    $.each(relationData, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-info';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = value.name + 'Btn';

        // Add text to be displayed on button.
        button.innerHTML = value.name;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            var analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            var analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + value.text + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        relationBtnDiv.appendChild(button);
    });
}



function createReasonButtons() {
    // Const relation.
    const relationData = [
        { name: ' { LEGALLIZATION}', text: '{LEGALLIZATION}' },
        { name: ' { COMMON_SENSE }', text: '{COMMON_SENSE}' },
        { name: ' { CO-REFERENCE }', text: '{CO-REFERENCE}' },
    ];

    // Get relation btn div id.
    var relationBtnDiv = document.getElementById('reasonBtns');

    $.each(relationData, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-primary';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = value.name + 'Btn';

        // Add text to be displayed on button.
        button.innerHTML = value.name;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            var analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            var analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + value.text + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        relationBtnDiv.appendChild(button);
    });
}

function saveFile() {
    // Get the data from each element on the form.
    var Username = document.getElementById('userDisplay');
    var scenarioID = document.getElementById('scenarioSelect');
    var issues = document.getElementById('issues');
    var decomQues = document.getElementById('decompositions');
    var analysis = document.getElementById('analysisTextArea');
    var conclusion = document.getElementById('conclusion');
    var selectedSectionOptions = $('#selectedSections').val();

    let relatedCourtCasePageNumbers = [];
    // Get list of filled court case and pg number.
    for (let i = 1; i <= currentCourtCaseCount; i++) {
        let relatedCourtCaseId = 'relatedCourtCase_' + i;
        let courtCaseNumId = 'courtCase_Num_' + i;
        let relatedCourtCase = document.getElementById(relatedCourtCaseId);
        let courtCaseNum = document.getElementById(courtCaseNumId);

        relatedCourtCasePageNumbers.push(relatedCourtCase.value + '[' + courtCaseNum.value + ']');
    }

    // This variable stores all the data.

    var data_json = {
        "User": Username.innerHTML,
        "ScenarioID": scenarioID.value,
        "Text_Tags": selectedAnnotation,
        "Selected_Relations": selectedRelations,
        "Issues": issues.value,
        "DecomQues":decomQues.value,
        "Sections": selectedSectionOptions,
        "RelatedCourtCase_pageNumList": relatedCourtCasePageNumbers,
        "Analysis": analysis.value,
        "Conclusion": conclusion.value,
        "Original_Objects": highlightedObject
    };

    var data = JSON.stringify(data_json);

    console.log(data_json);
    var currentdate = new Date();
    var date = currentdate.getDate() + "_" + (currentdate.getMonth() + 1) + "_" +
        currentdate.getHours() + currentdate.getMinutes();
    var filename = 'Annotated_' + scenarioID.value + '_' + date + '.txt'

    let blob = new Blob([data]);
    let url = URL.createObjectURL(blob);
    let file = document.createElement(`a`);
    file.download = filename;
    file.href = url;
    document.body.appendChild(file);
    file.click();
    file.remove();
    URL.revokeObjectURL(url);
}

function displayUser() {
    var inputTest = localStorage['username'];
    /*alert('Inserted Data ' + localStorage['username']);*/
    console.log('User name : ', inputTest)
    document.getElementById('userDisplay').innerHTML = inputTest;
}

// Function to remove all the annotation btn ids from the list.
function removeAllAnnotationBtnIds() {
    $.each(annotationBtnIds, function (index, value) {
        var elem = document.getElementById(value);
        elem.parentNode.removeChild(elem);
    });
}

// Function to generate related sections button.
// Will replace the existing buttons if any.
// Cannot create if there are no selected related sections(disabled by UI).
function generateRelatedSectionsBtn() {
    // remove existing court case page number button id if not null.
    if (relatedSectionBtnIds.length > 0) {
        $.each(relatedSectionBtnIds, function (index, value) {
            var elem = document.getElementById(value);
            elem.parentNode.removeChild(elem);
        });
        relatedSectionBtnIds = [];
    }

    // Get courtCasePageNumberBtns div id.
    var relatedSectionBtnsDiv = document.getElementById('relatedSectionBtns');

    let relationSectionArray = $('#selectedSections').val();

    $.each(relationSectionArray, function (index, value) {
        // Create button element.
        var button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-secondary';

        let mergedText = '{' + 'Section ' + value + '}';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = mergedText + 'Btn';

        // Store related section btn id.
        relatedSectionBtnIds.push(button.id);

        // Add text to be displayed on button.
        button.innerHTML = mergedText;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            var analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            var analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + mergedText + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        relatedSectionBtnsDiv.appendChild(button);
    });
}

// Function to check if the the generate related section(RS) button is disabled.
function checkDisabledRS() {
    let selectedSectionOptions = $('#selectedSections').val().toString();
    console.log(selectedSectionOptions);
    if (selectedSectionOptions == '') {
        document.getElementById('generateRSBtn').disabled = true;
    }
    else {
        document.getElementById('generateRSBtn').disabled = false;
    }
}

// function to get scenario based on id.
function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts2 = [
        { id: 1, name: 'Offer Date', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 2, name: 'Communication of Acceptance', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' }
    ];

    displayLegalConcepts(legalConcepts2);
}

// assign legal concept rows of data to legal concepts table html.
function displayLegalConcepts(legalConcepts) {
    var table = document.getElementById("legalConceptTable");

    $.each(legalConcepts, function (index, value) {
        table.innerHTML +=
            ('<tr>\n' +
                '<td>' + value.id + '</td>\n' +
                '<td>' + value.name + '</td>\n' +
                '<td>' + value.relatedTopic + '</td>\n' +
                '<td>' + value.relatedSection + '</td>\n' +
                '<td>' + value.other + '</td>\n' +
                '</tr>');
    });
}

function addCourtCase() {
    // get view element.
    let courtCaseView = document.getElementById("courtCaseView");

    // Increase court case global count.
    currentCourtCaseCount++;

    let newCourtCaseInput = document.createElement('span');
    newCourtCaseInput.innerHTML =
        ('<div class="row" id="courtCase_' + currentCourtCaseCount + '" style="margin-bottom: 10px;">'
            + '<div class="col-sm-2">'
            + '<label class="col-form-label">#' + currentCourtCaseCount + '</label>'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<input type="text" class="form-control" id="relatedCourtCase_' + currentCourtCaseCount + '">'
            + '</div>'
            + '<div class="col-sm-4">'
            + '<input type="text" class="form-control" id="courtCase_Num_' + currentCourtCaseCount + '">'
            + '</div>'
            + '<div class="col-sm-2">'
            + '</div>'
            + '</div>');
    courtCaseView.appendChild(newCourtCaseInput);
}

function removeCourtCase() {
    // Do not allow remove if currentCourtCaseCount is 1.
    // There must always be one court case available.
    if (currentCourtCaseCount != 1) {
        // Get court case id to remove based on global current court case count.
        let courtCaseId = 'courtCase_' + currentCourtCaseCount;

        // Remove target court case.
        var elem = document.getElementById(courtCaseId);
        elem.parentNode.removeChild(elem);

        // Reduce gloval court case count.
        currentCourtCaseCount--;
    }
}

// Function to generate court case page number button.
// Will replace the existing button if any.
// Cannot create a court case page number button if the two affected fields are null or String empty('').
function generateCourtCasePageNumberBtn() {
    // remove existing court case page number button ids if not null.
    if (courtCasePageNumberIds.length > 0) {
        $.each(courtCasePageNumberIds, function (index, value) {
            var elem = document.getElementById(value);
            elem.parentNode.removeChild(elem);
        });
        courtCasePageNumberIds = [];
    }

    // Loop for the number of currentCourtCaseCount.
    for (let i = 1; i <= currentCourtCaseCount; i++) {
        let relatedCourtCase = 'relatedCourtCase_' + i;
        let courtCaseNum = 'courtCase_Num_' + i;
        // If either field is null, do not create button.
        let relatedCourtCaseField = document.getElementById(relatedCourtCase);
        if (relatedCourtCaseField.value == null || relatedCourtCaseField.value == '')
            return;

        let relatedCourtCaseNumField = document.getElementById(courtCaseNum);
        if (relatedCourtCaseNumField.value == null || relatedCourtCaseField.value == '')
            return;

        // Merge the court case and page number text into one text.
        let mergedCourtCasePageNumberText = '{' + relatedCourtCaseField.value + '[' + relatedCourtCaseNumField.value + ']' + '}';

        // Get courtCasePageNumberBtns div id.
        let courtCasePageNumberBtnsDiv = document.getElementById('courtCasePageNumberBtns');

        // Create button element.
        let button = document.createElement('button');

        button.type = 'button';
        button.className = 'btn btn-outline-primary';

        // Id will be the relationName + 'Btn'.
        // Ex.Selected IfElse => The button id is 'IfElseBtn'.
        // It is case senstive and also will take in spaces.
        button.id = mergedCourtCasePageNumberText + 'Btn';

        // Add button id to global.
        courtCasePageNumberIds.push(button.id);

        // Add text to be displayed on button.
        button.innerHTML = mergedCourtCasePageNumberText;

        // Add onClick event to add the selected relation to analysis text area at the cursor.
        button.addEventListener('click', function (event) {
            // Get current position of cursor at analysis text area.
            // If no cursor, it will append at the end of the textArea's text.
            let analysisTxtBox = document.getElementById('analysisTextArea');
            let curPos = analysisTxtBox.selectionStart;

            // Get current text in analysisTextArea.
            let analysisTextAreaValue = $('#analysisTextArea').val();

            // Insert text at cursor position.
            $('#analysisTextArea').val(
                analysisTextAreaValue.slice(0, curPos) + mergedCourtCasePageNumberText + analysisTextAreaValue.slice(curPos));

            // Restore cursor position to end of analysis text area after clicking on button.
            analysisTextArea.focus();
        });

        // Append the  button to annotation div.
        courtCasePageNumberBtnsDiv.appendChild(button);
    }
}

function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts = [
    {'id': 3, 'primary': 'Acceptance', 'secondaryies': 'absolute and unqualified', 'tertiaryies': 'case example', 'combine_text': '{Acceptance:absolute and unqualified:case example}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.054, 4.055]} ,
{'id': 4, 'primary': 'Acceptance', 'secondaryies': 'acceptor’s advantages', 'tertiaryies': '', 'combine_text': '{Acceptance:acceptor’s advantages}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.119]} ,
{'id': 5, 'primary': 'Acceptance', 'secondaryies': 'characteristics', 'tertiaryies': '', 'combine_text': '{Acceptance:characteristics}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.053]} ,
{'id': 6, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'completion', 'combine_text': '{Acceptance:communication of:completion}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.077]} ,
{'id': 7, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'conditions unfulfilled despite', 'combine_text': '{Acceptance:communication of:conditions unfulfilled despite}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.075]} ,
{'id': 8, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'deeming', 'combine_text': '{Acceptance:communication of:deeming}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.071]} ,
{'id': 9, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'effective', 'combine_text': '{Acceptance:communication of:effective}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.077]} ,
{'id': 10, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'English law', 'combine_text': '{Acceptance:communication of:English law}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.069, 4.07, 4.073]} ,
{'id': 11, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'general rule', 'combine_text': '{Acceptance:communication of:general rule}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.069]} ,
{'id': 12, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'Malaysia', 'combine_text': '{Acceptance:communication of:Malaysia}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.07]} ,
{'id': 13, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'means', 'combine_text': '{Acceptance:communication of:means}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.072]} ,
{'id': 14, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'omission', 'combine_text': '{Acceptance:communication of:omission}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.072, 4.074]} ,
{'id': 15, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'silence', 'combine_text': '{Acceptance:communication of:silence}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.073, 4.076]} ,
{'id': 16, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'timing', 'combine_text': '{Acceptance:communication of:timing}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.078]} ,
{'id': 17, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'unilateral proposals', 'combine_text': '{Acceptance:communication of:unilateral proposals}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.075]} ,
{'id': 18, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'case', 'combine_text': '{Acceptance:communication of:case}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.079]} ,
{'id': 19, 'primary': 'Acceptance', 'secondaryies': 'communication of', 'tertiaryies': 'case analysis', 'combine_text': '{Acceptance:communication of:case analysis}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.069, 4.07, 4.071, 4.072, 4.073, 4.074, 4.075, 4.076, 4.077, 4.078, 4.079, 4.08, 4.081, 4.082, 4.083, 4.084, 4.085, 4.086, 4.08, 4.081]} ,
{'id': 20, 'primary': 'Acceptance', 'secondaryies': 'Contracts Act 1950 s 2(b)', 'tertiaryies': '', 'combine_text': '{Acceptance:Contracts Act 1950 s 2(b)}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.052]} ,
{'id': 21, 'primary': 'Acceptance', 'secondaryies': 'examples of analysis of existence', 'tertiaryies': '', 'combine_text': '{Acceptance:examples of analysis of existence}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.006, 4.007]} ,
{'id': 22, 'primary': 'Acceptance', 'secondaryies': 'mala fide', 'tertiaryies': '', 'combine_text': '{Acceptance:mala fide}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.098]} ,
{'id': 23, 'primary': 'Acceptance', 'secondaryies': 'motive', 'tertiaryies': '', 'combine_text': '{Acceptance:motive}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.051]} ,
{'id': 24, 'primary': 'Acceptance', 'secondaryies': 'necessity', 'tertiaryies': '', 'combine_text': '{Acceptance:necessity}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.052]} ,
{'id': 25, 'primary': 'Acceptance', 'secondaryies': 'omission', 'tertiaryies': '', 'combine_text': '{Acceptance:omission}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.072, 4.074]} ,
{'id': 26, 'primary': 'Acceptance', 'secondaryies': 'oral contract case example', 'tertiaryies': 'evidence', 'combine_text': '{Acceptance:oral contract case example:evidence}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.057, 4.058]} ,
{'id': 27, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'case example', 'combine_text': '{Acceptance:postal acceptance:case example}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.062, 4.063, 4.078, 4.082]} ,
{'id': 28, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'Contracts Act 1950 s 4(2)', 'combine_text': '{Acceptance:postal acceptance:Contracts Act 1950 s 4(2)}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.08, 4.082, 4.062, 4.063, 4.082]} ,
{'id': 29, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'facts and evidence', 'combine_text': '{Acceptance:postal acceptance:facts and evidence}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.062, 4.063, 4.082, 4.083]} ,
{'id': 30, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'limitation of rule', 'combine_text': '{Acceptance:postal acceptance:limitation of rule}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.062, 4.063, 4.082, 4.086]} ,
{'id': 31, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'origins of rule', 'combine_text': '{Acceptance:postal acceptance:origins of rule}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.062, 4.063, 4.082, 4.084, 4.085]} ,
{'id': 32, 'primary': 'Acceptance', 'secondaryies': 'postal acceptance', 'tertiaryies': 'case analysis', 'combine_text': '{Acceptance:postal acceptance:case analysis}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.062, 4.063, 4.08, 4.081, 4.082]} ,
{'id': 33, 'primary': 'Acceptance', 'secondaryies': 'prescribed means', 'tertiaryies': 'postal acceptance', 'combine_text': '{Acceptance:prescribed means:postal acceptance}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.061, 4.062, 4.063]} ,
{'id': 34, 'primary': 'Acceptance', 'secondaryies': 'prescribed means', 'tertiaryies': 'redundancy', 'combine_text': '{Acceptance:prescribed means:redundancy}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.06, 4.061]} ,
{'id': 35, 'primary': 'Acceptance', 'secondaryies': 'proposal conditions', 'tertiaryies': '', 'combine_text': '{Acceptance:proposal conditions}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.054]} ,
{'id': 36, 'primary': 'Acceptance', 'secondaryies': 'proposal revoked before', 'tertiaryies': 'case example', 'combine_text': '{Acceptance:proposal revoked before:case example}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.087, 4.088]} ,
{'id': 37, 'primary': 'Acceptance', 'secondaryies': 'reform', 'tertiaryies': 'necessity', 'combine_text': '{Acceptance:reform:necessity}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.124]} ,
{'id': 38, 'primary': 'Acceptance', 'secondaryies': 'reform', 'tertiaryies': 'reason', 'combine_text': '{Acceptance:reform:reason}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.125]} ,
{'id': 39, 'primary': 'Acceptance', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'case example', 'combine_text': '{Acceptance:requirement to make business and economic sense:case example}', 'paragraphs': [4.043, 4.045, 4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.043]} ,
{'id': 40, 'primary': 'Acceptance', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'effect of not making sense', 'combine_text': '{Acceptance:requirement to make business and economic sense:effect of not making sense}', 'paragraphs': [4.043, 4.045, 4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.045]} ,
{'id': 41, 'primary': 'Acceptance', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'principle', 'combine_text': '{Acceptance:requirement to make business and economic sense:principle}', 'paragraphs': [4.043, 4.045, 4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.044]} ,
{'id': 42, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'acceptor’s advantages', 'combine_text': '{Acceptance:revocation:acceptor’s advantages}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.119]} ,
{'id': 43, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'communication', 'combine_text': '{Acceptance:revocation:communication}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.118]} ,
{'id': 44, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'Contracts Act 1950 s 3', 'combine_text': '{Acceptance:revocation:Contracts Act 1950 s 3}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.121]} ,
{'id': 45, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'environment for judicial creativity', 'combine_text': '{Acceptance:revocation:environment for judicial creativity}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.122]} ,
{'id': 46, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'general rule', 'combine_text': '{Acceptance:revocation:general rule}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.099, 4.117]} ,
{'id': 47, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'postal acceptance', 'combine_text': '{Acceptance:revocation:postal acceptance}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.12]} ,
{'id': 48, 'primary': 'Acceptance', 'secondaryies': 'revocation', 'tertiaryies': 'timing', 'combine_text': '{Acceptance:revocation:timing}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.117, 4.118, 4.12]} ,
{'id': 49, 'primary': 'Acceptance', 'secondaryies': 'rules', 'tertiaryies': 'redundancy of prescribed acceptance method', 'combine_text': '{Acceptance:rules:redundancy of prescribed acceptance method}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.059, 4.06]} ,
{'id': 50, 'primary': 'Acceptance', 'secondaryies': 'subject to contract', 'tertiaryies': 'case examples', 'combine_text': '{Acceptance:subject to contract:case examples}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.065, 4.066, 4.068]} ,
{'id': 51, 'primary': 'Acceptance', 'secondaryies': 'subject to contract', 'tertiaryies': 'types of contract inapplicable', 'combine_text': '{Acceptance:subject to contract:types of contract inapplicable}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.065, 4.067]} ,
{'id': 52, 'primary': 'Acceptance', 'secondaryies': 'subject to contract', 'tertiaryies': 'use', 'combine_text': '{Acceptance:subject to contract:use}', 'paragraphs': [4.052, 4.053, 4.054, 4.055, 4.056, 4.057, 4.058, 4.059, 4.06, 4.061, 4.062, 4.063, 4.064, 4.065]} ,
{'id': 53, 'primary': 'Advertisements', 'secondaryies': 'case applying principles', 'tertiaryies': '', 'combine_text': '{Advertisements:case applying principles}', 'paragraphs': [4.029, 4.03, 4.031, 4.032, 4.032]} ,
{'id': 54, 'primary': 'Advertisements', 'secondaryies': 'case illustrating rule', 'tertiaryies': '', 'combine_text': '{Advertisements:case illustrating rule}', 'paragraphs': [4.029, 4.03, 4.031, 4.032, 4.03]} ,
{'id': 55, 'primary': 'Advertisements', 'secondaryies': 'circulars and catalogues', 'tertiaryies': '', 'combine_text': '{Advertisements:circulars and catalogues}', 'paragraphs': [4.029, 4.03, 4.031, 4.032, 4.031]} ,
{'id': 56, 'primary': 'Advertisements', 'secondaryies': 'invitations to treat', 'tertiaryies': '', 'combine_text': '{Advertisements:invitations to treat}', 'paragraphs': [4.029, 4.03, 4.031, 4.032, 4.029]} ,
{'id': 57, 'primary': 'Advertisements', 'secondaryies': 'purpose', 'tertiaryies': '', 'combine_text': '{Advertisements:purpose}', 'paragraphs': [4.029, 4.03, 4.031, 4.032, 4.029]} ,
{'id': 61, 'primary': 'Agreements', 'secondaryies': 'memoranda of understanding as enforceable agreement', 'tertiaryies': '', 'combine_text': '{Agreements:memoranda of understanding as enforceable agreement}', 'paragraphs': [7.032]} ,
{'id': 63, 'primary': 'Agreements', 'secondaryies': 'void for lack of consideration', 'tertiaryies': '', 'combine_text': '{Agreements:void for lack of consideration}', 'paragraphs': [5.01, 5.011, 5.012, 5.013]} ,
{'id': 69, 'primary': 'Auctions', 'secondaryies': 'definition', 'tertiaryies': '', 'combine_text': '{Auctions:definition}', 'paragraphs': [4.033, 4.034, 4.036, 4.033]} ,
{'id': 70, 'primary': 'Auctions', 'secondaryies': 'invitation to treat or proposal', 'tertiaryies': '', 'combine_text': '{Auctions:invitation to treat or proposal}', 'paragraphs': [4.033, 4.034, 4.036, 4.035]} ,
{'id': 71, 'primary': 'Auctions', 'secondaryies': 'Payne v Cave', 'tertiaryies': '', 'combine_text': '{Auctions:Payne v Cave}', 'paragraphs': [4.033, 4.034, 4.036, 4.035, 4.036]} ,
{'id': 72, 'primary': 'Auctions', 'secondaryies': 'sale by', 'tertiaryies': '', 'combine_text': '{Auctions:sale by}', 'paragraphs': [4.033, 4.034, 4.036, 4.034]} ,
{'id': 73, 'primary': 'Australia', 'secondaryies': 'promissory estoppel', 'tertiaryies': '1980s arrival and early use', 'combine_text': '{Australia:promissory estoppel:1980s arrival and early use}', 'paragraphs': [6.024]} ,
{'id': 74, 'primary': 'Australia', 'secondaryies': 'promissory estoppel', 'tertiaryies': 'landmark judicial decision', 'combine_text': '{Australia:promissory estoppel:landmark judicial decision}', 'paragraphs': [6.025, 6.028]} ,
{'id': 75, 'primary': 'Australia', 'secondaryies': 'promissory estoppel', 'tertiaryies': 'parties’ pre-existing contractual relationship requirement obviated', 'combine_text': '{Australia:promissory estoppel:parties’ pre-existing contractual relationship requirement obviated}', 'paragraphs': [6.027]} ,
{'id': 76, 'primary': 'Australia', 'secondaryies': 'promissory estoppel', 'tertiaryies': '“shield” not “sword” requirement overturned', 'combine_text': '{Australia:promissory estoppel:“shield” not “sword” requirement overturned}', 'paragraphs': [6.026]} ,
{'id': 97, 'primary': 'Capacity', 'secondaryies': 'disqualification from contracting', 'tertiaryies': '', 'combine_text': '{Capacity:disqualification from contracting}', 'paragraphs': [7.035, 7.036, 7.051, 7.055]} ,
{'id': 98, 'primary': 'Capacity', 'secondaryies': 'incapacity', 'tertiaryies': '', 'combine_text': '{Capacity:incapacity}', 'paragraphs': [7.035, 7.036, 7.052, 7.053, 7.055]} ,
{'id': 99, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'adults contracting with', 'combine_text': '{Capacity:minors:adults contracting with}', 'paragraphs': [7.035, 7.036, 7.037, 7.038, 7.041, 7.055]} ,
{'id': 100, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'case example', 'combine_text': '{Capacity:minors:case example}', 'paragraphs': [7.035, 7.036, 7.037, 7.039, 7.041, 7.055]} ,
{'id': 101, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'determination of minority', 'combine_text': '{Capacity:minors:determination of minority}', 'paragraphs': [7.035, 7.036, 7.037, 7.04, 7.041, 7.055]} ,
{'id': 102, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'employment contracts', 'combine_text': '{Capacity:minors:employment contracts}', 'paragraphs': [7.035, 7.036, 7.037, 7.041, 7.0425, 7.043, 7.055]} ,
{'id': 103, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'exceptions to inability to contract', 'combine_text': '{Capacity:minors:exceptions to inability to contract}', 'paragraphs': [7.035, 7.036, 7.037, 7.041, 7.042, 7.055]} ,
{'id': 104, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'legal protection', 'combine_text': '{Capacity:minors:legal protection}', 'paragraphs': [7.035, 7.036, 7.037, 7.038, 7.041, 7.055]} ,
{'id': 105, 'primary': 'Capacity', 'secondaryies': 'minors', 'tertiaryies': 'scholarship contracts', 'combine_text': '{Capacity:minors:scholarship contracts}', 'paragraphs': [7.035, 7.036, 7.037, 7.041, 7.044, 7.055]} ,
{'id': 106, 'primary': 'Capacity', 'secondaryies': 'unsound mind', 'tertiaryies': 'caution', 'combine_text': '{Capacity:unsound mind:caution}', 'paragraphs': [7.035, 7.036, 7.045, 7.048, 7.055]} ,
{'id': 107, 'primary': 'Capacity', 'secondaryies': 'unsound mind', 'tertiaryies': 'sound mind', 'combine_text': '{Capacity:unsound mind:sound mind}', 'paragraphs': [7.045, 7.047, 7.035, 7.036, 7.045, 7.055]} ,
{'id': 108, 'primary': 'Capacity', 'secondaryies': 'unsound mind', 'tertiaryies': 'unsound mind contracting during lucidity', 'combine_text': '{Capacity:unsound mind:unsound mind contracting during lucidity}', 'paragraphs': [7.035, 7.036, 7.045, 7.049, 7.05, 7.055]} ,
{'id': 127, 'primary': 'Common law', 'secondaryies': 'past consideration', 'tertiaryies': '', 'combine_text': '{Common law:past consideration}', 'paragraphs': [5.031, 5.032, 5.033, 5.034]} ,
{'id': 128, 'primary': 'Common law', 'secondaryies': 'proposal termination', 'tertiaryies': '', 'combine_text': '{Common law:proposal termination}', 'paragraphs': [4.112, 4.113, 4.115, 4.116]} ,
{'id': 147, 'primary': 'Conditions precedent', 'secondaryies': 'proposal revocation by unfulfilled', 'tertiaryies': 'burden', 'combine_text': '{Conditions precedent:proposal revocation by unfulfilled:burden}', 'paragraphs': [4.104, 4.107]} ,
{'id': 148, 'primary': 'Conditions precedent', 'secondaryies': 'proposal revocation by unfulfilled', 'tertiaryies': 'case examples', 'combine_text': '{Conditions precedent:proposal revocation by unfulfilled:case examples}', 'paragraphs': [4.104, 4.105, 4.106]} ,
{'id': 149, 'primary': 'Conditions precedent', 'secondaryies': 'proposal revocation by unfulfilled', 'tertiaryies': 'statutory provisions', 'combine_text': '{Conditions precedent:proposal revocation by unfulfilled:statutory provisions}', 'paragraphs': [4.104, 4.108]} ,
{'id': 159, 'primary': 'Consent', 'secondaryies': 'inadequate consideration and', 'tertiaryies': '', 'combine_text': '{Consent:inadequate consideration and}', 'paragraphs': [5.048, 5.049]} ,
{'id': 165, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'agreement made without is void', 'tertiaryies': 'case examples', 'combine_text': '{Consideration. See also Promissory estoppel:agreement made without is void:case examples}', 'paragraphs': [5.01, 5.011, 5.012, 5.013, 5.012, 5.013]} ,
{'id': 166, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'basic element of contract', 'tertiaryies': '', 'combine_text': '{Consideration. See also Promissory estoppel:basic element of contract}', 'paragraphs': [5.01]} ,
{'id': 167, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'definition', 'tertiaryies': 'act', 'combine_text': '{Consideration. See also Promissory estoppel:definition:act}', 'paragraphs': [5.005]} ,
{'id': 168, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'definition', 'tertiaryies': 'common law vs statutory definition', 'combine_text': '{Consideration. See also Promissory estoppel:definition:common law vs statutory definition}', 'paragraphs': [5.006]} ,
{'id': 169, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'definition', 'tertiaryies': 'Contracts Act 1950', 'combine_text': '{Consideration. See also Promissory estoppel:definition:Contracts Act 1950}', 'paragraphs': [5.004]} ,
{'id': 170, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'definition', 'tertiaryies': 'Lush J’s definition', 'combine_text': '{Consideration. See also Promissory estoppel:definition:Lush J’s definition}', 'paragraphs': [5.007]} ,
{'id': 171, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'definition', 'tertiaryies': 'Pollock’s definition', 'combine_text': '{Consideration. See also Promissory estoppel:definition:Pollock’s definition}', 'paragraphs': [5.008]} ,
{'id': 172, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executed', 'tertiaryies': 'Contracts Act 1950', 'combine_text': '{Consideration. See also Promissory estoppel:executed:Contracts Act 1950}', 'paragraphs': [5.024, 5.027]} ,
{'id': 173, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executed', 'tertiaryies': 'contracts with executory and', 'combine_text': '{Consideration. See also Promissory estoppel:executed:contracts with executory and}', 'paragraphs': [5.018, 5.024]} ,
{'id': 174, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executed', 'tertiaryies': 'executory', 'combine_text': '{Consideration. See also Promissory estoppel:executed:executory}', 'paragraphs': [5.024, 5.025, 5.026]} ,
{'id': 175, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executory', 'tertiaryies': 'case examples', 'combine_text': '{Consideration. See also Promissory estoppel:executory:case examples}', 'paragraphs': [5.02, 5.021, 5.022, 5.023, 5.017]} ,
{'id': 176, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executory', 'tertiaryies': 'Contracts Act 1950', 'combine_text': '{Consideration. See also Promissory estoppel:executory:Contracts Act 1950}', 'paragraphs': [5.017, 5.019]} ,
{'id': 177, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executory', 'tertiaryies': 'contracts with executed and', 'combine_text': '{Consideration. See also Promissory estoppel:executory:contracts with executed and}', 'paragraphs': [5.017, 5.018]} ,
{'id': 178, 'primary': 'Consideration. See also Promissory estoppel', 'secondaryies': 'executory', 'tertiaryies': 'executed', 'combine_text': '{Consideration. See also Promissory estoppel:executory:executed}', 'paragraphs': [5.017, 5.025, 5.026]} ,
{'id': 179, 'primary': 'Consideration rules', 'secondaryies': 'adequacy irrelevant. See Consideration sufficiency', 'tertiaryies': '', 'combine_text': '{Consideration rules:adequacy irrelevant. See Consideration sufficiency}', 'paragraphs': [5.028]} ,
{'id': 180, 'primary': 'Consideration rules', 'secondaryies': 'past consideration', 'tertiaryies': 'common law', 'combine_text': '{Consideration rules:past consideration:common law}', 'paragraphs': [5.031, 5.032, 5.033, 5.034, 5.028]} ,
{'id': 181, 'primary': 'Consideration rules', 'secondaryies': 'past consideration', 'tertiaryies': 'Malaysia', 'combine_text': '{Consideration rules:past consideration:Malaysia}', 'paragraphs': [5.035, 5.036, 5.037, 5.038, 5.04, 5.041, 5.042, 5.028]} ,
{'id': 182, 'primary': 'Consideration rules', 'secondaryies': 'past consideration', 'tertiaryies': 'prohibition', 'combine_text': '{Consideration rules:past consideration:prohibition}', 'paragraphs': [5.028, 5.029, 5.03]} ,
{'id': 183, 'primary': 'Consideration rules', 'secondaryies': 'promisee, consideration moving from', 'tertiaryies': 'common law position', 'combine_text': '{Consideration rules:promisee, consideration moving from:common law position}', 'paragraphs': [5.028, 5.073]} ,
{'id': 184, 'primary': 'Consideration rules', 'secondaryies': 'promisee, consideration moving from', 'tertiaryies': 'Malaysia', 'combine_text': '{Consideration rules:promisee, consideration moving from:Malaysia}', 'paragraphs': [5.028, 5.074]} ,
{'id': 185, 'primary': 'Consideration rules', 'secondaryies': 'sufficiency requirement. See Consideration sufficiency', 'tertiaryies': '', 'combine_text': '{Consideration rules:sufficiency requirement. See Consideration sufficiency}', 'paragraphs': [5.028]} ,
{'id': 186, 'primary': 'Consideration rules', 'secondaryies': 'terms. See Terms of contract', 'tertiaryies': '', 'combine_text': '{Consideration rules:terms. See Terms of contract}', 'paragraphs': [5.028]} ,
{'id': 187, 'primary': 'Consideration sufficiency', 'secondaryies': 'forbearance to sue', 'tertiaryies': 'abstinence', 'combine_text': '{Consideration sufficiency:forbearance to sue:abstinence}', 'paragraphs': [5.051, 5.058, 5.059]} ,
{'id': 188, 'primary': 'Consideration sufficiency', 'secondaryies': 'forbearance to sue', 'tertiaryies': 'case examples', 'combine_text': '{Consideration sufficiency:forbearance to sue:case examples}', 'paragraphs': [5.051, 5.058, 5.06]} ,
{'id': 189, 'primary': 'Consideration sufficiency', 'secondaryies': 'forbearance to sue', 'tertiaryies': 'proof required', 'combine_text': '{Consideration sufficiency:forbearance to sue:proof required}', 'paragraphs': [5.051, 5.058, 5.061]} ,
{'id': 190, 'primary': 'Consideration sufficiency', 'secondaryies': 'inadequate consideration and consent', 'tertiaryies': '', 'combine_text': '{Consideration sufficiency:inadequate consideration and consent}', 'paragraphs': [5.051, 5.048, 5.049]} ,
{'id': 191, 'primary': 'Consideration sufficiency', 'secondaryies': 'inadequate consideration', 'tertiaryies': 'immaterial', 'combine_text': '{Consideration sufficiency:inadequate consideration:immaterial}', 'paragraphs': [5.051, 5.045, 5.049]} ,
{'id': 192, 'primary': 'Consideration sufficiency', 'secondaryies': 'inadequate consideration', 'tertiaryies': 'case examples', 'combine_text': '{Consideration sufficiency:inadequate consideration:case examples}', 'paragraphs': [5.051, 5.044, 5.047]} ,
{'id': 193, 'primary': 'Consideration sufficiency', 'secondaryies': 'natural love and affection', 'tertiaryies': 'case example', 'combine_text': '{Consideration sufficiency:natural love and affection:case example}', 'paragraphs': [5.051, 5.057]} ,
{'id': 194, 'primary': 'Consideration sufficiency', 'secondaryies': 'natural love and affection', 'tertiaryies': 'conditions for validity', 'combine_text': '{Consideration sufficiency:natural love and affection:conditions for validity}', 'paragraphs': [5.051, 5.054]} ,
{'id': 195, 'primary': 'Consideration sufficiency', 'secondaryies': 'natural love and affection', 'tertiaryies': 'Contracts Act 1950', 'combine_text': '{Consideration sufficiency:natural love and affection:Contracts Act 1950}', 'paragraphs': [5.051, 5.053, 5.055]} ,
{'id': 196, 'primary': 'Consideration sufficiency', 'secondaryies': 'natural love and affection', 'tertiaryies': 'good consideration in Malaysia', 'combine_text': '{Consideration sufficiency:natural love and affection:good consideration in Malaysia}', 'paragraphs': [5.051, 5.053]} ,
{'id': 197, 'primary': 'Consideration sufficiency', 'secondaryies': 'natural love and affection', 'tertiaryies': 'near relations only', 'combine_text': '{Consideration sufficiency:natural love and affection:near relations only}', 'paragraphs': [5.051, 5.056]} ,
{'id': 198, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'common law invalidity', 'combine_text': '{Consideration sufficiency:part payment of debt:common law invalidity}', 'paragraphs': [5.051, 5.069]} ,
{'id': 199, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'Malaysia, in', 'combine_text': '{Consideration sufficiency:part payment of debt:Malaysia, in}', 'paragraphs': [5.051]} ,
{'id': 200, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'case example', 'combine_text': '{Consideration sufficiency:part payment of debt:case example}', 'paragraphs': [5.051, 5.072]} ,
{'id': 201, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'Contracts Act 1950', 'combine_text': '{Consideration sufficiency:part payment of debt:Contracts Act 1950}', 'paragraphs': [5.051, 5.07, 5.072]} ,
{'id': 202, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'promisee forgoing debt without return', 'combine_text': '{Consideration sufficiency:part payment of debt:promisee forgoing debt without return}', 'paragraphs': [5.051, 5.071]} ,
{'id': 203, 'primary': 'Consideration sufficiency', 'secondaryies': 'part payment of debt', 'tertiaryies': 'statutory waiver', 'combine_text': '{Consideration sufficiency:part payment of debt:statutory waiver}', 'paragraphs': [5.051, 5.07]} ,
{'id': 204, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': 'contractual duty to promisor', 'combine_text': '{Consideration sufficiency:performance of existing duty:contractual duty to promisor}', 'paragraphs': [5.051, 5.062, 5.065]} ,
{'id': 205, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': 'existing contractual duty to third party', 'combine_text': '{Consideration sufficiency:performance of existing duty:existing contractual duty to third party}', 'paragraphs': [5.051, 5.062, 5.068]} ,
{'id': 206, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': '“practical benefit”', 'combine_text': '{Consideration sufficiency:performance of existing duty:“practical benefit”}', 'paragraphs': [5.051, 5.062, 5.067]} ,
{'id': 207, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': 'public duties', 'combine_text': '{Consideration sufficiency:performance of existing duty:public duties}', 'paragraphs': [5.051, 5.062, 5.063]} ,
{'id': 208, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': 'case examples', 'combine_text': '{Consideration sufficiency:performance of existing duty:case examples}', 'paragraphs': [5.051, 5.062, 5.065, 5.066]} ,
{'id': 209, 'primary': 'Consideration sufficiency', 'secondaryies': 'performance of existing duty', 'tertiaryies': 'case examples', 'combine_text': '{Consideration sufficiency:performance of existing duty:case examples}', 'paragraphs': [5.051, 5.062, 5.063, 5.064]} ,
{'id': 210, 'primary': 'Consideration sufficiency', 'secondaryies': 'requirement', 'tertiaryies': '', 'combine_text': '{Consideration sufficiency:requirement}', 'paragraphs': [5.051, 5.043]} ,
{'id': 211, 'primary': 'Consideration sufficiency', 'secondaryies': '“sufficiency” and “adequacy” of consideration', 'tertiaryies': '', 'combine_text': '{Consideration sufficiency:“sufficiency” and “adequacy” of consideration}', 'paragraphs': [5.051, 5.05]} ,
{'id': 212, 'primary': 'Consideration sufficiency', 'secondaryies': 'value of consideration', 'tertiaryies': 'inadequacy immaterial', 'combine_text': '{Consideration sufficiency:value of consideration:inadequacy immaterial}', 'paragraphs': [5.051, 5.044, 5.045, 5.046, 5.047, 5.049]} ,
{'id': 233, 'primary': 'Contract of service', 'secondaryies': 'minors', 'tertiaryies': '', 'combine_text': '{Contract of service:minors}', 'paragraphs': [16.017, 16.018, 7.042]} ,
{'id': 241, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'acceptance subject to contract', 'tertiaryies': '', 'combine_text': '{Contracts. See also Agreements:acceptance subject to contract}', 'paragraphs': [4.064, 4.065, 4.067, 4.068]} ,
{'id': 242, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'agreement made without consideration is void', 'tertiaryies': '', 'combine_text': '{Contracts. See also Agreements:agreement made without consideration is void}', 'paragraphs': [5.01, 5.011, 5.012, 5.013]} ,
{'id': 246, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'commercial contract interpretation', 'tertiaryies': '', 'combine_text': '{Contracts. See also Agreements:commercial contract interpretation}', 'paragraphs': [4.011]} ,
{'id': 264, 'primary': 'Contracts. See also Agreements', 'secondaryies': 'failure', 'tertiaryies': '', 'combine_text': '{Contracts. See also Agreements:failure}', 'paragraphs': [4.012]} ,
{'id': 271, 'primary': 'Contracts Act 1950', 'secondaryies': '1800s-era principles', 'tertiaryies': '', 'combine_text': '{Contracts Act 1950:1800s-era principles}', 'paragraphs': [4.123]} ,
{'id': 272, 'primary': 'Contracts Act 1950', 'secondaryies': 'agreement made without consideration is void', 'tertiaryies': '', 'combine_text': '{Contracts Act 1950:agreement made without consideration is void}', 'paragraphs': [5.01, 5.011, 5.012, 5.013]} ,
{'id': 289, 'primary': 'Contracts Act 1950', 'secondaryies': 'reforming', 'tertiaryies': '', 'combine_text': '{Contracts Act 1950:reforming}', 'paragraphs': [4.126, 4.127]} ,
{'id': 290, 'primary': 'Contracts Act 1950', 'secondaryies': 's 26', 'tertiaryies': '', 'combine_text': '{Contracts Act 1950:s 26}', 'paragraphs': [5.01, 5.011, 5.012, 5.013]} ,
{'id': 306, 'primary': 'Counter offers', 'secondaryies': 'case examples', 'tertiaryies': '', 'combine_text': '{Counter offers:case examples}', 'paragraphs': [4.114, 4.115]} ,
{'id': 307, 'primary': 'Counter offers', 'secondaryies': 'modification of initial proposal by proposee', 'tertiaryies': '', 'combine_text': '{Counter offers:modification of initial proposal by proposee}', 'paragraphs': [4.112, 4.113]} ,
{'id': 308, 'primary': 'Counter offers', 'secondaryies': 'negotiations', 'tertiaryies': '', 'combine_text': '{Counter offers:negotiations}', 'paragraphs': [4.116]} ,
{'id': 309, 'primary': 'Counter offers', 'secondaryies': 'revocation', 'tertiaryies': '', 'combine_text': '{Counter offers:revocation}', 'paragraphs': [4.112]} ,
{'id': 368, 'primary': 'Death', 'secondaryies': 'revocation of proposal due to proposer’s death', 'tertiaryies': 'agent proposer', 'combine_text': '{Death:revocation of proposal due to proposer’s death:agent proposer}', 'paragraphs': [4.109, 4.11]} ,
{'id': 369, 'primary': 'Death', 'secondaryies': 'revocation of proposal due to proposer’s death', 'tertiaryies': 'knowledge of proposee', 'combine_text': '{Death:revocation of proposal due to proposer’s death:knowledge of proposee}', 'paragraphs': [4.109]} ,
{'id': 370, 'primary': 'Death', 'secondaryies': 'revocation of proposal due to proposer’s death', 'tertiaryies': 'obligations only proposer can fulfil included', 'combine_text': '{Death:revocation of proposal due to proposer’s death:obligations only proposer can fulfil included}', 'paragraphs': [4.109, 4.111]} ,
{'id': 465, 'primary': 'English law. See also United Kingdom', 'secondaryies': 'acceptance communication', 'tertiaryies': '', 'combine_text': '{English law. See also United Kingdom:acceptance communication}', 'paragraphs': [4.069, 4.07, 4.073]} ,
{'id': 472, 'primary': 'English law. See also United Kingdom', 'secondaryies': 'determination of intent to create legal relationship', 'tertiaryies': '', 'combine_text': '{English law. See also United Kingdom:determination of intent to create legal relationship}', 'paragraphs': [7.007, 7.008]} ,
{'id': 550, 'primary': 'Formation of contract', 'secondaryies': 'information request', 'tertiaryies': '', 'combine_text': '{Formation of contract:information request}', 'paragraphs': [4.02, 4.021, 4.022]} ,
{'id': 552, 'primary': 'Formation of contract', 'secondaryies': 'overview', 'tertiaryies': '', 'combine_text': '{Formation of contract:overview}', 'paragraphs': [4.001, 4.002, 4.003, 4.004, 4.005, 4.006, 4.008, 4.009, 4.01, 4.011, 4.012, 4.013, 4.123, 4.124, 4.126, 4.127]} ,
{'id': 554, 'primary': 'Formation of contract', 'secondaryies': 'reform', 'tertiaryies': 'necessity', 'combine_text': '{Formation of contract:reform:necessity}', 'paragraphs': [4.124]} ,
{'id': 555, 'primary': 'Formation of contract', 'secondaryies': 'reform', 'tertiaryies': 'reason', 'combine_text': '{Formation of contract:reform:reason}', 'paragraphs': [4.125]} ,
{'id': 620, 'primary': 'Intention to create legal relationship', 'secondaryies': 'businesses', 'tertiaryies': '', 'combine_text': '{Intention to create legal relationship:businesses}', 'paragraphs': [7.006]} ,
{'id': 622, 'primary': 'Intention to create legal relationship', 'secondaryies': 'closely proximate relationship', 'tertiaryies': '', 'combine_text': '{Intention to create legal relationship:closely proximate relationship}', 'paragraphs': [7.01]} ,
{'id': 623, 'primary': 'Intention to create legal relationship', 'secondaryies': 'commercial agreements', 'tertiaryies': 'case example (UK)', 'combine_text': '{Intention to create legal relationship:commercial agreements:case example (UK)}', 'paragraphs': [7.022, 7.023, 7.024, 7.025, 7.026, 7.027, 7.029, 7.03, 7.031, 7.032, 7.033, 7.034, 7.026, 7.027]} ,
{'id': 624, 'primary': 'Intention to create legal relationship', 'secondaryies': 'commercial agreements', 'tertiaryies': 'industry', 'combine_text': '{Intention to create legal relationship:commercial agreements:industry}', 'paragraphs': [7.022, 7.023, 7.024, 7.025, 7.026, 7.027, 7.029, 7.03, 7.031, 7.032, 7.033, 7.034, 7.031]} ,
{'id': 625, 'primary': 'Invitation to treat', 'secondaryies': 'common categories', 'tertiaryies': 'advertisements', 'combine_text': '{Invitation to treat:common categories:advertisements}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.029, 4.03, 4.031, 4.032, 4.028]} ,
{'id': 626, 'primary': 'Invitation to treat', 'secondaryies': 'common categories', 'tertiaryies': 'auctions', 'combine_text': '{Invitation to treat:common categories:auctions}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.033, 4.034, 4.036, 4.028]} ,
{'id': 627, 'primary': 'Invitation to treat', 'secondaryies': 'common categories', 'tertiaryies': 'options', 'combine_text': '{Invitation to treat:common categories:options}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.039, 4.04, 4.041, 4.042, 4.028]} ,
{'id': 628, 'primary': 'Invitation to treat', 'secondaryies': 'common categories', 'tertiaryies': 'tenders', 'combine_text': '{Invitation to treat:common categories:tenders}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.028, 4.037, 4.038]} ,
{'id': 629, 'primary': 'Invitation to treat', 'secondaryies': 'definition', 'tertiaryies': 'Contracts Act 1950 not providing', 'combine_text': '{Invitation to treat:definition:Contracts Act 1950 not providing}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.023, 4.024]} ,
{'id': 630, 'primary': 'Invitation to treat', 'secondaryies': 'presumption and challenge', 'tertiaryies': 'case example', 'combine_text': '{Invitation to treat:presumption and challenge:case example}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.026, 4.027]} ,
{'id': 631, 'primary': 'Invitation to treat', 'secondaryies': 'reasons for making', 'tertiaryies': '', 'combine_text': '{Invitation to treat:reasons for making}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.025]} ,
{'id': 632, 'primary': 'Invitation to treat', 'secondaryies': 'statement as', 'tertiaryies': '', 'combine_text': '{Invitation to treat:statement as}', 'paragraphs': [4.023, 4.024, 4.025, 4.026, 4.027, 4.019, 4.024]} ,
{'id': 721, 'primary': 'Legal relationship', 'secondaryies': 'legal recognition of relationship', 'tertiaryies': 'agreement void without', 'combine_text': '{Legal relationship:legal recognition of relationship:agreement void without}', 'paragraphs': [7.003, 7.004]} ,
{'id': 722, 'primary': 'Legal relationship', 'secondaryies': 'meaning', 'tertiaryies': '', 'combine_text': '{Legal relationship:meaning}', 'paragraphs': [7.002]} ,
{'id': 773, 'primary': 'Mental disorder', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'caution', 'combine_text': '{Mental disorder:capacity to contract of persons of unsound mind:caution}', 'paragraphs': [7.045, 7.048]} ,
{'id': 774, 'primary': 'Mental disorder', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'sound mind', 'combine_text': '{Mental disorder:capacity to contract of persons of unsound mind:sound mind}', 'paragraphs': [7.045, 7.047, 7.045]} ,
{'id': 775, 'primary': 'Mental disorder', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'unsound mind contracting during lucidity', 'combine_text': '{Mental disorder:capacity to contract of persons of unsound mind:unsound mind contracting during lucidity}', 'paragraphs': [7.045, 7.049, 7.05]} ,
{'id': 776, 'primary': 'Mental disorder', 'secondaryies': 'revocation of proposal due to proposer’s mental disorder', 'tertiaryies': '', 'combine_text': '{Mental disorder:revocation of proposal due to proposer’s mental disorder}', 'paragraphs': [4.109]} ,
{'id': 788, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'adults contracting with', 'combine_text': '{Minors:capacity to contract:adults contracting with}', 'paragraphs': [7.037, 7.038, 7.041]} ,
{'id': 789, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'case example', 'combine_text': '{Minors:capacity to contract:case example}', 'paragraphs': [7.037, 7.039, 7.041]} ,
{'id': 790, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'determination of minority', 'combine_text': '{Minors:capacity to contract:determination of minority}', 'paragraphs': [7.037, 7.04, 7.041]} ,
{'id': 791, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'employment contracts', 'combine_text': '{Minors:capacity to contract:employment contracts}', 'paragraphs': [7.037, 7.041, 7.0425, 7.043]} ,
{'id': 792, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'exceptions to inability to contract', 'combine_text': '{Minors:capacity to contract:exceptions to inability to contract}', 'paragraphs': [7.037, 7.041, 7.042]} ,
{'id': 793, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'legal protection', 'combine_text': '{Minors:capacity to contract:legal protection}', 'paragraphs': [7.037, 7.038, 7.041]} ,
{'id': 794, 'primary': 'Minors', 'secondaryies': 'capacity to contract', 'tertiaryies': 'scholarship contracts', 'combine_text': '{Minors:capacity to contract:scholarship contracts}', 'paragraphs': [7.037, 7.041, 7.044]} ,
{'id': 883, 'primary': 'Notice', 'secondaryies': 'proposal revocation', 'tertiaryies': '', 'combine_text': '{Notice:proposal revocation}', 'paragraphs': [4.091, 4.092, 4.093, 4.094, 4.095, 4.097, 4.098, 4.099, 4.1, 4.101]} ,
{'id': 884, 'primary': 'Options', 'secondaryies': 'invitations to treat', 'tertiaryies': '', 'combine_text': '{Options:invitations to treat}', 'paragraphs': [4.039]} ,
{'id': 885, 'primary': 'Options', 'secondaryies': 'Low Kar Yit v Mohamed Isa', 'tertiaryies': '', 'combine_text': '{Options:Low Kar Yit v Mohamed Isa}', 'paragraphs': [4.04, 4.042]} ,
{'id': 886, 'primary': 'Oral contracts', 'secondaryies': 'acceptance case example', 'tertiaryies': 'evidence', 'combine_text': '{Oral contracts:acceptance case example:evidence}', 'paragraphs': [4.057, 4.058]} ,
{'id': 960, 'primary': 'Past consideration', 'secondaryies': 'common law', 'tertiaryies': '', 'combine_text': '{Past consideration:common law}', 'paragraphs': [5.031]} ,
{'id': 985, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'Australia', 'tertiaryies': '1980s arrival and early use', 'combine_text': '{Promissory estoppel. See also Consideration:Australia:1980s arrival and early use}', 'paragraphs': [6.024]} ,
{'id': 986, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'Australia', 'tertiaryies': 'landmark judicial decision', 'combine_text': '{Promissory estoppel. See also Consideration:Australia:landmark judicial decision}', 'paragraphs': [6.025, 6.028]} ,
{'id': 987, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'Australia', 'tertiaryies': 'parties’ pre-existing contractual relationship requirement obviated', 'combine_text': '{Promissory estoppel. See also Consideration:Australia:parties’ pre-existing contractual relationship requirement obviated}', 'paragraphs': [6.027]} ,
{'id': 988, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'Australia', 'tertiaryies': '“shield” not “sword” requirement overturned', 'combine_text': '{Promissory estoppel. See also Consideration:Australia:“shield” not “sword” requirement overturned}', 'paragraphs': [6.026]} ,
{'id': 989, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'England', 'tertiaryies': 'consideration', 'combine_text': '{Promissory estoppel. See also Consideration:England:consideration}', 'paragraphs': [6.018]} ,
{'id': 990, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'England', 'tertiaryies': 'later liberal approach', 'combine_text': '{Promissory estoppel. See also Consideration:England:later liberal approach}', 'paragraphs': [6.02, 6.021, 6.019]} ,
{'id': 991, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'England', 'tertiaryies': 'promissory estoppel requirements', 'combine_text': '{Promissory estoppel. See also Consideration:England:promissory estoppel requirements}', 'paragraphs': [6.022, 6.023]} ,
{'id': 992, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'England', 'tertiaryies': 'tradition and reluctance', 'combine_text': '{Promissory estoppel. See also Consideration:England:tradition and reluctance}', 'paragraphs': [6.018]} ,
{'id': 993, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'evolution and usefulness', 'tertiaryies': '', 'combine_text': '{Promissory estoppel. See also Consideration:evolution and usefulness}', 'paragraphs': [6.047, 6.048]} ,
{'id': 994, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'High Trees case', 'tertiaryies': '', 'combine_text': '{Promissory estoppel. See also Consideration:High Trees case}', 'paragraphs': [6.005, 6.006, 6.007, 6.008, 6.009]} ,
{'id': 995, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'limitations', 'tertiaryies': 'party’s contractual rights suspended', 'combine_text': '{Promissory estoppel. See also Consideration:limitations:party’s contractual rights suspended}', 'paragraphs': [6.01, 6.016]} ,
{'id': 996, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'limitations', 'tertiaryies': 'pre-existing contractual relationship required', 'combine_text': '{Promissory estoppel. See also Consideration:limitations:pre-existing contractual relationship required}', 'paragraphs': [6.01, 6.013]} ,
{'id': 997, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'limitations', 'tertiaryies': 'representation or promise', 'combine_text': '{Promissory estoppel. See also Consideration:limitations:representation or promise}', 'paragraphs': [6.01]} ,
{'id': 998, 'primary': 'Promissory estoppel. See also Consideration', 'secondaryies': 'limitations', 'tertiaryies': 'requirement obviated', 'combine_text': '{Promissory estoppel. See also Consideration:limitations:requirement obviated}', 'paragraphs': [6.032, 6.033, 6.01, 6.027]} ,
{'id': 1005, 'primary': 'Proposal', 'secondaryies': 'communication of', 'tertiaryies': 'acceptance motive', 'combine_text': '{Proposal:communication of:acceptance motive}', 'paragraphs': [4.046, 4.047, 4.049, 4.05, 4.051, 4.051]} ,
{'id': 1006, 'primary': 'Proposal', 'secondaryies': 'communication of', 'tertiaryies': 'case example', 'combine_text': '{Proposal:communication of:case example}', 'paragraphs': [4.046, 4.047, 4.049, 4.05, 4.051, 4.049]} ,
{'id': 1007, 'primary': 'Proposal', 'secondaryies': 'communication of', 'tertiaryies': 'effect', 'combine_text': '{Proposal:communication of:effect}', 'paragraphs': [4.046, 4.047, 4.049, 4.05, 4.051, 4.048]} ,
{'id': 1008, 'primary': 'Proposal', 'secondaryies': 'communication of', 'tertiaryies': 'knowledge of proposee required', 'combine_text': '{Proposal:communication of:knowledge of proposee required}', 'paragraphs': [4.046, 4.047, 4.049, 4.05, 4.051, 4.047, 4.05]} ,
{'id': 1009, 'primary': 'Proposal', 'secondaryies': 'communication of', 'tertiaryies': 'means of communication', 'combine_text': '{Proposal:communication of:means of communication}', 'paragraphs': [4.046, 4.047, 4.049, 4.05, 4.051, 4.046]} ,
{'id': 1010, 'primary': 'Proposal', 'secondaryies': 'Contracts Act 1950 s 2(a)', 'tertiaryies': '', 'combine_text': '{Proposal:Contracts Act 1950 s 2(a)}', 'paragraphs': [4.014]} ,
{'id': 1011, 'primary': 'Proposal', 'secondaryies': 'counter offers', 'tertiaryies': 'case examples', 'combine_text': '{Proposal:counter offers:case examples}', 'paragraphs': [4.114, 4.115]} ,
{'id': 1012, 'primary': 'Proposal', 'secondaryies': 'counter offers', 'tertiaryies': 'modification of initial proposal by proposee', 'combine_text': '{Proposal:counter offers:modification of initial proposal by proposee}', 'paragraphs': [4.112, 4.113]} ,
{'id': 1013, 'primary': 'Proposal', 'secondaryies': 'counter offers', 'tertiaryies': 'negotiations', 'combine_text': '{Proposal:counter offers:negotiations}', 'paragraphs': [4.116]} ,
{'id': 1014, 'primary': 'Proposal', 'secondaryies': 'counter offers', 'tertiaryies': 'revocation', 'combine_text': '{Proposal:counter offers:revocation}', 'paragraphs': [4.112]} ,
{'id': 1015, 'primary': 'Proposal', 'secondaryies': 'examples of analysis of existence', 'tertiaryies': '', 'combine_text': '{Proposal:examples of analysis of existence}', 'paragraphs': [4.006, 4.007]} ,
{'id': 1016, 'primary': 'Proposal', 'secondaryies': 'expression', 'tertiaryies': '', 'combine_text': '{Proposal:expression}', 'paragraphs': [4.015]} ,
{'id': 1017, 'primary': 'Proposal', 'secondaryies': 'information request', 'tertiaryies': 'case examples', 'combine_text': '{Proposal:information request:case examples}', 'paragraphs': [4.021, 4.022]} ,
{'id': 1018, 'primary': 'Proposal', 'secondaryies': 'information request', 'tertiaryies': 'meaning', 'combine_text': '{Proposal:information request:meaning}', 'paragraphs': [4.02]} ,
{'id': 1019, 'primary': 'Proposal', 'secondaryies': 'intention to create binding agreement', 'tertiaryies': '', 'combine_text': '{Proposal:intention to create binding agreement}', 'paragraphs': [4.018]} ,
{'id': 1020, 'primary': 'Proposal', 'secondaryies': 'knowledge requirement', 'tertiaryies': '', 'combine_text': '{Proposal:knowledge requirement}', 'paragraphs': [4.016]} ,
{'id': 1021, 'primary': 'Proposal', 'secondaryies': 'offer and', 'tertiaryies': '', 'combine_text': '{Proposal:offer and}', 'paragraphs': [4.015]} ,
{'id': 1022, 'primary': 'Proposal', 'secondaryies': 'reform', 'tertiaryies': 'necessity', 'combine_text': '{Proposal:reform:necessity}', 'paragraphs': [4.124]} ,
{'id': 1023, 'primary': 'Proposal', 'secondaryies': 'reform', 'tertiaryies': 'reason', 'combine_text': '{Proposal:reform:reason}', 'paragraphs': [4.125]} ,
{'id': 1024, 'primary': 'Proposal', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'case example', 'combine_text': '{Proposal:requirement to make business and economic sense:case example}', 'paragraphs': [4.043, 4.045, 4.043]} ,
{'id': 1025, 'primary': 'Proposal', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'effect of not making sense', 'combine_text': '{Proposal:requirement to make business and economic sense:effect of not making sense}', 'paragraphs': [4.043, 4.045, 4.045]} ,
{'id': 1026, 'primary': 'Proposal', 'secondaryies': 'requirement to make business and economic sense', 'tertiaryies': 'principle', 'combine_text': '{Proposal:requirement to make business and economic sense:principle}', 'paragraphs': [4.043, 4.045, 4.044]} ,
{'id': 1028, 'primary': 'Proposal', 'secondaryies': 'statement as invitation to treat', 'tertiaryies': '', 'combine_text': '{Proposal:statement as invitation to treat}', 'paragraphs': [4.019]} ,
{'id': 1029, 'primary': 'Proposal', 'secondaryies': 'statement to be expression', 'tertiaryies': '', 'combine_text': '{Proposal:statement to be expression}', 'paragraphs': [4.015]} ,
{'id': 1030, 'primary': 'Proposal', 'secondaryies': 'termination at common law. See also Proposal revocation', 'tertiaryies': 'counter offers', 'combine_text': '{Proposal:termination at common law. See also Proposal revocation:counter offers}', 'paragraphs': [4.112, 4.113, 4.115, 4.116]} ,
{'id': 1031, 'primary': 'Proposal', 'secondaryies': 'test for', 'tertiaryies': 'case examples', 'combine_text': '{Proposal:test for:case examples}', 'paragraphs': [4.008, 4.009, 4.01]} ,
{'id': 1032, 'primary': 'Proposal', 'secondaryies': 'willingness to contract', 'tertiaryies': '', 'combine_text': '{Proposal:willingness to contract}', 'paragraphs': [4.017]} ,
{'id': 1033, 'primary': 'Proposal revocation', 'secondaryies': 'common law', 'tertiaryies': 'English cases', 'combine_text': '{Proposal revocation:common law:English cases}', 'paragraphs': [4.087, 4.093, 4.094, 4.095, 4.097]} ,
{'id': 1034, 'primary': 'Proposal revocation', 'secondaryies': 'communication', 'tertiaryies': 'third party', 'combine_text': '{Proposal revocation:communication:third party}', 'paragraphs': [4.087, 4.091, 4.096, 4.099, 4.1]} ,
{'id': 1075, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'acceptor’s advantages', 'combine_text': '{Revocation:acceptance:acceptor’s advantages}', 'paragraphs': [4.117, 4.119]} ,
{'id': 1076, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'communication', 'combine_text': '{Revocation:acceptance:communication}', 'paragraphs': [4.117, 4.118]} ,
{'id': 1077, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'Contracts Act 1950 s 3', 'combine_text': '{Revocation:acceptance:Contracts Act 1950 s 3}', 'paragraphs': [4.117, 4.121]} ,
{'id': 1078, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'environment for judicial creativity', 'combine_text': '{Revocation:acceptance:environment for judicial creativity}', 'paragraphs': [4.117, 4.122]} ,
{'id': 1079, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'general rule', 'combine_text': '{Revocation:acceptance:general rule}', 'paragraphs': [4.099, 4.117]} ,
{'id': 1080, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'postal acceptance', 'combine_text': '{Revocation:acceptance:postal acceptance}', 'paragraphs': [4.117, 4.12]} ,
{'id': 1081, 'primary': 'Revocation', 'secondaryies': 'acceptance', 'tertiaryies': 'timing', 'combine_text': '{Revocation:acceptance:timing}', 'paragraphs': [4.117, 4.118, 4.12]} ,
{'id': 1109, 'primary': 'Sound mind', 'secondaryies': 'Contracts Act 1950', 'tertiaryies': '', 'combine_text': '{Sound mind:Contracts Act 1950}', 'paragraphs': [7.045, 7.046]} ,
{'id': 1110, 'primary': 'Sound mind', 'secondaryies': 'definition', 'tertiaryies': '', 'combine_text': '{Sound mind:definition}', 'paragraphs': [7.045]} ,
{'id': 1111, 'primary': 'Sound mind', 'secondaryies': 'evidence requirement', 'tertiaryies': '', 'combine_text': '{Sound mind:evidence requirement}', 'paragraphs': [7.047]} ,
{'id': 1112, 'primary': 'Sound mind', 'secondaryies': 'unsound mind contracting while sound', 'tertiaryies': '', 'combine_text': '{Sound mind:unsound mind contracting while sound}', 'paragraphs': [7.05]} ,
{'id': 1142, 'primary': 'Tenders', 'secondaryies': 'case examples', 'tertiaryies': '', 'combine_text': '{Tenders:case examples}', 'paragraphs': [4.037, 4.038]} ,
{'id': 1143, 'primary': 'Tenders', 'secondaryies': 'invitations to treat', 'tertiaryies': '', 'combine_text': '{Tenders:invitations to treat}', 'paragraphs': [4.037]} ,
{'id': 1144, 'primary': 'Tenders', 'secondaryies': 'response to', 'tertiaryies': '', 'combine_text': '{Tenders:response to}', 'paragraphs': [4.037]} ,
{'id': 1152, 'primary': 'Terms of contract', 'secondaryies': 'determination by court', 'tertiaryies': '', 'combine_text': '{Terms of contract:determination by court}', 'paragraphs': [4.005]} ,
{'id': 1212, 'primary': 'United Kingdom. See also English law', 'secondaryies': 'promissory estoppel limits stretched', 'tertiaryies': '', 'combine_text': '{United Kingdom. See also English law:promissory estoppel limits stretched}', 'paragraphs': [6.018, 6.019, 6.021, 6.022, 6.023]} ,
{'id': 1213, 'primary': 'United Kingdom. See also English law', 'secondaryies': 'proposal revocation at common law', 'tertiaryies': '', 'combine_text': '{United Kingdom. See also English law:proposal revocation at common law}', 'paragraphs': [4.094, 4.095]} ,
{'id': 1221, 'primary': 'Unsound mind', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'caution', 'combine_text': '{Unsound mind:capacity to contract of persons of unsound mind:caution}', 'paragraphs': [7.045, 7.048]} ,
{'id': 1222, 'primary': 'Unsound mind', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'sound mind', 'combine_text': '{Unsound mind:capacity to contract of persons of unsound mind:sound mind}', 'paragraphs': [7.045, 7.047, 7.045]} ,
{'id': 1223, 'primary': 'Unsound mind', 'secondaryies': 'capacity to contract of persons of unsound mind', 'tertiaryies': 'unsound mind contracting during lucidity', 'combine_text': '{Unsound mind:capacity to contract of persons of unsound mind:unsound mind contracting during lucidity}', 'paragraphs': [7.045, 7.049, 7.05]} ,
{'id': 1224, 'primary': 'Unsound mind', 'secondaryies': 'revocation of proposal due to proposer’s mental disorder', 'tertiaryies': '', 'combine_text': '{Unsound mind:revocation of proposal due to proposer’s mental disorder}', 'paragraphs': [4.109]} ,
{'id': 1260, 'primary': 'Words and phrases', 'secondaryies': 'auction', 'tertiaryies': '', 'combine_text': '{Words and phrases:auction}', 'paragraphs': [4.033]} ,
{'id': 1268, 'primary': 'Words and phrases', 'secondaryies': 'consideration', 'tertiaryies': '', 'combine_text': '{Words and phrases:consideration}', 'paragraphs': [5.004, 5.005, 5.006, 5.007, 5.008, 5.009]} ,
{'id': 1281, 'primary': 'Words and phrases', 'secondaryies': 'invitation to treat', 'tertiaryies': '', 'combine_text': '{Words and phrases:invitation to treat}', 'paragraphs': [4.024]} ,
{'id': 1285, 'primary': 'Words and phrases', 'secondaryies': 'offer', 'tertiaryies': '', 'combine_text': '{Words and phrases:offer}', 'paragraphs': [4.014]} ,
{'id': 1294, 'primary': 'Words and phrases', 'secondaryies': 'sale by auction', 'tertiaryies': '', 'combine_text': '{Words and phrases:sale by auction}', 'paragraphs': [4.034]} ,
{'id': 1296, 'primary': 'Words and phrases', 'secondaryies': 'sound mind', 'tertiaryies': '', 'combine_text': '{Words and phrases:sound mind}', 'paragraphs': [7.045]}
    ];

    displayLegalConcepts(legalConcepts);
}

// assign legal concept rows of data to legal concepts table html.
function displayLegalConcepts(legalConcepts) {
    var table = document.getElementById("legalConceptTable");

    $.each(legalConcepts, function (index, value) {
        table.innerHTML +=
            ('<tr>\n' +
                   '<td>' + value.id + '</td>\n' +
                '<td>' + value.primary + '</td>\n' +
                '<td>' + value.secondaryies + '</td>\n' +
                '<td>' + value.tertiaryies + '</td>\n' +
                '<td>' + value.combine_text + '</td>\n' +
                '<td>' + value.paragraphs + '</td>\n' +
                '</tr>');
    });
}