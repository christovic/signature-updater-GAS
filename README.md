# signature-updater-GAS
Code to create a Google Apps Script project to update the signature on multiple users of a Google Workspace instance.

A screenshot to demonstrate functionality:

<img width="894" alt="image" src="https://user-images.githubusercontent.com/41591830/234241628-7fab73bd-2d45-4104-8eb8-5ef2435597f6.png">

### What does this do?

This tool impersonates users on your Google Workspace instance, and updates their Gmail signatures to the HTML set in "Signature HTML"

### How does it work?

Uses [OAuth2 Library](https://github.com/googleworkspace/apps-script-oauth2) along with a service account with domain-wide delegation.

### How do I set it up?

1. Create a [Google service account](https://apps.google.com/supportwidget/articlehome?hl=en&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F7378726%3Fhl%3Den&assistant_id=generic-unu&product_context=7378726&product_name=UnuFlow&trigger_context=a).  
Give it [domain-wide delegation](https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority), the only permission you need to add here is `https://www.googleapis.com/auth/gmail.settings.basic`.

2. [Create a new Google Apps Script](https://script.google.com/home/projects/create).

3. Press + next to "Libraries" on the lefthand sidebar. Use Google's apps-script-oauth2 ID `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF`, press "Look up", and press "Add".  
Press + next to Services, select "Admin SDK API", and press "Add"

4. Copy and paste the contents of src/Code.gs into Code.gs in Google Apps Script.  
Copy and paste the contents of src/main.html into a new html file in Google Apps Script, and call it main. 

5. Fill out your domain name at the top.  
Get your private key from the service account area that you made in step 2 and paste it in the constant `PRIVATE_KEY`. Do the same for the service account email address. 

6. Click "Deploy" at the top right, click "New deployment". Click the cog next to "Select type", choose "Web app". Add a description, press "Deploy". Authorise access, then you can access the web interface with the link under "URL".
