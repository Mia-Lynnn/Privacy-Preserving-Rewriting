// Scenario list variable.
var sceList= [];

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
    createReasonButtons();
    getExampleData()

}

function getSceData(){
     $.getJSON('./data/data.json', function(data) {
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
}

var scenarioID =''
function getExampleData(){
    $.getJSON('./data/example2.json',function(data){
    drawData(data);







    });

}



// The the list of scenarios available in the database.
function getScenarioList() {
    // get all declared scenarios.

    var scenarioSelect = document.getElementById("scenarioSelect");
    console.log(sceList);

    $.each(sceList, function (index, value) {
        //console.log("valud ID ",value.ID);
        scenarioSelect.innerHTML +=
            ('<option value="' + value.ID + '">' + value.ID + '</option>\n');

    });

    //console.log(sceList);
}

// get scenario based on id.
function getScenario(data) {
    const scenarioSelect = document.getElementById('scenarioSelect');

    console.log(data)
    let selectedId = data.ScenarioID;

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
    //console.log('User name : ', inputTest)
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



    function getSceData(){
     $.getJSON('./data/data.json', function(data) {
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
}



    // Display file content
    function drawData(data) {
        data_json = data;
        console.log(data_json);

        // Reset important variables to default.

        // Reset courtCases view.
        for (let i = 1; i <= currentCourtCaseCount; i++) {
            // Do not allow remove if currentCourtCaseCount is 1.
            // There must always be one court case available.
            if (i != 1) {
                // Get court case id to remove based on global current court case count.
                let courtCaseId = 'courtCase_' + i;

                // Remove target court case.
                var elem = document.getElementById(courtCaseId);
                elem.parentNode.removeChild(elem);
            }
        }

        // Reset court cases count.
        currentCourtCaseCount = 1;

        // End reset important variables to default.

        let scenarioID = data_json.ScenarioID;
        //console.log(data_json.ScenarioID);
        $.each(sceList, function (index, value) {
            if (value.ID == scenarioID) {
                changeScenarioText(value);
            }
        });
        document.getElementById("scenarioSelect").value = scenarioID;

        //add tags and relations
        let object = data_json.Original_Objects;

        // Set the annotations list.
        r.setAnnotations(object);

        // Update the annotation buttons.
        updateAnnotationButtons(object);

        let issues = data_json.Issues;
        document.getElementById("issues").value = issues;

        let decomQues = data_json.DecomQues;
        document.getElementById("decompositions").value = decomQues;

        let sections = data_json.Sections;
        console.log(sections);
        restoreRelatedSectionsBtn(sections);

        // Handle multiple court cases.
        let courtCases = data_json.RelatedCourtCase_pageNumList;
        console.log(courtCases);

        let courtCasesCount = courtCases.length;
        // get view element.
        let courtCaseView = document.getElementById("courtCaseView");

        // Insert input fields.
        for (let i = 1; i <= courtCasesCount; i++) {
            // Skip insert if its 1 since it already exists.
            if (i != 1) {
                // Insert a new court case block into innerHTML of courtCaseView.
                let newCourtCaseInput = document.createElement('span');
                newCourtCaseInput.innerHTML =
                    ('<div class="row" id="courtCase_' + i + '" style="margin-bottom: 10px;">'
                        + '<div class="col-sm-2">'
                        + '<label class="col-form-label">#' + i + '</label>'
                        + '</div>'
                        + '<div class="col-sm-4">'
                        + '<input type="text" class="form-control" id="relatedCourtCase_' + i + '">'
                        + '</div>'
                        + '<div class="col-sm-4">'
                        + '<input type="text" class="form-control" id="courtCase_Num_' + i + '">'
                        + '</div>'
                        + '<div class="col-sm-2">'
                        + '</div>'
                        + '</div>');
                courtCaseView.appendChild(newCourtCaseInput);
            }
        }

        function splitLastOccurrence(str, substring) {
            const lastIndex = str.lastIndexOf(substring);

            const before = str.slice(0, lastIndex);

            const after = str.slice(lastIndex + 1);

            return [before, after];
        }

        // Insert each value respectively.
        for (let i = 1; i <= courtCasesCount; i++) {
            let relatedCourtCase = 'relatedCourtCase_' + i;
            let courtCaseNum = 'courtCase_Num_' + i;

            let tmp = JSON.stringify(courtCases[i - 1]);

            let [courtCaseValue, courtCasePgNum] = splitLastOccurrence(tmp, '[');

            // Set court case value.
            document.getElementById(relatedCourtCase).value = courtCaseValue.replace('"', '');

            // Set pg number value.
            let num = courtCasePgNum.replace('[', '');
            num = num.replace(']', '');
            num = num.replace('"', '');
            document.getElementById(courtCaseNum).value = num;
        }

        // Set current court case count to the uploaded file court case count.
        currentCourtCaseCount = courtCasesCount;

        // Generate the court case page number buttons.
        generateCourtCasePageNumberBtn();

        anlysis = data_json.Analysis;
        document.getElementById("analysisTextArea").value = anlysis;

        conclusion = data_json.Conclusion;
        document.getElementById("conclusion").value = conclusion;
    }

// Change the scenario text based on retrieved scenario text from db.
function changeScenarioText(scenario) {
    var scenarioText = document.getElementById("ScenarioText");
    scenarioText.innerHTML = scenario.Scenario;
}

function updateAnnotationButtons(annotations) {
    $.each(annotations, function (index, annotation) {
        highlightedObject.push(annotation);

        if (annotation.motivation == null && annotation.motivation != 'linking') {
            selectedAnnotation.push({ selectedText: annotation.target.selector[0].exact, selectedTag: annotation.body[0].value });
            // On created annotation add a button with selected text for IRAC Analysis processing.
            var selectedAnnotationText = '{' + annotation.target.selector[0].exact + '[' + annotation.body[0].value + ']}';

            var annotationBtnDiv = document.getElementById('annotationBtns');

            // Create button element.
            var button = document.createElement('button');

            button.type = 'button';
            button.className = 'btn btn-outline-info';

            // Id will be the selectedAnnotationText + 'Btn'.
            // Ex.Selected legal => The button id is 'legalBtn'.
            // It is case senstive and also will take in spaces.
            button.id = selectedAnnotationText + 'Btn';

            // Save to a list of existing annotation buttons.
            annotationBtnIds.push(button.id);

            // Add text to be displayed on button.
            button.innerHTML = selectedAnnotationText;

            // Add onClick event to add the selected annotation to analysis text area at the cursor.
            button.addEventListener('click', function (event) {
                console.log(button.innerHTML);

                // Get current position of cursor at analysis text area.
                // If no cursor, it will append at the end of the textArea's text.
                var analysisTxtBox = document.getElementById('analysisTextArea');
                let curPos = analysisTxtBox.selectionStart;

                // Get current text in analysisTextArea.
                var analysisTextAreaValue = $('#analysisTextArea').val();

                // Insert text at cursor position.
                $('#analysisTextArea').val(
                    analysisTextAreaValue.slice(0, curPos) + selectedAnnotationText + analysisTextAreaValue.slice(curPos));

                // Restore cursor position to end of analysis text area after clicking on button.
                analysisTextArea.focus();
            });

            // Append the  button to annotation div.
            annotationBtnDiv.appendChild(button);
        }
        else {
            //capture relation tagging

            var relation = annotation.body[0].value;
            var target1 = annotation.target[0].id;
            var target2 = annotation.target[1].id;

            var object1 = highlightedObject.find(obj => obj.id === target1);
            word1 = object1.target.selector[0].exact + '[' + object1.body[0].value + ']';

            var object2 = highlightedObject.find(obj => obj.id === target2);
            word2 = object2.target.selector[0].exact + '[' + object2.body[0].value + ']';

            var finalRelation = ' {(' + word1 + ')' + ' (' + relation + ') ' + '(' + word2 + ')} ';

            //console.log(finalRelation);

            var annotationBtnDiv = document.getElementById('annotationBtnsRelations');

            // Create button element.
            var button = document.createElement('button');

            button.type = 'button';
            button.className = 'btn btn-outline-success';

            // Id will be the selectedAnnotationText + 'Btn'.
            // Ex.Selected legal => The button id is 'legalBtn'.
            // It is case senstive and also will take in spaces.
            button.id = finalRelation + 'Btn';

            // Save to a list of existing annotation buttons.
            annotationBtnIds.push(button.id);

            // Add text to be displayed on button.
            button.innerHTML = finalRelation;

            // Add onClick event to add the selected annotation to analysis text area at the cursor.
            button.addEventListener('click', function (event) {
                console.log(button.innerHTML);

                // Get current position of cursor at analysis text area.
                // If no cursor, it will append at the end of the textArea's text.
                var analysisTxtBox = document.getElementById('analysisTextArea');
                let curPos = analysisTxtBox.selectionStart;

                // Get current text in analysisTextArea.
                var analysisTextAreaValue = $('#analysisTextArea').val();

                // Insert text at cursor position.
                $('#analysisTextArea').val(
                    analysisTextAreaValue.slice(0, curPos) + finalRelation + analysisTextAreaValue.slice(curPos));

                // Restore cursor position to end of analysis text area after clicking on button.
                analysisTextArea.focus();
            });

            // Append the  button to annotation div.
            annotationBtnDiv.appendChild(button);
        };
    });
}

// Function to restore related sections selected options and button.
// Will replace the existing buttons if any.
function restoreRelatedSectionsBtn(sections) {
    // remove existing court case page number button id if not null.
    if (relatedSectionBtnIds.length > 0) {
        $.each(relatedSectionBtnIds, function (index, value) {
            var elem = document.getElementById(value);
            elem.parentNode.removeChild(elem);
        });
    }

    // Restore options selected in the view from file.
    let select = document.getElementById("selectedSections");

    $.each(sections, function (index, value) {
        for (i = 0; i < select.options.length; i += 1) {
            if (select.options[i].value === value) {
                select.options[i].selected = true;
            }
        }
    });

    // Refresh view after setting values to true.
    $('#selectedSections').multiselect('refresh');

    // Run check for button.
    checkDisabledRS();

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