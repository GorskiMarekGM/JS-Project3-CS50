  document.addEventListener('DOMContentLoaded', function() {


  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //post_email();
  read_form();
  // By default, load the inbox
  load_mailbox('inbox');
  
 
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  get_inbox(mailbox);
  is_read(mailbox);
}
//------------------------------------------------

function read_form(){
    document.querySelector('form').onsubmit = function(){
      const recipients = document.querySelector('#compose-recipients').value;
      const subject = document.querySelector('#compose-subject').value;
      const body = document.querySelector('#compose-body').value;

      fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
      });
      load_mailbox('inbox');
  };
}
function is_read(mailbox){

  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {

  console.log('emails length '+ emails.length);
  
  for (let i = 0; i < emails.length; i++) {
    let read = emails[i].read;
    console.log('read:'+ read);

    change_style_onclick(emails[i],i);
    if(!emails[i].read == false)
    {
      document.querySelector(`#email-${i}`).style.backgroundColor = '#5e5e5e';
      document.querySelector(`#email-${i}`).style.cursor='pointer';
      document.querySelector(`#email-${i}`).style.color = 'white';
    }else{
      change_style_onclick(emails[i],i);
    }
  }
});
}

function read_true(id){
  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
}
function archive(id){
  fetch('/emails/'+id, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  load_mailbox('archive');
}
function replay_email(sender,subject,body,time){
  //Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // // Clear out composition fields
  document.querySelector('#compose-recipients').value = sender;

  if(subject.substring(0,3) === 'Re:')
  {
    document.querySelector('#compose-subject').value += subject;
  }else{
    document.querySelector('#compose-subject').value = 'Re: ' + subject;
  }

  document.querySelector('#compose-body').value = 'On: '+ time + ' ' + sender + ' wrote: '+ body;

}

function display_email(id){
  //alert('display email func');
  fetch('/emails/'+id)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#emails-view').innerHTML = `
    <h3>Email:</h3>
    <div class="card" style="width: 30rem; cursor:pointer;">
            <div id="email-1">
              <div class="card-body" style="padding:20px;">
                <h6 class="card-title">Recipents: ${email.recipients}</h6><br>
                <h6 class="card-subtitle mb-2">From: ${email.sender}</h6><br>
                <h5 class="card-title">${email.subject}</h5>
                <p class="card-text">${email.body}</p><br>
                <h6 class="card-subtitle mb-2" style="float:right;">${email.timestamp}</h6>
                <button onclick="archive(${id})" class="btn btn-sm btn-outline-primary" style="background-color:white">Archive</button>
                <button onclick="replay_email('${email.sender}','${email.subject}','${email.body}','${email.timestamp}')" class="btn btn-sm btn-outline-primary">Reply</button>
              </div>
            </div>
          </div>
      `;

  });
}
function change_style_onclick(email,i){
  document.querySelector(`#email-${i}`).onclick = () =>{
    document.querySelector(`#email-${i}`).style.backgroundColor = '#5e5e5e';
    document.querySelector(`#email-${i}`).style.color = 'white';

    display_email(email.id);

    read_true(email.id);
  }
}
function get_inbox(mailbox){
  let i = 0;
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {

    emails.forEach(email => {

      document.querySelector('#emails-view').innerHTML += `<div class="card" style="width: 18rem;">
            <div id="email-${i}">
              <div class="card-body" style="cursor:pointer;">
                <h5 class="card-title">${email.subject}</h5>
                <h6 class="card-subtitle mb-2">From: ${email.sender}</h6>
                <p class="card-text">${email.body}</p>
                <h6 class="card-subtitle mb-2">${email.timestamp}</h6>
                <button onclick="archive(${email.id})" class="btn btn-sm btn-outline-primary" style="background-color:white" >Archive</button>
              </div>
            </div>
          </div>
      `;
      i++;
    });

  });
}