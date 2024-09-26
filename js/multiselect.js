
var options = [
    { text: "Arabic", selected: true, disabled: false, hidden: false },
    { text: "Belarusian", selected: true, disabled: true, hidden: true },
    { text: "Chinese", selected: true, disabled: false, hidden: false },
    { text: "Dutch", selected: true, disabled: false, hidden: false },
    { text: "English", selected: false, disabled: false, hidden: false },
    { text: "French", selected: false, disabled: false, hidden: false },
    { text: "Greek", selected: false, disabled: false, hidden: false },
    { text: "Hindi", selected: false, disabled: false, hidden: false },
    { text: "Italian", selected: false, disabled: false, hidden: false }
];

//var $management = $('#languages-hidden-id, #languages-disabled-id');
// function resetManagement(){
//     function createData(property){
//         var dataHTML = '';
//         for(var i = 0; i<options.length; i++) {
//             var o = options[i];
//             dataHTML += ('<option '+ (o[property]?"selected":"") +' value="'+ o.text +'"  data-index="'+i+'">'+ o.text +'</option>');
//         }
//         return dataHTML;
//     }
//     $('#languages-hidden-id').html(createData('hidden'));
//     $('#languages-disabled-id').html(createData('disabled'));
// }
// resetManagement();
var languages1 = null;
//var languages2 = null;
//let isLanguages2 = true;
var $languages = $('#languages1-id')
//if (isLanguages2)
//    $languages =$languages.add('#languages2-id')
var callMs = function (id, process) { return $(id).each(function (i, e) { let ms = $(e).data("DashboardCode.BsMultiSelect"); if (ms) process(ms); }) }
//var callMs = function(id, process){ let ms = getMs(id); if (ms) process(ms); }
// $management.bsMultiSelect(
//     function(e , c)
//     {
//         c.setSelected = function(eo, v) {
//             eo.selected = v;
//             var index = $(eo).data("index");

//             if (e.id == "languages-hidden-id"){
//                 options[index].hidden = v;
//                 callMs($languages, function(ms){ms.updateOptionHidden(index)})
//             } else if (e.id == "languages-disabled-id"){
//                 options[index].disabled = v;
//                 callMs($languages, function(ms){ms.updateOptionDisabled(index)})
//             }
//         }
//     }
// );



var getIsAttached = function () { return $languages.data("DashboardCode.BsMultiSelect") != null }
var disabled = false;
var disabledOptions = false;
var install = function () {
    $languages.bsMultiSelect({
        options: options,
        getDisabled: function () { return disabled },
        getIsOptionDisabled: function (o) { return o.disabled },
        getIsOptionHidden: function (o) { return o.hidden }
    });
    //if (isLanguages2){
    // $('#languages1-id').on('dashboardcode.multiselect:change', function(){
    //     $('#languages2-id').bsMultiSelect("UpdateOptionsSelected");
    // })
    // $('#languages2-id').on('dashboardcode.multiselect:change', function(){
    //     $('#languages1-id').bsMultiSelect("UpdateOptionsSelected");
    // })
    //}
}
install();
$('#btnAttach').click(
    function () {
        if (getIsAttached()) {
            $languages.bsMultiSelect("Dispose");
            $languages.unbind();
        }
        else {
            install();
        }
    }
);

$('#btnDisable').click(
    function () {
        if (getIsAttached()) {
            disabled = !disabled;
            $languages.bsMultiSelect("UpdateDisabled");
        }
    }
);

$('#btnDisableOptions').click(
    function () {
        if (getIsAttached()) {
            disabledOptions = !disabledOptions;
            $languages.bsMultiSelect("UpdateOptionsDisabled");
        }
    }
);

$('#btnRemove').click(
    function () {
        var inputValue = $("#inputValue").val();
        if (inputValue) {
            var position = -1;
            for (var i = 0; i < options.length; i++) {
                var item = options[i];
                if (item.text.toLowerCase() == inputValue.toLowerCase()) {
                    position = i;
                    break;
                }
            }

            if (position >= 0) {
                options.splice(position, 1);
                //resetManagement();
                //$management.bsMultiSelect("UpdateData");
                if (getIsAttached()) {
                    callMs('#languages1-id', function (ms) { ms.updateOptionRemoved(position) })
                    //                               callMs('#languages2-id', function(ms){ms.updateOptionRemoved(position)})
                }
            }
        }
    }
)
$('#myaction').click(
    function () {
        var x = $('#languages1-id').bsMultiSelect('GetContainer');
        console.log(x);
    }
);
$('#btnAddSelected').click(
    function () {
        console.log("add");
        var inputValue = $("#inputValue").val();
        if (inputValue) {
            var position = -1;
            for (var i = 0; i < options.length; i++) {
                var item = options[i];
                if (item.text.toLowerCase() == inputValue.toLowerCase())
                    return;
                else if (item.text.toLowerCase() > inputValue.toLowerCase())
                    break;
            }
            position = i;
            if (position >= 0) {
                options.splice(position, 0, { text: inputValue, selected: true, disabled: false, hidden: false });
                //resetManagement();
                //$management.bsMultiSelect("UpdateData");
                if (getIsAttached()) {
                    let ms = $('#languages1-id').data("DashboardCode.BsMultiSelect")
                    ms.updateOptionAdded(position);
                    //callMs('#languages1-id', function(ms){ms.updateOptionAdded(position)})
                    //callMs('#languages2-id', function(ms){ms.updateOptionAdded(position)})
                }
            }
        }
    }
);
