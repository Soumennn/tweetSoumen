const socket = io();

async function loadMsgs() {

    let allMessages =  await axios.get('/allMessages');
    console.log(allMessages.data);
    let time;
    for(let msg of allMessages.data) 
    {
        time = timeDifference(new Date(), new Date(msg.createdAt));
        if(msg.user !== currentUser)
        {
            $('#messageList').append(`
            <li style="margin-left:27%;">
                <span class="username">${msg.user}: </span>
                <span class="timestamp"> ${time} <br></span>
                ${msg.content}
            </li>`)
        }
    else{
        // $('#messageList').append(`<li> <span class="username">${data.username}:</span> ${data.msg}</li>`)
            $('#messageList').append(`
            <li>
                <span class="username">You:</span>
                <span class="timestamp"> ${time}<br> </span>
                ${msg.content}
            </li>`)
        }

  }

}


loadMsgs();


$('.msg-send-btn').on('click', ()=> {

    const msgText = $('#msg-txt-area').val();
    // console.log(msgText);

    socket.emit('send-msg',{
        msg:msgText,
        username:currentUser
    });


    $('#msg-txt-area').val("");
});

socket.on('received-msg', (data)=> {
    

    // console.log(data);

    let timing;
    timing  = timeDifference(new Date(), new Date(data.createdAt));

    if(data.username !== currentUser)
    {
        $('#messageList').append(`
        <li style="margin-left:27%;"> 
            <span class="username">${data.username}:</span>
            <span class="timestamp"> ${timing} <br></span>
            ${data.msg}
        </li>`)
    }
    else{
        // $('#messageList').append(`<li> <span class="username">${data.username}:</span> ${data.msg}</li>`)
        $('#messageList').append(`
        <li>
            <span class="username">You:</span>
            <span class="timestamp"> ${timing} <br></span>
            ${data.msg}
        </li>`)
    }
    
})