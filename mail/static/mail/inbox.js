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
      alert(`Our email has been sent, ${recipients}! ${subject}! ${body}!`);
      load_mailbox('inbox');
  };
}

function get_inbox(mailbox){
  fetch('/emails/'+mailbox)
  .then(response => response.json())
  .then(emails => {

    emails.forEach(email => {

      document.querySelector('#emails-view').innerHTML += `<div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">${email.subject}</h5>
              <h6 class="card-subtitle mb-2 text-muted">From: ${email.sender}</h6>
              <p class="card-text">${email.body}</p>
              <h6 class="card-subtitle mb-2 text-muted">${email.timestamp}</h6>
              <a href="#" class="card-link">Archive</a>
            </div>
          </div>
      `;

    });

  });
}