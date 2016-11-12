//post object
function post(text){
  this.text = text;
  this.id = ++post.counter;
  this.comments = [];
  this.likes = 0;
}

//static counter (for unique id's)
post.counter = 0;

//comment object
function comment(userName, text){
  this.userName = userName;
  this.text = text;
  this.id = ++comment.counter;
}

//static counter (for unique id's)
comment.counter = 0;

//Main array of posts
var posts = [];

//get text, create post object and push it into the posts array
function createPost(text){
  var currentPost = new post(text);
  posts.push(currentPost);
}

//toggle comments
function toggleComments(currentPost){
  var postComments = currentPost.find('.comments-block').eq(0).find('p');
  if(postComments.length > 0){
    currentPost.find('.comments-block').eq(0).empty();
  }else{
    publishComments(currentPost);  
  }
}

//show comments of the post that were clicked on
function publishComments(currentPost){
  currentPost.find('.comments-block').eq(0).empty();
  var id = currentPost.find('p').eq(0).data().id;
  for(var i = 0; i < posts.length; i++){
    if(id == posts[i].id){
      for(var j = 0; j < posts[i].comments.length; j++ ){
        var currentComment = "<p data-id='" + posts[i].comments[j].id + "'>" + posts[i].comments[j].userName + ": " + posts[i].comments[j].text + "<a href='#'' class='remove-comment'> remove comment</a></p>"
        currentPost.find('.comments-block').eq(0).append(currentComment);
      }
      $('.remove-comment').on('click', removeComment);
      return;
    }
  }
}



//Adding comment to the main array
function addComment(currentPost){
  var inputArr = currentPost.find('input');
  var userName = $(inputArr[0]).val();
  var userCcomment = $(inputArr[1]).val();
  if(userName != "" || userCcomment != ""){ //checking that both fields are not empty
    var currentComment = new comment(userName,userCcomment);
    clearForm()
    var id = currentPost.find('p').eq(0).data().id;
    //console.log(id);
    for(var i = 0; i < posts.length; i++){
      if(id == posts[i].id){
        posts[i].comments.push(currentComment);      
        currentPost.find('.comments-link').eq(0)[0].innerHTML = " " + posts[i].comments.length + " comments";
        publishComments(currentPost);
        return;
      }
    } 
  }
}

function removeComment(){
  var postId = $(this).closest('.current-post').find('p').eq(0).data().id;
  var commentId = $(this).closest('p').data().id;
  //var currentComment = $(this).closest('p').val();
  for(var i = 0; i < posts.length; i++){
    if(postId == posts[i].id){
      for(var j = 0; j < posts[i].comments.length; j++){
        if(commentId === posts[i].comments[j].id){
          posts[i].comments.splice(j, 1);
          $(this).closest('.current-post').find('.comments-link').eq(0)[0].innerHTML = " " + posts[i].comments.length + " comments";
          $(this).closest('p').remove();
          return;
        }
      }
    }
  } 
}

function addLike(currentPost){
  var id = currentPost.find('p').eq(0).data().id;
  for(var i = 0; i < posts.length; i++){
    if(id == posts[i].id){
      posts[i].likes++;
      currentPost.find('.likes-link').eq(0)[0].innerHTML = " " + posts[i].likes + " Likes";
      return;
    }
  } 
}

//update posts on the screen
function updatePosts(){
  $('.posts').empty();
  for(var i = 0; i < posts.length;  i++){
    var postStr = '<div class="current-post"><p class="post" data-id="' + posts[i].id + '">'
     + posts[i].text + '<a href="#" class="comments-link">' + posts[i].comments.length
     + ' Comments</a><a href="#" class="likes-link">' + posts[i].likes
     + ' Likes</a></p><div class="comments-block"></div><a href="#" class="remove btn btn-warning">remove post</a><br> '
     + ' <form class="form-inline"><div class="form-group"><input type="text" class="form-control" id="userName" placeholder="User Name">'
     + '</div><div class="form-group"><input type="text" class="form-control" id="comment" placeholder="Comment">'
     + '</div><button type="submit" class="btn btn-primary post-comment">Post Comment</button></form></div>'
    $('.posts').append(postStr);
  }

//bind buttons click events with callback functions
  $('.remove').on('click', function(){
    event.preventDefault();
    removePost($(this).closest('.current-post'));
  });
  
  $('.post-comment').on('click', function(){
    event.preventDefault();
    addComment($(this).closest('.current-post'));
  });

  $('.comments-link').on('click', function(){
    event.preventDefault();
    toggleComments($(this).closest('.current-post'));
  });
  
  $('.likes-link').on('click', function(){
    event.preventDefault();
    addLike($(this).closest('.current-post'));
  });
}

//remove a post from the array and the screen
function removePost(currentPost){
  var id = currentPost.find('p').eq(0).data().id;
  for(var i = 0; i < posts.length; i++){
    if(id == posts[i].id){
      posts.splice(i, 1);
      currentPost.remove();
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

