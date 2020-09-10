$(document).ready(function(){
    let userdata;
    let followers_list;
    window.card = '';
    let profileImgField = document.getElementById('profileImgField');
    let username = window.location.href.split('/');
    var theErrorMessage = document.querySelector('#errorMessage');
    var theSuccessMessage = document.querySelector('#successMessage');
    console.log(username[username.length - 1]);
    $.post("/profile/get_details", {username: username[username.length - 1].trim()}, function(data) {
        userdata = data;
        console.log(data);
        $(".profileImg img").attr('src', `../uploads/${data.profile_picture}`);
        $(".backgroundImg img").attr('src', `../uploads/${data.profile_picture}`)
        $(".main #toper span").html(data.first_name + ' ' + data.last_name);
        $(".mydetails #name").html(data.first_name + ' ' + data.last_name);
        $(".mydetails #username").html('@' + data.username);
        let calender = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        let val = data.createdAt.split('-');
        $(".mydetails #createdprofile").html('<i class="fa fa-calendar"></i> Joined ' + calender[val[1] - 1] + ' ' + val[0]);
        $.post("/profile/following_others", {username: data.username}, function(res){
            let size = res.length;
            if(size <= 1)
                $(".mydetails #following").html(`<a href="../following/index.html">${size} Following</a>`);
            else
                $(".mydetails #following").html(`<a href="../following/index.html">${size} Following</a>`);
        })
        $.post("/profile/followers", {username: data.username}, function(res){
            console.log(res);
            followers_list = res;
            let size = res.length;
            if(size <= 1)
                $(".mydetails #followers").html(`<a href="../following/index.html">${size} Follower</a>`);
            else
                $(".mydetails #followers").html(`<a href="../following/index.html">${size} Followers</a>`);
            $.get('/root/get_username', (user)=>{
                if(user == username[username.length - 1]){
                    $(`<button class="btn float-right mt-2" id="editprofile" data-toggle="modal" data-target="#profilemodal">Edit Profile</button>`).insertAfter(".main .profileImg");
                }
                else{
                    let size = followers_list.length;
                    if(size == 0){
                        $(`<button class="btn float-right mt-2" id="followuser">Follow</button>`).insertAfter(".main .profileImg");
                        console.log(user == username[username.length - 1], "follow");
                    }
                    else{
                        for(let i = 0; i < size; i++){
                            if(followers_list[i].username == user){
                                $(`<button class="btn float-right mt-2" id="followinguser">Following</button>`).insertAfter(".main .profileImg");
                                console.log(user == username[username.length - 1], "following");
                                break;
                            }
                            if(i == size - 1){
                                $(`<button class="btn float-right mt-2" id="followuser">Follow</button>`).insertAfter(".main .profileImg");
                                console.log(user == username[username.length - 1], "follow");
                            }
                        }
                    }
                }
            })
        })
        $.post('/profile/all_posts_individual', {username: username[username.length - 1].trim()}, (data)=>{
            let size = data.length;
            if(size == 0){
                $(".main .mypost").html('<h3>No Post Created</h3>');
            }
            for(let i = 0; i < size; i++){
                let new_card = '';
                $.post('/root/post/likes_check', {id: data[i]._id}, (res) =>{
                    let value = '';
                    let image = '';
                    let likes_count = data[i].Likes;
                    if(!likes_count)
                        likes_count = 0;
                    if(res == true)
                        value = '<span class="heart float-right likebutton"></span>';
                    else{
                        value = `<span class="material-icons float-right likebutton">
                            favorite_border
                        </span>`;
                    }
                    if(data[i].image){
                        image = `<img src='../post_assets/${data[i].image}'>`;
                    }
                    new_card += `<div class="imgtag">
                        <img src='../uploads/${userdata.profile_picture}'>
                        <a href="/root/${userdata.username}">${userdata.first_name} ${userdata.last_name}</a>
                    </div>
                    <p id="caption">${data[i].text}</p>
                    <div class="postimg">
                        ${image}
                    </div>
                    <div class="reactions">
                        <div class="row">
                            <div class="col-4 l${data[i]._id}" id="like" data-id=${data[i]._id}>
                                ${value}
                                <span class="likednumber float-right pr-2">${likes_count}</span>
                            </div>
                            <div class="col-4" id="comment">
                                <i class="fa fa-comment-o fa-lg float-right" data-id=${data[i]._id}></i>
                                <span class="likednumber ln${data[i]._id} float-right pr-2">${data[i].comments.length}</span>
                            </div>
                        </div>
                    </div>
                    <div class="commentsSection cs${data[i]._id}">
                        <textarea class="col-12 addcomment" placeholder="Add your Comment"></textarea>
                        <header>Comments</header>
                    </div>`;
                    $(".main .mypost").append(new_card);
                })
            }
        })
    })

    $.post('/root/user/liked/posts', {username: username[username.length - 1].trim()}, (data)=>{
        let size = data.length;
        if(size == 0){
            $(".main .liked_post").html('<h3>No Liked Post Available</h3>');
        }
        for(let i = 0; i < size; i++){
            let new_card = '';
            $.post('/profile/get_details', {username: data[i].user_posts[0].username}, (user)=>{
                $.post('/root/post/likes_check', {id: data[i].user_posts[0]._id}, (res) =>{
                    let value = '';
                    let image = '';
                    let likes_count = data[i].user_posts[0].Likes;
                    if(!likes_count)
                        likes_count = 0;
                        if(res == true)
                        value = '<span class="heart float-right likebutton"></span>';
                    else{
                        value = `<span class="material-icons float-right likebutton">
                            favorite_border
                        </span>`;
                    }
                    if(data[i].user_posts[0].image){
                        image = `<img src='../post_assets/${data[i].user_posts[0].image}'>`;
                    }
                    new_card += `<div class="imgtag">
                        <img src='../uploads/${user.profile_picture}'>
                        <a href="/root/${user.username}">${user.first_name} ${user.last_name}</a>
                    </div>
                    <p id="caption">${data[i].user_posts[0].text}</p>
                    <div class="postimg">
                        ${image}
                    </div>
                    <div class="reactions">
                        <div class="row">
                            <div class="col-4 l${data[i].user_posts[0]._id}" id="like" data-id=${data[i].user_posts[0]._id}>
                                ${value}
                                <span class="likednumber float-right pr-2">${likes_count}</span>
                            </div>
                            <div class="col-4" id="comment">
                                <i class="fa fa-comment-o fa-lg float-right" data-id=${data[i].user_posts[0]._id}></i>
                                <span class="likednumber ln${data[i].user_posts[0]._id} float-right pr-2">${data[i].user_posts[0].comments.length}</span>
                            </div>
                        </div>
                    </div>
                    <div class="commentsSection cs${data[i].user_posts[0]._id}">
                        <textarea class="col-12 addcomment" placeholder="Add your Comment"></textarea>
                        <header>Comments</header>
                    </div>`;
                    $(".main .liked_post").append(new_card);
                })
            })
        }
    })

    $(document).on('click', ".main .mypost .reactions div i, .main .liked_post .reactions div i", function(){
        $.post('/profile/one_post', {id: $(this).attr('data-id')}, (data) =>{
            let classname = '.cs' + $(this).attr('data-id');
            let commentsize = data.comments.length;
            let morecomments = '';
            let parent_class = $(this).parent().parent().parent().parent().attr('class').split(' ')[0];
            console.log(parent_class);
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
                    if(parent_class == 'mypost'){
                        $('.mypost ' + classname).append(arr);
                    }
                    else{
                        $('.liked_post ' + classname).append(arr);
                    }
                })
            }
            console.log(morecomments);
            if(parent_class == 'mypost'){
                $('.mypost ' + classname).append(morecomments);
                $('.mypost ' + classname).show();
            }
            else{
                $('.liked_post ' + classname).append(morecomments);
                $('.liked_post ' + classname).show();
            }
        })
    })

    $(document).on('click', '.main .mypost .commentsSection .loadcomments, .main .liked_post .commentsSection .loadcomments', function(){
        let classname = $(this).parent().attr('class').split(' ')[1];
        let id = classname.split('cs')[1];
        let parent_class = $(this).parent().parent().parent().attr('class').split(' ')[0];
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
                    if(parent_class == 'mypost'){
                        $('.mypost .' + classname).append(arr);
                    }
                    else{
                        $('.liked_post .' + classname).append(arr);
                    }
                })
            }
            $(this).remove();
            console.log(morecomments);
            if(parent_class == 'mypost'){
                $('.mypost .' + classname).append(morecomments);
            }
            else{
                $('.liked_post .' + classname).append(morecomments);
            }
        })
    })

    $(document).on('keyup', '.main .mypost .commentsSection .addcomment, .main .liked_post .commentsSection .addcomment', function(e){
        if(e.keyCode === 13){
            let classname = $(this).parent().attr('class').split(' ')[1];
            let id = classname.split('cs')[1];
            let parent_class = $(this).parent().parent().attr('class').split(' ')[0];
            console.log(id, classname, parent_class);
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
                                if(parent_class == 'mypost'){
                                    $('.mypost .' + classname).append(comment);
                                }
                                else{
                                    $('.liked_post .' + classname).append(comment);
                                }
                                $(`.ln${id}`).html(`${data.comments.length}`);
                            }
                            else{
                                let classes = $(this).parent().attr('class').split(' ')[1];
                                let data_show = $("." + classes + " .loadcomments").attr('data-show');
                                console.log(classes);
                                console.log(data_show, parent_class);
                                $(".loadcomments").remove();
                                if(data_show != undefined){
                                    if(parent_class == 'mypost'){
                                        $('.mypost .' + classname).append(`<button class="loadcomments" data-show="${data_show}">show more comments</button>`);
                                    }
                                    else{
                                        $('.liked_post .' + classname).append(`<button class="loadcomments" data-show="${data_show}">show more comments</button>`);
                                    }
                                }
                                else{
                                    if(parent_class == 'mypost'){
                                        $('.mypost .' + classname).append(`<button class="loadcomments" data-show="${size}">show more comments</button>`);
                                    }
                                    else{
                                        $('.liked_post .' + classname).append(`<button class="loadcomments" data-show="${size}">show more comments</button>`);
                                    }
                                }
                                $(`.ln${id}`).html(`${data.comments.length}`);
                            }
                        })
                    })
                })
            })
        }
    });

    $(document).on('click', ".main .mypost .reactions div .likebutton, .main .liked_post .reactions div .likebutton", function(){
        let id = $(this).parent().attr('data-id');
        let classname = $(this).attr('class').split(' ')[0];
        if(classname != 'heart'){
            $.post('/root/post/inc_likes', {id: id}, (data)=>{
                console.log(data);
                let value = $(this).parent().attr('class').split(' ')[1];
                $('.' + value).html('<span class="heart float-right likebutton"></span>');
                $('.' + value).append(`<span class="likednumber float-right pr-2">${data.Likes}</span>`)
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

    $(document).on('click', ".main #editprofile", function(){
        $("#updateProfile #lastname").val(userdata.last_name);
        $("#updateProfile #firstname").val(userdata.first_name);
        $("#updateProfile .profileImg img").attr('rc', userdata.profile_picture);
    })

    $(document).on('mouseenter', ".main #followinguser", function(){
        $(".main #followinguser").html('Unfollow');
    })
    $(document).on('mouseleave', ".main #followinguser", function(){
        $(".main #followinguser").html('Following');
    })

    $(document).on('click', ".main #followinguser", function(){
        $.post('/root/user/unfollow', {username: username[username.length - 1].trim()}, (data)=>{
            if(data != undefined){
                $(this).remove();
                $(`<button class="btn float-right mt-2" id="followuser">Follow</button>`).insertAfter(".profileImg");
            }
        })
    })

    $(document).on('click', ".main #followuser", function(){
        $.post('/root/user/follow', {username: username[username.length - 1].trim()}, (data)=>{
            if(data != undefined){
                $(this).remove();
                $(`<button class="btn float-right mt-2" id="followinguser">Following</button>`).insertAfter(".profileImg");
            }
        })
    })

    profileImgField.onchange = function (e) {
        var theFile = e.target.files[0];
        console.log(theFile)

        if(customFileFilter(theFile)) {
            handleUploadedFile(theFile);
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
            alert('File too large, cannot be more than 1MB...');
            return false;
        }

        if(check_filename && check_mimetype){
            return true;
        } else {
            $('#errorMessage').show();
            $('#errorMessage').html('File type should be png or jpg/jpeg...<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            alert('File type should be png or jpg/jpeg...');
            return false;
        }
    }

    function handleUploadedFile(file) {
        fileName = file.name;
        var image = document.getElementById("propic");
        var image2 = document.getElementById("backpic");
        image.file = file;
        image2.file = file;
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(image);
        reader.readAsDataURL(file);
        var reader2 = new FileReader();
        reader2.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(image2);
        reader2.readAsDataURL(file);
    }

    $('#deleteprofileImg').click(function(){
        var message = confirm("Are you sure you want to reset your current photo?");
        if(message == true){
            $('#errorMessage').hide();
            $('#successMessage').hide();
            $.get('/profile/delete/profile_image',(res)=>{
                if(res !== "undefined"){
                    window.location.reload();
                }
            })
        }
    })

    $(document).on('click', '.alert .close', function(){
        $(".alert").hide();
    })

    let prev_nav = mypost;

    $(".main .navbar ul li").on('click', function(e){
        if(!$(this).hasClass('active')){
            if(prev_nav == mypost){
                $(".main .navbar ul li:first-child").removeClass('active');
                $(this).addClass('active');
                $(`.main .mypost`).hide();
                prev_nav = liked_post;
                $(`.main .liked_post`).show();
            }
            else{
                $(".main .navbar .nav-tabs li:last-child").removeClass('active');
                $(this).addClass('active');
                $(`.main .liked_post`).hide();
                prev_nav = mypost;
                $(`.main .mypost`).show();
            }
        }
    })

    $("#update").on('click', function(){
        let formData = new FormData(document.getElementById('updateProfile'));
        console.log(formData.get('profile_image'));
        $.ajax({
            type: 'POST',
            url: '/profile/upload/profile_image', 
            data: formData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            success: (data) => {
                if(data != undefined){
                    $.post('/profile/profile_update', 
                    {
                        first_name: formData.get('first_name'), 
                        last_name: formData.get('last_name')
                    }, (data) =>{
                        location.reload();
                    })
                }
                else{
                    $("#profilemodal").modal('toggle');
                }
            }
        })
    })

    $(".main #toper i").on('click', function(){
        window.history.back();
    })

    $.get("/root/verify_user",function(data){
        let sidebar = $('#sidebar');

        if(data){
            let str = `<a style="color: black; text-decoration: none;" href="/"><li ><i class="fa fa-home"></i> <span class="d-none d-lg-inline">Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="../explore/"><li ><i class="fa fa-hashtag"></i> <span class="d-none d-lg-inline">Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="/login/logout"><li ><i class="fa fa-sign-out"></i> <span class="d-none d-lg-inline">Logout</span></li></a>
            <a style="color: black; text-decoration: none;" href="/root/${data}"><li class="active"><i class="fa fa-user"></i> <span class="d-none d-lg-inline">Profile</span></li></a>
            <a style="color: black; text-decoration: none;" href="../following/"><li ><i class="fa fa-users"></i> <span class="d-none d-lg-inline">Followings</span></li></a>`;
            
            sidebar.html(str);

        } else {
            window.location = '../login/';
        }
    });

    $('.loading-screen').fadeOut();
})