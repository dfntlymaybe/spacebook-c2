var spacebookApp = function(){

  //Main array of posts
  var posts = [];


  //Local storage
  var STORAGE_ID = 'spacebook';

  var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(posts));
  }

  var getFromLocalStorage = function () {
    posts = JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  }


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

  //get text, create post object and push it into the posts array
  function createPost(text){
    var currentPost = new post(text);
    posts.push(currentPost);
    saveToLocalStorage();
  }

  //toggle comments
  function toggleComments($currentPost){
    var postComments = $currentPost.find('.comments-block').eq(0).find('p');
    if(postComments.length > 0){
      $currentPost.find('.comments-block').eq(0).empty();
    }else{
      publishComments($currentPost);  
    }
  }

  //show comments of the post that were clicked on
  function publishComments($currentPost){

    $commentsBlock = $currentPost.find('.comments-block').eq(0).empty(); //clearing the comments block
    var id = $currentPost.find('.post').eq(0).data().id;

    for(var i = 0; i < posts.length; i++){
      if(id == posts[i].id){
        for(var j = 0; j < posts[i].comments.length; j++ ){

          //Creating comment using handlebars
          var source   = $("#Comment-template").html();
          var template = Handlebars.compile(source);
          var currentComment = template(posts[i].comments[j]);

          $commentsBlock.append(currentComment);
        } 

        //bind the remove button to event      
        $('.remove-comment').on('click', function(){
          event.preventDefault();
          removeComment($currentPost, $(this).closest('p'));
        });
        return;
      }
    }
  }

  //Adding comment to the main array
  function addComment($currentPost){
    var inputArr = $currentPost.find('input');
    var userName = $(inputArr[0]).val(); //get the user name text
    var userCcomment = $(inputArr[1]).val(); //get the comment text
    $('input').val("");
    if(userName != "" || userCcomment != ""){  //check that both fields are not empty
      var currentComment = new comment(userName,userCcomment);
      var id = $currentPost.find('p').eq(0).data().id;
      
      for(var i = 0; i < posts.length; i++){
        if(id == posts[i].id){
          posts[i].comments.push(currentComment);
          saveToLocalStorage();
          updatePosts();

          $currentPost = $(".post[data-id='" + id + "']").closest('.current-post');
          publishComments($currentPost);
          return;
        }
      } 
    }
  }

  //Add like to the post object and to the screen
  function addLike($currentPost){
    var id = $currentPost.find('p').eq(0).data().id;
    for(var i = 0; i < posts.length; i++){
      if(id == posts[i].id){
        posts[i].likes++;
        saveToLocalStorage();
        updatePosts();
        return;
      }
    } 
  }

  //remove specific comment
  function removeComment($currentPost, $currentComment){
    var postId = $currentPost.find('p').eq(0).data().id;
    var commentId = $currentComment.data().id;
    for(var i = 0; i < posts.length; i++){
      if(postId == posts[i].id){
        for(var j = 0; j < posts[i].comments.length; j++){
          if(commentId === posts[i].comments[j].id){
            posts[i].comments.splice(j, 1);
            saveToLocalStorage();
            updatePosts();
            publishComments($currentPost);

            return;
          }
        }
      }
    } 
  }

  //update posts on the screen
  function updatePosts(){
    $('.posts').empty();
    for(var i = 0; i < posts.length;  i++){

      //Creating post using handlebars
      var source   = $("#Post-template").html();
      var template = Handlebars.compile(source);
      var postStr = template(posts[i]);
      $('.posts').append(postStr);
    }
    
    //bind buttons click events with callback functions
    $('.remove-post').on('click', function(){
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
  function removePost($currentPost){
    var id = $currentPost.find('p').eq(0).data().id;
    for(var i = 0; i < posts.length; i++){
      if(id == posts[i].id){
        posts.splice(i, 1);
        saveToLocalStorage();
        updatePosts()
        return;
      }
    }      
  }


  return {
    createPost: createPost,
    updatePosts: updatePosts,
    getFromLocalStorage: getFromLocalStorage
  };

};


var app = spacebookApp();
app.getFromLocalStorage();
app.updatePosts();

$('.add-post').on('click', function(){
   event.preventDefault();

   var text = $('#post-name').val();
   $('input').val(""); //clear input

   app.createPost(text);
   app.updatePosts();
  
});

