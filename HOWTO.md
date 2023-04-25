# signature-updater-GAS

To update the signature of users in a Google Workspace group, type the email address of the group in the box labelled "Email of group to set". This is optional.

To update the signature of users by individual email addresses, write a newline separated list in the box labelled "List of individual emails to set". This is optional.

One of the two above boxes __must__ be set for the script to work.

Adjust "Signature HTML" to your liking. The script will replace the strings as such:
- `{user_full_name}` with `User['name']['fullName]`
- `{user_job_title}` with `User['organization'][0]['title]`

where `User` refers to the [Google User Object](https://developers.google.com/admin-sdk/directory/reference/rest/v1/users#User)

The box "Example Signature" will live-update as you type. 

### Prepare button:

The prepare button will invoke the Admin Directory API and get the user profiles, extract their fullName and title.

It will then return the data to the frontend. The frontend will display the list of users in a table below the example signature. Each row of the table is clickable to display how their signature will look in "Example signature".

### Apply button:

The prepare button will start using the service account to impersonate users and update their signatures. Progress will be displayed both as a text box, and in the table.