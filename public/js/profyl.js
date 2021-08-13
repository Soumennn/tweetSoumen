

$(document).ready(() => {
    // console.log("It worked!");
    // console.log(profileUserId);
    loadTweets();
}
)

const loadTweets = async function() {

    const tweets = await axios.get('/api/post', {
        params: {postedBy:profileUserId}
    });
    for(let post of tweets.data) 
    {
        const html = createPostHtml(post); 
        $('.userPostsContainer').prepend(html);
    }
    
}


//? ----- follow functionality ----- >>>>

$('.userDetailsContainer').on('click', '.follow-tag', async (event)=> {

     const response = await axios.patch(`/follow/${ currentUserId }/${profileUserId}`);
    
    location.reload();
     

})


// console.log(currentUserId);
// console.log(profileUserId);
// console.log("hello")