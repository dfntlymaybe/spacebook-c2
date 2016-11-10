//post object
function post(text){
  this.text = text;
  this.id = ++post.counter;
  this.comments = [];
}

//static counter (for unique id's)
post.counter = 0;

//comment object
function comment(userName, text){
  this.userName = userName;
  this.text = text;
}

//Main array of posts
var posts = [];

//get text, create post object and push it into the posts array
function createPost(text){
  var currentPost = new post(text);
  posts.push(currentPost);
}

//show comments of the post that were clicked on
function publishComments(){
  event.preventDefault();

  var postComments = $(this).closest('.current-post').find('.comments-block').eq(0).find('p');
  if(postComments.length > 0){

    $(this).closest('.current-post').find('.comments-block').eq(0).empty();

  }else{

    var id = $(this).closest('.current-post').find('p').eq(0).data().id;

    for(var i = 0; i < posts.length; i++){
      if(id == posts[i].id){
     
        for(var j = 0; j < posts[i].comments.length; j++ ){
          $(this).closest('.current-post').find('.comments-block').eq(0).append("<p>" + posts[i].comments[j].userName + ": " + posts[i].comments[j].text + "</p>");
        }

      return;
      }  
    } 
  }
  
}

//Adding comment to the main array
function addComment(){
  event.preventDefault();
  var inputArr = $(this).closest('div').find('input');
  var userName = $(inputArr[0]).val();
  var userCcomment = $(inputArr[1]).val();
  var currentComment = new comment(userName,userCcomment);
  clearForm()
  var id = $(this).closest('.current-post').find('p').eq(0).data().id;
  console.log(id);
  for(var i = 0; i < posts.length; i++){
    if(id == posts[i].id){
      posts[i].comments.push(currentComment);
      
      $(this).closest('.current-post').find('.comments-link').eq(0)[0].innerHTML = posts[i].comments.length + " comments";
      return;
    }
  } 
}

//update posts on the screen
function updatePosts(){
  $('.posts').empty();
  for(var i = 0; i < posts.length;  i++){
    var postStr = '<div class="current-post"><p class="post" data-id="' + posts[i].id + '">'+  posts[i].text + '<a href="#" class="comments-link"> ' + posts[i].comments.length + ' comments</a></p><div class="comments-block"></div><a href="#" class="remove">remove post</a>';
    var commentStr = '<form class="form-inline"><div class="form-group"><input type="text" class="form-control" id="userName" placeholder="User Name"></div><div class="form-group"><input type="text" class="form-control" id="comment" placeholder="Comment"></div><button type="submit" class="btn btn-primary post-comment">Post Comment</button></form></div>'
    $('.posts').append(postStr + commentStr);
  }
  $('.remove').on('click', removePost);
  $('.post-comment').on('click', addComment);
  $('.comments-link').on('click', publishComments);
}


//remove a post from the array and the screen
function removePost(){
  var id = $(this).closest('.current-post').find('p').eq(0).data().id;
  for(var i = 0; i < posts.length; i++){
    if(id == posts[i].id){
      posts.splice(i, 1);
      $(this).closest('.current-post').remove();
      return;
    }
  }      
}

function clearForm(){
  $('input').val("");
}

$('.add-post').on('click', function(){
   event.preventDefault();
   createPost($('#post-name').val());
   clearForm()
   updatePosts();
});

