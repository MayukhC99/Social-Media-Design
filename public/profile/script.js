$(document).ready(function(){
    let userdata;
    let followers_list;
    window.card = '';
    let profileImgField = document.getElementById('profileImgField');
    let username = window.location.href.split('/');
    console.log(username[username.length - 1]);
    $.post("/profile/get_details", {username: username[username.length - 1].trim()}, function(data) {
        userdata = data;
        console.log(data);
        $(".profileImg img").attr('src', `../uploads/${data.profile_picture}`)
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
            for(let i = 0; i < size; i++){
                let new_card = '';
                $.post('/root/post/likes_check', {id: data[i]._id}, (res) =>{
                    let value = '';
                    let image = '';
                    if(res == true)
                        value = '<span class="heart float-right"></span>';
                    else{
                        value = `<span class="material-icons">
                            favorite_border
                        </span>`;
                    }
                    if(data[i].image){
                        image = `../post_assets/${data[i].image}`;
                    }
                    new_card += `<div class="imgtag">
                        <img src='../uploads/${userdata.profile_picture}'>
                        <a href="/root/${userdata.username}">${userdata.first_name} ${userdata.last_name}</a>
                    </div>
                    <p id="caption">${data[i].text}</p>
                    <div class="postimg">
                        <img src='${image}'>
                    </div>
                    <div class="reactions">
                        <div class="row">
                            <div class="col-3 l${i}" id="like" data-id=${data[i]._id}>
                                ${value}
                            </div>
                            <div class="col-3" id="comment">
                                <i class="fa fa-comment-o fa-lg float-right"></i>
                            </div>
                            <div class="col-3" id="share">
                                <i class="fa fa-share fa-lg float-right"></i>
                            </div>
                        </div>
                    </div>`;
                    $(".main .mypost").append(new_card);
                })
            }
        })
    })

    $(document).on('click', ".main .mypost .reactions div span", function(){
        let id = $(this).parent().attr('data-id');
        let classname = $(this).attr('class').split(' ')[0];
        if(classname != 'heart'){
            $.post('/root/post/inc_likes', {id: id}, (data)=>{
                console.log(data);
                let value = $(this).parent().attr('class').split(' ')[1];
                $('.' + value).html('<span class="heart float-right"></span>');
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
        var image = document.getElementById("propic");
        image.file = file;
        var reader = new FileReader();
        reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(image);
        reader.readAsDataURL(file);
    }

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
                        $("#profilemodal").modal('toggle');
                    })
                }
                else{
                    $("#profilemodal").modal('toggle');
                }
            }
        })
    })
    $('.loading-screen').fadeOut();
})