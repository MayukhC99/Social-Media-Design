$.ajaxSetup({async: false});

$(document).ready(function(){
    $.ajax('/profile/all_posts_explore', {
        success: (data)=>{
            let size = data.length;
            console.log(data);
            let new_card = '';
            for(let i = 0; i < size; i++){
                $.ajax(`/profile/get_details`, {
                    data: {username: data[i].username},
                    type: 'POST',
                    success: (userdata)=>{
                        console.log(userdata);
                        $.ajax('/root/post/likes_check', {
                            type: 'POST',
                            data: {id: data[i]._id},
                            success: (res) =>{
                                let value = '';
                                let image = '';
                                if(res == true)
                                    value = '<span class="heart float-right"></span>';
                                else{
                                    value = `<span class="material-icons float-right">
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
                                            <i class="fa fa-comment-o fa-lg float-right" data-id=${data[i]._id}></i>
                                        </div>
                                        <div class="col-3" id="share">
                                            <i class="fa fa-share fa-lg float-right"></i>
                                        </div>
                                    </div>
                                </div>
                                <div class="commentsSection cs${data[i]._id}">
                                    <textarea class="col-12 addcomment" placeholder="Add your Comment"></textarea>
                                    <header>Comments</header>
                                </div>`;
                                // $(".main .mypost").append(new_card);
                            }
                        })
                    }
                });
            }
            console.log(new_card);
            $(".main .mypost").html(new_card);
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
                    $.post('/root/post/likes_check', {id: data._id}, (res) =>{
                        let arr = '';
                        let value = '';
                        let reply = '';
                        if(data.comments[j].replies.length > 0){
                            reply += `<button class="loadreply lc${data.comments[j]._id}" data-show="0">show all replies</button>`;
                        }
                        if(res == true)
                            value = '<span class="heart float-right"></span>';
                        else{
                            value = `<span class="material-icons float-right">
                                favorite_border
                            </span>`;
                        }
                        arr = `<div class="commentWritten">
                            <img src="../uploads/${commenteduser.profile_picture}">
                            <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                            <p>${data.comments[j].text}</p>
                            <div class="reactions">
                                <div class="row">
                                    <div class="col-3 like">
                                        ${value}
                                        <span class="likednumber float-right pr-2">13</span>
                                    </div>
                                    <div class="col-3 reply">
                                        <i class="fa fa-reply fa-lg float-right"></i>
                                        <span class="float-right pr-2 repliednumber">13</span>
                                    </div>
                                </div>
                            </div>
                            <div class="replies lc${data._id}">
                                ${reply}
                            </div>
                        </div>`;
                        $(classname).append(arr);
                    })
                })
            }
            console.log(morecomments);
            $(classname).append(morecomments);
            $(classname).show();
        })
    })

    $(document).on('keyup', '.main .mypost .commentsSection .loadcomments', function(){
        let classname = $(this).parent().attr('class')[1];
        let id = classname.split('cs')[1];
        $.post('/profile/one_post', {id: id}, (data) =>{
            let size = data.length;
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
            for(let j = start; j < finish; j++){
                $.post(`/profile//get_details`, {username: data.comments[j].username}, (commenteduser)=>{
                    console.log(commenteduser);
                    $.post('/root/post/likes_check', {id: data._id}, (res) =>{
                        let arr = '';
                        let value = '';
                        let reply = '';
                        if(data.comments[j].replies.length > 0){
                            reply += `<button class="loadreply lc${data.comments[j]._id}" data-show="0">show all replies</button>`;
                        }
                        if(res == true)
                            value = '<span class="heart float-right"></span>';
                        else{
                            value = `<span class="material-icons float-right">
                                favorite_border
                            </span>`;
                        }
                        arr = `<div class="commentWritten">
                            <img src="../uploads/${commenteduser.profile_picture}">
                            <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                            <p>${data.comments[j].text}</p>
                            <div class="reactions">
                                <div class="row">
                                    <div class="col-3 like">
                                        ${value}
                                        <span class="likednumber float-right pr-2">13</span>
                                    </div>
                                    <div class="col-3 reply">
                                        <i class="fa fa-reply fa-lg float-right"></i>
                                        <span class="float-right pr-2 repliednumber">13</span>
                                    </div>
                                </div>
                            </div>
                            <div class="replies lc${data._id}">
                                ${reply}
                            </div>
                        </div>`;
                        $('.' + classname).append(arr);
                    })
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
                    data.comments.push({username: user,text: val})
                    let comments = JSON.stringify(data.comments)
                    console.log(val, comments);
                    $(this).val('');
                    $.post('/root/post/add_comments', {id: id, comments: comments}, (data)=>{
                        console.log(data);
                        $.post('/profile/get_details', {username: user}, (commenteduser)=>{
                            if(data.comments.length == 5){
                                $('.' + classname).append(`<button class="loadcomments" data-show="5">show more comments</button>`);
                            }
                            if(data.comments.length < 5){
                                let comment = '';
                                comment = `<div class="commentWritten">
                                    <img src="../uploads/${commenteduser.profile_picture}">
                                    <a href="/root/${commenteduser.username}">${commenteduser.first_name} ${commenteduser.last_name}</a>
                                    <p>${val}</p>
                                    <div class="reactions">
                                        <div class="row">
                                            <div class="col-3 like">
                                                <span class="material-icons float-right">
                                                    favorite_border
                                                </span>
                                                <span class="likednumber float-right pr-2">13</span>
                                            </div>
                                            <div class="col-3 reply">
                                                <i class="fa fa-reply fa-lg float-right"></i>
                                                <span class="float-right pr-2 repliednumber">13</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="replies lc${data._id}">
                                    </div>
                                </div>`;
                                $('.' + classname).append(comment);
                            }
                        })
                    })
                })
            })
        }
    });

    $(document).on('click', ".loadreply", function(){
        let classname = $(this).attr('class')[1];
        let parent_class = $(this).parent().attr('class')[1];
        let post_id = parent_class.split('lc')[1];
        let comment_id = classname.split('lc')[1];
        $.post('/profile/replies_of_comment', {post_id: post_id, comment_id: comment_id}, (data)=>{
            let size = data.length;
            let start = parseInt($(this).attr('data-show'), 10);
            let finish = 0;
            let reply = '';
            if(size - start > 5){
                finish = start + 5
                reply += `<button class="loadreply ${classname}" data-show="${finish}">show more replies</button>`;
            }
            else{
                finish = size;
            }
            for(let j = start; j < finish; j++){
                $.post(`/profile//get_details`, {username: data.comments[j].username}, (repliedduser)=>{
                    console.log(repliedduser);
                    $.post('/root/post/likes_check', {id: data._id}, (res) =>{
                        let arr = '';
                        let value = '';
                        if(res == true)
                            value = '<span class="heart float-right"></span>';
                        else{
                            value = `<span class="material-icons float-right">
                                favorite_border
                            </span>`;
                        }
                        arr = `<img src="../uploads/${repliedduser.profile_picture}">
                        <a href="/root/${repliedduser.username}">${repliedduser.first_name} ${repliedduser.last_name}</a>
                        <P>${data[j].text}</P>
                        <div class="reactions">
                            <div class="row">
                                <div class="col-3 like">
                                    ${value}
                                    <span class="likednumber float-right pr-2">13</span>
                                </div>
                            </div>
                        </div>`;
                        $("." + parent_class).append(arr);
                    })
                })
            }
            $(this).remove();
            $("." + parent_class).append(reply);
        })
    })

    $(document).on('click', ".main .mypost .reactions div span", function(){
        let id = $(this).parent().attr('data-id');
        let classname = $(this).attr('class').split(' ')[0];
        if(classname != 'heart'){
            $.get('/root/verify_user',(user)=>{
                if(user){
                    $.post('/root/post/inc_likes', {id: id}, (data)=>{
                        console.log(data);
                        let value = $(this).parent().attr('class').split(' ')[1];
                        $('.' + value).html('<span class="heart float-right"></span>');
                    })
                }
                else 
                    window.location.assign('../login/');
            })
        }
    })

    $.get("/root/verify_user",function(data){
        let sidebar = $('#sidebar');

        if(data){
            let str = `<a style="color: black; text-decoration: none;" href="/"><li ><i class="fa fa-home"></i> <span>Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="./"><li class="active"><i class="fa fa-hashtag"></i> <span>Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="/login/logout"><li ><i class="fa fa-sign-out"></i> <span>Logout</span></li></a>
            <a style="color: black; text-decoration: none;" href="/root/${data}"><li ><i class="fa fa-user"></i> <span>Profile</span></li></a>
            <a style="color: black; text-decoration: none;" href="../following/"><li ><i class="fa fa-users"></i> <span>followings</span></li></a>`;
            
            sidebar.html(str);

        } else {
            let str = `<a style="color: black; text-decoration: none;" href="/"><li ><i class="fa fa-home"></i> <span>Home</span></li></a>
            <a style="color: black; text-decoration: none;" href="./"><li class="active"><i class="fa fa-hashtag"></i> <span>Explore</span></li></a>
            <a style="color: black; text-decoration: none;" href="../login/"><li ><i class="fa fa-sign-in"></i> <span>Login</span></li></a>
            <a style="color: black; text-decoration: none;" href="../login/signup.html"><li ><i class="fa fa-user-plus"></i> <span>Signup</span></li></a>`;
            
            sidebar.html(str);
        }
    });
    $('.loading-screen').fadeOut();
})