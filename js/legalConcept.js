// function that runs all necessary initial retrieval.
function init2() {
    getLegalConcepts();
}

// function to get scenario based on id.
function getLegalConcepts() {
    // remove all table rows except the first(header).
    $("#legalConceptTable").find("tr:not(:first)").remove();

    // get declared legalConcepts.
    // remember to update the same one in scenario.html script.
    const legalConcepts = [
        { id: 1, name: 'invitation to treat', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 2, name: 'Display of goods for sale', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 3, name: 'Tender documents', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 4, name: 'Price Quotation', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 5, name: 'Auction', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 6, name: 'Advertisements', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 7, name: 'Offeror', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 8, name: 'legal capacity', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 9, name: 'offeree', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 10, name: 'offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        {
            id: 11, name: 'promise', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 12, name: 'product for money', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 13, name: 'termination of offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 14, name: 'Rejection', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 15, name: 'Lapse of time', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 16, name: 'Contingent condition subsequent ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 17, name: 'Death', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 18, name: 'Revocation', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 19, name: 'Counter- Offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 20, name: 'acceptance', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 21, name: 'Cross-offer', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 22, name: 'Mere injuiry ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 23, name: 'Mode of Acceptance ', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 24, name: 'General Rule', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 25, name: 'By instantaneous communication', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 26, name: 'By conduct', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        {
            id: 27, name: 'Postal Rule', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 28, name: 'intension to create legal relations', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
        { id: 29, name: 'Social and Domestic context', relatedTopic: 'Offer and Acceptance', relatedSection: 'Section3', other: '' },
      
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
                '<td>' + value.name + '</td>\n' +
                '<td>' + value.relatedTopic + '</td>\n' +
                '<td>' + value.relatedSection + '</td>\n' +
                '<td>' + value.other + '</td>\n' +
                '</tr>');
    });
}