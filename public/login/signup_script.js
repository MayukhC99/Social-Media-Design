$(function(){
    // $('#preloader').delay(350).fadeOut('slow');
    $('.loading-screen').fadeOut();
    
    // let typed_name= $('#name');
    let typed_username= $('#username');
    let typed_first_name= $('#first_name');
    let typed_last_name= $('#last_name');
    let typed_password= $('#password');
    let signup_btn= $('#signup_btn');

    signup_btn.click(function(){
 
        console.log("Clicked for Signup")
        let username = typed_username.val().trim();
        let first_name = typed_first_name.val().trim();
        let last_name = typed_last_name.val().trim();
        let password= typed_password.val();

        if((username!=='') && (first_name!=='') && (last_name!=='') && (password!=='')){
            $.ajax({
                url: '/signup/getin',
                type: 'POST',
                data: {
                    username: username,
                    password: password,
                    first_name: first_name,
                    last_name: last_name,
                },
                success: (user)=>{
                    console.log(user);
                    if(user){
                        alert(`Welcome ${user.first_name} ${user.last_name}, Please Login to continue`);
                        window.location.href='./index.html';
                    } else {
                        alert('User already exists. Please Signup with a different username');
                        window.location.href= './signup.html';
                    }
                }
            });
         
        }
    })
})