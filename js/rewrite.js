// Scenario list variable
var sceList = [];

// function that runs all necessary initial retrieval.
function init() {
    // Get data from JSON file
    fetch('./data/facts.json')
        .then(response => response.json())
        .then(data => {
            sceList = data;
            fillScenarioDropdown();
        })
        .catch(error => console.error('Error loading the facts data:', error));
}

// Fill the scenario dropdown
function fillScenarioDropdown() {
    var scenarioSelect = document.getElementById("scenarioSelect");
    sceList.forEach(function(scenario, index) {
        var option = document.createElement("option");
        option.value = scenario.ID;
        option.text = scenario.ID;
        scenarioSelect.appendChild(option);
    });
}

// Called when a scenario is selected
function getScenario() {
    var scenarioSelect = document.getElementById('scenarioSelect');
    var selectedId = scenarioSelect.value;
    displayScenarioAndFacts(selectedId);
}

// Display the scenario and its corresponding facts
function displayScenarioAndFacts(scenarioId) {
    var scenario = sceList.find(s => s.ID === scenarioId);
    if (scenario) {
        document.getElementById("ScenarioText").textContent = scenario.Scenario;
        fillFactsTable(scenario.OriginalFacts, scenario.RewrittenFacts);
    } else {
        document.getElementById("ScenarioText").textContent = "Scenario not found";
        fillFactsTable([], []);
    }
}

// Fill the facts table with original and rewritten facts
function fillFactsTable(originalFacts, rewrittenFacts) {
    var factTableBody = document.getElementById("factTableBody");
    factTableBody.innerHTML = ""; // Clear existing rows
    originalFacts.forEach(function(fact, index) {
        var row = factTableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = index + 1;
        cell2.innerHTML = fact;
        cell3.innerHTML = `<textarea class="form-control" id="rewriteFact${index}">${rewrittenFacts[index] || ""}</textarea>`; // Make the rewritten facts editable
    });
}


function exportFacts() {
    // Get the selected scenario ID
    var scenarioSelect = document.getElementById('scenarioSelect');
    var selectedId = scenarioSelect.value;
    var scenario = sceList.find(s => s.ID === selectedId);

    if (scenario) {
        // Collect the data
        var ScenarioID = scenario.ID;
        var ScenarioText = scenario.Scenario;
        var OriginalFacts = scenario.OriginalFacts;
        var RewrittenFacts = [];

        // Loop through the facts and collect rewritten facts
        OriginalFacts.forEach(function(originalFact, index) {
            var rewrittenFactElement = document.getElementById(`rewriteFact${index}`);
            var rewrittenFact = rewrittenFactElement ? rewrittenFactElement.value.trim() : "";
            RewrittenFacts.push(rewrittenFact);
        });

        // Prepare the data object
        var data_json = {
            "ScenarioID": ScenarioID,
            "Scenario": ScenarioText,
            "OriginalFacts": OriginalFacts,
            "RewrittenFacts": RewrittenFacts
        };

        var data = JSON.stringify(data_json);

        // Prepare filename with timestamp
        var currentdate = new Date();
        var date = currentdate.getDate() + "_" + (currentdate.getMonth() + 1) + "_" +
            currentdate.getHours() + currentdate.getMinutes();
        var filename = 'ExportedFacts_' + ScenarioID + '_' + date + '.json';

        // Create a Blob and initiate download
        let blob = new Blob([data], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
        let file = document.createElement('a');
        file.download = filename;
        file.href = url;
        document.body.appendChild(file);
        file.click();
        file.remove();
        URL.revokeObjectURL(url);
    } else {
        alert("No scenario selected or scenario not found.");
    }
}
 document.addEventListener('DOMContentLoaded', init);



