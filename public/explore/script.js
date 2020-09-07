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
                                            <i class="fa fa-comment-o fa-lg float-right"></i>
                                        </div>
                                        <div class="col-3" id="share">
                                            <i class="fa fa-share fa-lg float-right"></i>
                                        </div>
                                    </div>
                                </div>`;
                                // $(".main .mypost").append(new_card);
                            }}
                        )
                    }
                })
            }
            console.log(new_card);
            $(".main .mypost").html(new_card);
        }
    });

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
})