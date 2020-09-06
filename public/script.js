$(document).ready(function(){
    var textarea = document.getElementById('writepost');
    var theImageField = document.getElementById('theImageField');

    $("#writepost").on('keyup', function(){
        textarea.style.height = "0px";
        textarea.style.height = textarea.scrollHeight + "px";
        if(textarea.value.length >= 1){
            $("#makepost").prop('disabled', false);
        }
        if(textarea.value.length == 0){
            $("#makepost").prop('disabled', true);
        }
    })


    theImageField.onchange = function (e) {
        var theFile = e.target.files[0];

        if(customFileFilter(theFile)) {
            handleUploadedFile(theFile);
            $("#deleteimg").show();
            $("#makepost").prop('disabled', false);
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

    $("#deleteimg").on('click', function(){
        $("#postimgfield #imgupload").attr('src', '');
        $("#deleteimg").hide();
        if(textarea.value.length == 0){
            $("#makepost").prop('disabled', true);
        }
    })

    $("#makepost").on('click', function(){
        let formData = new FormData(document.getElementById('new_post'));
        formData.append('head', 'Loving');
        // alert(formData);
        let text = $("#writepost").val();
        let head = 'Loving';
        // $.post('/root/post/add', {text: text, head: head}, (data) => {
        //     console.log(data);
        // })
        // console.log(formData);
        $.ajax({
            url: '/root/post/add',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: (data) => {
                console.log(data);
            }
        })
    })

    $.get("/root/verify_user",function(data){
        let sidebar = $('#sidebar');

        if(data){
            let str = `<a style="color: black; text-decoration: none;" href="/"><li class="active" ><i class="fa fa-home"></i> <span>Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="./explore/"><li ><i class="fa fa-hashtag"></i> <span>Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="/login/logout"><li ><i class="fa fa-sign-out"></i> <span>Logout</span></li></a>
            <a style="color: black; text-decoration: none;" href="/root/${data}"><li ><i class="fa fa-user"></i> <span>Profile</span></li></a>
            <a style="color: black; text-decoration: none;" href="./following/"><li ><i class="fa fa-users"></i> <span>followings</span></li></a>`;
            
            sidebar.html(str);

        } else {
            let str = `<a style="color: black; text-decoration: none;" href="/"><li class="active" ><i class="fa fa-home"></i> <span>Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="./explore/"><li ><i class="fa fa-hashtag"></i> <span>Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="./login/"><li ><i class="fa fa-sign-in"></i> <span>Login</span></li></a>
            <a style="color: black; text-decoration: none;" href="./login/signup.html"><li ><i class="fa fa-user-plus"></i> <span>Signup</span></li></a>`;
            
            sidebar.html(str);
        }
    });
})