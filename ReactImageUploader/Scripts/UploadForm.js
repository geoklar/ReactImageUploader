$("document").ready(function () {

    $('input:file').bind('change', function () {
        var ext = $(this).val().split('.').pop().toLowerCase();
        if (this.files[0].size > 50000000) {
            alert("Παρακαλώ επιλέξτε αρχείο μικρότερο των 50MB.");
            $(this).val('');
            return false;
        }
        else if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg', 'tiff']) == -1) {
            alert("Παρακαλώ επιλέξτε κάποιο αρχείο εικόνας με format 'gif', 'png', 'jpg', 'jpeg', 'tiff'.");
            $(this).val('');
            return false;
        }
        else {
            return true;
        }


    });

});