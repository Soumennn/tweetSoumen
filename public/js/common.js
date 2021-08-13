
// -----------------------------------------------------------------

async function refreshTweets() {

    $('#one').empty();


    const tweets = await axios.get('/api/post');

    // console.log(tweets);

    for(let post of tweets.data) {

    // $('#allTweets').append(`<li>${post.content} <br> by ${post.postedBy} </li>`);
    // console.log(post);
    const html = createPostHtml(post); //! ***
    $('#one').prepend(html);

   }
}




refreshTweets();



//?-------------CREATING A NEW POST --------------

$('#submitPostButton').click( async () => {

    const postText = $('#post-text').val();
    //console.log(postText);

     await axios.post('/api/post', { content: postText });
    //console.log(createdPost);
    refreshTweets();
    $('#post-text').val("");


})


//? --------like functionality ----------

$('.tweetsContainer').on('click','.likeButton', async (event)=> {
   // console.log("like clicked!")

    const button = $(event.target);
    // console.log(button);

   const likesCount = $(event.target.nextElementSibling);
    

    const tweetId = getTweetId(button);
    //console.log(tweetId);

    const tweetData = await axios.patch(`/api/posts/${tweetId}/like`);
    // console.log(tweetData);
    // button.find("span").text(tweetData.data.likes.length);
    $(likesCount).text(tweetData.data[0].likes.length);

// ------- -------- -------- ---------- -----------------
    let userActive; 

    for ( let each of tweetData.data[0].likes)
    {
        if (each === tweetData.data[1])
            userActive = each;
    }

    if(userActive) {
        $(button).addClass('likesActivator');
    }
    else{
        $(button).removeClass('likesActivator');
    }

})

//  ------------------ ------- --------------------  





// ----------------------------------------------------------------------
//? ------  comment functionality  ---------

$('#submitReplyButton').on('click',async (event)=> {
    //console.log('clicked just noew')
    const element = $(event.target);
    const tweetText = $('#reply-text-container').val();
    // console.log(tweetText);
    // console.log(targetTweet.data.postedBy.username);
    const replyTo = element.attr("data-id");
    // console.log(replyTo);
    const tweetData = await axios.post('/api/post', { content:tweetText, replyTo: replyTo});

    location.reload();
});             




$('#replyModal').on('show.bs.modal', async (event)=> {

    // console.log("modal has been opened!");
    const button = $(event.relatedTarget); // returns the triggered element ( chat button)
    // console.log(button)
    const tweetId = getTweetId(button); // returns the tweet's id where the triggered button is present
    // console.log(tweetId);

    $('#submitReplyButton').attr("data-id",tweetId);

    const tweetData = await axios.get(`/api/posts/${tweetId}`);

    const html = createPostHtml(tweetData.data);

    $('#originalPostContainer').empty();

    $('#originalPostContainer').append(html);

})




// ----------------------------------------------------------------------
//?getting the id of the tweet posted: 

function getTweetId(element) {
    const isRoot = element.hasClass('post');

    const rootElement = isRoot === true ? element:element.closest('.post');
    const tweetId = rootElement.data().id;

    return tweetId;
}






// ------------------------------------------------------------------


//! ***
function createPostHtml(postData) {
    const postedBy = postData.postedBy;
    // console.log(postData);

    if(postedBy._id === undefined) {
        return console.log("User object not populated!");
    }

    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    let replyFlag='';
    if(postData.replyTo && postData.replyTo._id)
    {
        if(!postData.replyTo._id) 
        {
            return alert("Reply is not populated!");
        }
        else if(!postData.replyTo.postedBy._id)
        {
            return alert("PostedBy is not populated!")
        }

        const personRepliedTo = postData.replyTo.postedBy.username;
        replyFlag = `<div class="replyFlag">
                            Replying to <a  href='/profile/${personRepliedTo}'> @${personRepliedTo}</a>
                    </div>`
    }



    return `<div class="post" data-id='${postData._id}'>
        <div class="mainContentContainer">
            <div class="userImageContainer">
                <img src='${postedBy.profilePicture}' alt="">
            </div>
            <div class="tweetContentContainer">
                <div class="header">
                    <a href='/profile/${postedBy.username}' class="displayName">${displayName}</a>
                    <span class="username">@${postedBy.username}</span>
                    <span class="date">${timestamp}</span>
                    <div style="color : red;"> ${replyFlag}</div>
                </div>
                <div class="tweetBody">
                    <span>${postData.content}</span>
                </div>
                <div class="tweetFooter">
                    <div class="tweetButtonContainer">
                        <i type="button" data-bs-toggle="modal" data-bs-target="#replyModal" class="far fa-comment"></i>                     
                    </div>
                    <div class="tweetButtonContainer green">
                            <i class="fas fa-retweet"></i>
                    </div>
                    <div class="tweetButtonContainer red">

                            
                            <i class=" likeButton  far fa-heart"></i>  
                            

                        <span class="likes-length">${postData.likes.length}</span>
                    </div>
                </div>
            </div>
        </div>
    </div> `;

}



function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {

        if(elapsed/1000 < 30){

            return "Just now";
        }

         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
        if(Math.round(elapsed/msPerHour) < 2){
            return "1 hour ago";
        }
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}



//  -------------------------------------------------------------- 
//? NEWS API SECTION -- >  

async function responseOne() {

    let topics = await axios.get('https://newsapi.org/v2/everything?q=apple&from=2021-07-23&to=2021-07-23&sortBy=popularity&apiKey=3f89f906dd2d4cbe83f3d1e42bb338ec')

    // console.log(topics);

    for( let news of topics.data.articles)
    {
        const res = createNewsPost(news);
        $('.newsItems1').prepend(res);
    }

}


responseOne();


 function createNewsPost(news) 
 {
     return `

            <div class="newsPost row">
                <div class="col-lg-8 newsText">
                    <h6> ${news.title}</h6>
                    <a href=${news.url}>More</a>
                </div>
                <div class="col-lg-4 newsImage">
                    <img src=${news.urlToImage} alt="">
                </div>
            </div>
     
     `
 }


 //? WALLSTREET  API SECTION -- >  

    
async function responseTwo() {

    let topicsWS = await axios.get('https://newsapi.org/v2/everything?domains=wsj.com&apiKey=3f89f906dd2d4cbe83f3d1e42bb338ec')

    // console.log(topicsWS);

    for( let newsWS of topicsWS.data.articles)
    {
        const res2 = createNewsPostTwo(newsWS);
        $('.newsItems1').prepend(res2);
    }

}


responseTwo();


 function createNewsPostTwo(newsWS) 
 {
     return `

            <div class="newsPost row">
                <div class="col-lg-8 newsText">
                    <h6> ${newsWS.title}</h6>
                    <a href=${newsWS.url}>More</a>
                </div>
                <div class="col-lg-4 newsImage">
                    <img src=${newsWS.urlToImage} alt="">
                </div>
            </div>
     
     `
 }

    









