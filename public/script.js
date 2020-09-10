$.ajaxSetup({async: false});

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
            $.post('/profile/get_details', {username: data}, (res)=>{
                $(".mypic img").attr("src", `./uploads/${res.profile_picture}`);
            })
            let str = `<a style="color: black; text-decoration: none;" href="/"><li class="active" ><i class="fa fa-home"></i> <span class="d-none d-lg-inline">Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="./explore/"><li ><i class="fa fa-hashtag"></i> <span class="d-none d-lg-inline">Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="/login/logout"><li ><i class="fa fa-sign-out"></i> <span class="d-none d-lg-inline">Logout</span></li></a>
            <a style="color: black; text-decoration: none;" href="/root/${data}"><li ><i class="fa fa-user"></i> <span class="d-none d-lg-inline">Profile</span></li></a>
            <a style="color: black; text-decoration: none;" href="./following/"><li ><i class="fa fa-users"></i> <span class="d-none d-lg-inline">Followings</span></li></a>`;
            
            sidebar.html(str);

        } else {
            window.location = './login/';
        }
    });


    $.ajax('/profile/all_posts_followers', {
        success: (data)=>{
            let new_card = '';
            if(data){
                let len = data.length;
                console.log(data)
                for(let i=0; i<len; i++){
                    let len2 = data[i]["Posts_of_followers"].length;

                    for(let j=0; j<len2; j++){
                        $.ajax(`/profile/get_details`, {
                            data: {username: data[i]["Posts_of_followers"][j].username},
                            type: 'POST',
                            success: (userdata)=>{
                                console.log(userdata);
                                $.ajax('/root/post/likes_check', {
                                    type: 'POST',
                                    data: {id: data[i]["Posts_of_followers"][j]._id},
                                    success: (res) =>{
                                        let likes_count = data[i]["Posts_of_followers"][j].Likes;
                                        let value = '';
                                        let image = '';
                                        if(res == true)
                                            value = '<span class="heart float-right likebutton"></span>';
                                        else{
                                            value = `<span class="material-icons float-right likebutton">
                                                favorite_border
                                            </span>`;
                                        }
                                        if(data[i]["Posts_of_followers"][j].image != undefined){
                                            image = `<img src='../post_assets/${data[i]["Posts_of_followers"][j].image}'>`;
                                        }
                                        if(!likes_count)
                                            likes_count = 0;
                                        console.log(i, j);
                    
                                        new_card+= `<div class="imgtag">
                                            <img src="./uploads/${userdata.profile_picture}">
                                            <a href="/root/${data[i]["Posts_of_followers"][j].username}">${userdata.first_name} ${userdata.last_name}</a>
                                        </div>
                                        <p class="caption">${data[i]["Posts_of_followers"][j].text}</p>
                                        <div class="postimg">
                                            ${image}
                                        </div>
                                        <div class="reactions">
                                            <div class="row">
                                                <div class="col-4 l${data[i]["Posts_of_followers"][j]._id} like" data-id=${data[i]["Posts_of_followers"][j]._id}>
                                                    ${value}
                                                    <span class="likednumber float-right pr-2">${likes_count}</span>
                                                </div>
                                                <div class="col-4 comment">
                                                    <i class="fa fa-comment-o fa-lg float-right" data-id=${data[i]["Posts_of_followers"][j]._id}></i>
                                                    <span class="commentnumber ln${data[i]["Posts_of_followers"][j]._id} float-right pr-2">${data[i]["Posts_of_followers"][j].comments.length}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="commentsSection cs${data[i]["Posts_of_followers"][j]._id}">
                                            <textarea class="col-12 addcomment" placeholder="Add your Comment"></textarea>
                                            <header>Comments</header>
                                        </div>`
                                    }
                                })
                            }
                        })
                    }
                }
                console.log(new_card);

                if(new_card === '')
                    $("#post_section").html(`<h3>No Posts Available</h3>`);
                else
                    $(".main .mypost").html(new_card);
            } else {
                console.log("No Post Available")
                $("#post_section").html(`<h3>No Posts Available</h3>`);
            }
            $('.loading-screen').fadeOut();
        }
    })

    $(document).on('click', ".main .mypost .reactions div i", function(){
        $.post('/profile/one_post', {id: $(this).attr('data-id')}, (data) =>{
            let classname = '.cs' + $(this).attr('data-id');
            let commentsize = data.comments.length;
            let morecomments = '';
            if(commentsize > 5){
                commentsize = 5;
                morecomments += `<button class="loadcomments" data-show="5">show more comments</button>`;
            }
            for(let j = 0; j < commentsize; j++){
                $.post(`/profile//get_details`, {username: data.comments[j].username}, (commenteduser)=>{
                    console.log(commenteduser);
                    let arr = '';
                    arr = `<div class="commentWritten">
                        <img src="../uploads/${commenteduser.profile_picture}">
                        <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                        <p>${data.comments[j].text}</p>
                    </div>`;
                    $(classname).append(arr);
                })
            }
            console.log(morecomments);
            $(classname).append(morecomments);
            $(classname).show();
        })
    })

    $(document).on('click', '.main .mypost .commentsSection .loadcomments', function(){
        let classname = $(this).parent().attr('class').split(' ')[1];
        let id = classname.split('cs')[1];
        $.post('/profile/one_post', {id: id}, (data) =>{
            console.log(data);
            let size = data.comments.length;
            let start = parseInt($(this).attr('data-show'), 10);
            let finish = 0;
            let morecomments = '';
            if(size - start > 5){
                finish = start + 5
                morecomments += `<button class="loadcomments" data-show="${finish}">show more comments</button>`;
            }
            else{
                finish = size;
            }
            console.log(start, finish)
            for(let j = start; j < finish; j++){
                console.log(data.comments[j].username)
                $.post(`/profile//get_details`, {username: data.comments[j].username}, (commenteduser)=>{
                    console.log(commenteduser);
                    let arr = '';
                    arr = `<div class="commentWritten">
                        <img src="../uploads/${commenteduser.profile_picture}">
                        <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                        <p>${data.comments[j].text}</p>
                    </div>`;
                    console.log(arr);
                    $('.' + classname).append(arr);
                })
            }
            $(this).remove();
            console.log(morecomments);
            $('.' + classname).append(morecomments);
        })
    })

    $(document).on('keyup', '.main .mypost .commentsSection .addcomment', function(e){
        if(e.keyCode === 13){
            let classname = $(this).parent().attr('class').split(' ')[1];
            let id = classname.split('cs')[1];
            console.log(id, classname);
            $.post('/profile/one_post', {id: id}, (data) =>{
                $.get('/root/get_username', (user)=>{
                    let val = $(this).val();
                    let size = data.comments.length;
                    data.comments.push({username: user,text: val})
                    let comments = JSON.stringify(data.comments)
                    console.log(val, comments);
                    $(this).val('');
                    $.post('/root/post/add_comments', {id: id, comments: comments}, (data)=>{
                        console.log(data);
                        $.post('/profile/get_details', {username: user}, (commenteduser)=>{
                            if(data.comments.length < 5){
                                let comment = '';
                                comment = `<div class="commentWritten">
                                    <img src="../uploads/${commenteduser.profile_picture}">
                                    <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                                    <p>${val}</p>
                                </div>`;
                                $('.' + classname).append(comment);
                                $(`.ln${id}`).html(`${data.comments.length}`);
                            }
                            else{
                                let classes = $(this).parent().attr('class').split(' ')[1];
                                let data_show = $("." + classes + " .loadcomments").attr('data-show');
                                console.log(classes);
                                console.log(data_show);
                                $(".loadcomments").remove();
                                if(data_show != undefined)
                                    $('.' + classname).append(`<button class="loadcomments" data-show="${data_show}">show more comments</button>`);
                                else
                                    $('.' + classname).append(`<button class="loadcomments" data-show="${size}">show more comments</button>`);
                                $(`.ln${id}`).html(`${data.comments.length}`);
                            }
                        })
                    })
                })
            })
        }
    });

    $(document).on('click', ".main .mypost .reactions div .likebutton", function(){
        let id = $(this).parent().attr('data-id');
        let classname = $(this).attr('class').split(' ')[0];
        console.log(classname);
        if(classname != 'heart'){
            $.get('/root/verify_user',(user)=>{
                if(user){
                    $.post('/root/post/inc_likes', {id: id}, (data)=>{
                        console.log(data);
                        let value = $(this).parent().attr('class').split(' ')[1];
                        $('.' + value).html('<span class="heart float-right likebutton"></span>');
                        $('.' + value).append(`<span class="likednumber float-right pr-2">${data.Likes}</span>`)
                    })
                }
                else 
                    window.location.assign('../login/');
            })
        }
        else{
            $.post('/root/post/dec_likes', {id: id}, (data)=>{
                console.log(data);
                let value = $(this).parent().attr('class').split(' ')[1];
                $('.' + value).html('<span class="material-icons float-right likebutton">favorite_border</span>');
                $('.' + value).append(`<span class="likednumber float-right pr-2">${data.Likes}</span>`)
            })
        }
    })

})