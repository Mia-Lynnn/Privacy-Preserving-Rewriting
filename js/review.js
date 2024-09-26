window.addEventListener('DOMContentLoaded', function (e) {
    // Get file input
    const fileInput = document.querySelector('#usersFileData');

    // Event listeners
    fileInput.addEventListener('change', handleFiles);

    // change event handler
    function handleFiles(event) {
        // Check for the various File API support.
        if (window.FileReader) {
            // get first user selected file
            const file = event.target.files[0];
            // if FileReader are supported.
            getFileData(file);
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }

    // Get file content data based on file extenation and type
    function getFileData(fileToRead) {
        const fileType = fileToRead.type.split('.').pop();
        switch (fileType) {
            case 'text/plain':
                getAsText(fileToRead);
                break;
            case 'ms-excel':
                getAsCSV(fileToRead);
                break;
            default:
                alert(`Not support this file`);
                break;
        }
    }

    // Read text file data
    function getAsText(fileToRead) {
        // init file reader object
        const reader = new FileReader();
        // reade text file
        reader.readAsText(fileToRead, 'UTF-8');
        reader.onload = function (e) {
            const txt = e.target.result;
            drawData(txt);
        };
        reader.onerror = errorHandler;
    }

    // Read CSV sheet file data
    function getAsCSV(fileToRead) {
        // init file reader object
        const reader = new FileReader();
        // reade text file
        reader.readAsText(fileToRead, 'UTF-8');
        reader.onload = function (e) {
            const csv = e.target.result;
            drawData(csv);
        };
        reader.onerror = errorHandler;
    }

    // Error handler
    function errorHandler(e) {
        if (e.target.error.name == 'NotReadableError') {
            alert(`Can't read this file`);
        }
    }

    // Display file content
    function drawData(data) {
        data_json = JSON.parse(data);
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
});

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