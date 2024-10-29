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
// function fillFactsTable(originalFacts, rewrittenFacts) {
//     var factTableBody = document.getElementById("factTableBody");
//     factTableBody.innerHTML = ""; // Clear existing rows
//     originalFacts.forEach(function(fact, index) {
//         var row = factTableBody.insertRow();
//         var cell1 = row.insertCell(0);
//         var cell2 = row.insertCell(1);
//         var cell3 = row.insertCell(2);
//         cell1.innerHTML = index + 1;
//         cell2.innerHTML = fact;
//         cell3.innerHTML = rewrittenFacts[index] || "No rewritten fact available";
//     });
// }



// Export facts to a local file
// function exportFacts() {
//     var data = sceList.map(scenario => {
//         var originalFacts = scenario.OriginalFacts;
//         var rewrittenFacts = originalFacts.map((_, index) => document.getElementById(`rewriteFact${index}`).value.trim());
//         return {
//             ID: scenario.ID,
//             Scenario: scenario.Scenario,
//             OriginalFacts: originalFacts,
//             RewrittenFacts: rewrittenFacts
//         };
//     });
//     var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4));
//     var downloadAnchorNode = document.createElement('a');
//     downloadAnchorNode.setAttribute("href", dataStr);
//     downloadAnchorNode.setAttribute("download", "exported_facts.json");
//     document.body.appendChild(downloadAnchorNode); // Required for Firefox
//     downloadAnchorNode.click();
//     downloadAnchorNode.remove();
// }

// document.getElementById('exportButton').addEventListener('click', exportFacts);
 // Initialize on page load
 document.addEventListener('DOMContentLoaded', init);



