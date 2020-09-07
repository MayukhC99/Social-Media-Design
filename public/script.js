// $.ajaxSetup({async: false});

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
                window.location.reload(true);
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


    $.get("/profile/all_posts_followers",function(data){
        let str = '';
        if(data){
            let len = data.length;
            for(let i=0; i<len; i++){
                let len2 = data[i]["Posts_of_followers"].length;

                for(let j=0; j<len2; j++){
                    let likes_count = data[i]["Posts_of_followers"][j].Likes;
                    if(!likes_count)
                        likes_count = "";

                    str+= `<div class="mypost">
                    <div class="imgtag">
                        <img src="./uploads/000.png">
                        <a href="/root/${data[i]["Posts_of_followers"][j].username}">${data[i]["Posts_of_followers"][j].username}</a>
                    </div>
                    <p class="caption">${data[i]["Posts_of_followers"][j].text}</p>
                    <div class="postimg">
                        <img src="./post_assets/${data[i]["Posts_of_followers"][j].image}">
                    </div>
                    <div class="reactions">
                        <div class="row">
                            <div class="col-4 like">
                                <span class="material-icons float-right">
                                    favorite_border
                                </span>
                                <span class="likednumber float-right pr-2">${likes_count}</span>
                            </div>
                            <div class="col-4 comment">
                                <i class="fa fa-comment-o fa-lg float-right"></i>
                                <span class="float-right pr-2 commentnumber"></span>
                            </div>
                        </div>
                    </div>
                    <div class="commentsSection" style="display:none">
                        <header>Comments</header>
                        
                    </div>
                </div>`
                }
            }

            if(str === '')
                $("#post_section").html(`<h3>No Posts Available</h3>`);
            else
                $("#post_section").html(str);
        } else {
            console.log("No Post Available")
            $("#post_section").html(`<h3>No Posts Available</h3>`);
        }
    })

    $('.loading-screen').fadeOut();

})