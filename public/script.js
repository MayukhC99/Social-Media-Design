$(document).ready(function(){
    var caption = $('#caption');
    var textarea = document.getElementById('writepost');
    var theImageField = document.getElementById('theImageField');
    caption.text(caption.text().substring(0,500));

    $("#writepost").on('keyup', function(){
        textarea.style.height = "0px";
        textarea.style.height = textarea.scrollHeight + "px";
        console.log(textarea.style.height);
    })

    theImageField.onchange = function (e) {
        var theFile = e.target.files[0];

        if(customFileFilter(theFile)) {
            handleUploadedFile(theFile);
            $("#deleteimg").show();
        }

    }

    function customFileFilter(file){
        const regex= /\jpg$|\jpeg$|\png$|\gif$/

        const check_filename = regex.test(file.name);

        const check_mimetype= regex.test(file.type);
        $('#errorMessage').hide();
        $('#successMessage').hide();

        if (file.size > 1000000) {
            $('#errorMessage').show();
            $('#errorMessage').html('File too large, cannot be more than 1MB...<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            return false;
        }

        if(check_filename && check_mimetype){
            return true;
        } else {
            $('#errorMessage').show();
            $('#errorMessage').html('File type should be png or jpg/jpeg...<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            return false;
        }
    }

    function handleUploadedFile(file) {
        fileName = file.name;
        var image = document.getElementById("imgupload");
        image.file = file;
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(image);
        reader.readAsDataURL(file);
    }
})