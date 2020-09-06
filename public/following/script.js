
$(document).ready(function(){
    let prev_nav_flag = $('.navbar-nav li:first-child');

    $(".navbar-nav li a, .followers, .following_others").click(function(e){
        let class_name = $(this).attr('class').split(' ');
        let class_link = '';
        if(class_name[3] === "following_others" || class_name[3] === "followers" ){
            $(".followers, .following_others").show();
            $(this).hide();
            class_link = class_name[3];
            $(".heading").text($('.' + class_name[3] + ' .col-8').text());
        }
        else{
            prev_nav_flag.toggleClass('active');
            prev_nav_flag = $(this);
            $(this).toggleClass('active');
            class_link = class_name[1];
        }
        window.header = class_link;
        $.ajax(`/profile/${class_link}`, {
            success: (data) =>{
                let size = data.length;
                if(size == 0){
                    $(".no_users").show();
                    $(".first").html('');
                    $(".second").html('');
                    if(class_link === "following_others")
                        $(".no_users").text("You are not following anyone");
                    else if(class_link === "followers")
                        $(".no_friends").text("You have no followers");
                }
                else{
                    $(".no_friends").hide();
                    $(".first").html('');
                    $(".second").html('');
                    let first = '';
                    let second = '';
                    window.user_details = data;
                    for(let i = 0; i < size; i++){
                        let str = '';
                        str += `<div class="row add add${(i+1)}" style="height: 120px;padding-top: 10px;">
                            <div class="col-4">
                                <div class="image">
                                    <label id="theImageContainer">
                                        <img id="user" src="../uploads/${data[i]["data"][0].profile_picture}">
                                    </label>
                                </div>
                            </div>
                            <div class="col-4 full_name" style="text-align: center;overflow: hidden;word-break: break-all;">
                                ${data[i]["data"][0].first_name} ${data[i]["data"][0].last_name}<br />
                                <small class="username text-muted">${data[i]["data"][0].username}</small>
                            </div>`;
                        if(class_link === "following_others"){
                            str += `<div class="col-4 button_container">
                                <button class="btn btn-light follower follow${(i+1)}" data-toggle="tooltip" data-placement="top" title="Followed"><span><i class="fas fa-check"></i></span> Followed</button>
                                <button class="btn btn-light unfollow unfollow${(i+1)}" style="display: none;">Unfollow</button>
                            </div>
                        </div>`;
                        }
                        

                        if(i % 2 == 0)
                            first += str;
                        else
                            second += str;
                    }
                    $(".first").html(first);
                    $(".second").html(second);
                    $('[data-toggle="tooltip"]').tooltip();
                }
            },
            error: (data) =>{
                alert("An error has occurred");
            }
        })
        return false;
    });

    $.get('/profile/followers', (data) =>{
        let size = data.length;
        let first = '';
        let second = '';
        window.user_details = data;
        window.header = 'followers';
        if(size == 0){
            $(".no_users").show();
            $(".no_users").text("You have no followers");
        }
        else{
            $(".no_users").hide();
            for(let i = 0; i < size; i++){
                let str = '';
                str += `<div class="row add add${(i+1)}" style="height: 120px;padding-top: 10px;">
                    <div class="col-4">
                        <div class="image">
                            <label id="theImageContainer">
                                <img id="user" src="../uploads/${data[i]["data"][0].profile_picture}">
                            </label>
                        </div>
                    </div>
                    <div class="col-4 full_name" style="text-align: center;overflow: hidden;word-break: break-all;">
                        ${data[i]["data"][0].first_name} ${data[i]["data"][0].last_name}<br />
                        <small class="username text-muted">${data[i]["data"][0].username}</small>
                    </div>
                </div>`;
                if(i % 2 == 0)
                    first += str;
                else
                    second += str;
            }

            $(".first").html(first);
            $(".second").html(second);
            $('[data-toggle="tooltip"]').tooltip();
        }
    })

    $(document).on('keyup', "input", function(e){
        let val = $(this).val();
        if (val == "") {
            if($(window).width() >= 768){
                if(window.header === "followers")
                    $(".navbar-nav li:first-child a").trigger('click');
                else if(window.header === "following_others")
                    $(".navbar-nav li:nth-child(2) a").trigger('click');
            }
            else{
                if(window.header === "followers")
                    $(".followers").trigger('click');
                else if(window.header === "following_others")
                    $(".following_others").trigger('click');
            }
            return false;
        }
        $(".no_users").hide();
        $(".first").html('');
        $(".second").html('');
        let first = '';
        let second = '';
        let flag = 0;
        let arr = window.user_details;
        for (i = 0; i < arr.length; i++) {
            let str = '';
            /*check if the item starts with the same letters as the text field value:*/
            let checker = val.toUpperCase();
            let full_name_check = arr[i]["data"][0].first_name.substr(0, val.length).toUpperCase() + " " + arr[i]["data"][0].last_name.substr(0, val.length).toUpperCase();
            if (arr[i]["data"][0].username.substr(0, val.length).toUpperCase() == checker || full_name_check == checker) {
                str += `<div class="row add add${(flag+1)}" style="height: 120px;padding-top: 10px;">
                    <div class="col-4">
                        <div class="image">
                            <label id="theImageContainer">
                                <img id="user" src="../uploads/${arr[i]["data"][0].profile_picture}">
                            </label>
                        </div>
                    </div>
                    <div class="col-4 full_name" style="text-align: center;overflow: hidden;word-break: break-all;">
                        ${arr[i]["data"][0].first_name} ${arr[i]["data"][0].last_name}<br />
                        <small class="username text-muted">${arr[i]["data"][0].username}</small>
                    </div>`;

                    if(window.header === "following_others"){
                        str += `<div class="col-4 button_container">
                            <button class="btn btn-light follower follow${(flag+1)}" data-toggle="tooltip" data-placement="top" title="Followed"><span><i class="fas fa-check"></i></span> Followed</button>
                            <button class="btn btn-light unfollow unfollow${(flag+1)}" style="display: none;">Unfollow</button>
                        </div>
                    </div>`;
                    }
                    
                if(flag % 2 == 0)
                    first += str;
                else
                    second += str;
                flag++;
            }
        }
        if(flag == 0){
            $(".no_users").show();
            $(".no_users").text(`No results for: ${val}`);
        }
        else{
            $(".first").html(first);
            $(".second").html(second);
            $('[data-toggle="tooltip"]').tooltip();
        }
    })

    $(document).on('click', '.add', function(){
        var class_name = $(this).attr("class");
        var one = class_name.split(' ')[2];
        var space = $("." + one + " .username").text();
        username = $.trim(space);
        window.location = `/root/account_user/${username}`;
    });


    //No modification yet here
    $(document).on('click', '.follower, .unfollow', function(e){
        e.preventDefault();
        var class_name = $(this).attr("class");
        var all_class = class_name.split(' ');
        var name = all_class[2];
        var second = all_class[3];
        console.log(all_class);
        if(name === "follower"){
            var str = second.split('follow');
            $(".unfollow" + str[1]).toggle();
        }
        else{
            var parent_name = $("." + second).parent().parent().attr("class");
            var add = parent_name.split(" ")[2];
            var one_name = $("." + add).attr("class");
            var one = one_name.split(' ')[2];
            var space = $("." + one + " .username").text();
            var user_name = $.trim(space);
            $.post(`/profile/user/unfollow`, { username: user_name } , (data) => {
                if(data === "success"){
                    setTimeout(location.reload.bind(location), 200);
                }
            })
        }
        return false;
    })

    $(document).on('click', '#back', function(){
        window.history.back();
    })

})