$("#create_user").on("submit", event => {
    event.preventDefault();

    let username = $("#username").val();
    let email = $("#email").val();
    let password = $("#password").val();

    let newUser = { username, email, password };
    console.log(newUser);

    $.post("/user", newUser, res => {
        if (res.message === "OK") {
            console.log(res);
            localStorage.token = res.token;
            location.pathname = "/news";
        } else { alert("username or email is not available"); }
    })
})

$("#login_form").on("submit", event => {
    event.preventDefault();

    let username = $("#existuser_username").val();
    let password = $("#existuser_password").val();

    let existUser = { username, password };

    $.post('/login', existUser, res => {
        if (res.message !== "OK") {
            console.log("Login failed: ", res.reason);
            return;
        }

        localStorage.token = res.token;
        localStorage.username = username;
        location.pathname = "/news";
    });
})

$(".comment_form").on("submit", event => {
    event.preventDefault();
    let commentBody = event.target.querySelector(".comment").value;
    let newsItem = event.target.dataset.newsid;

    let newComment = { commentBody, newsItem };
    console.log(newComment);
    $.ajax({
        type: "POST",
        url: "/comments",
        data: newComment,
        beforeSend: xhr => {
            if (localStorage.token) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
            }
        },
        success: res => {
            console.log(res);
            if (res.message === "OK") {
                displaycomment(res.result.commentBody, localStorage.username);
            } else { alert("Comments are failed to post"); }
        }
    })
})

function displaycomment(message, username) {
    $("#show_comments").append('<div class="new_comment"></div>');
    $(".new_comment").append(`<h4 class="author">${username}</h4>`);
    $(".new_comment").append(`<p class="message">${message}</p>`);
    location.reload();
}
