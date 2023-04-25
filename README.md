# signature-updater-GAS
Code to create a Google Apps Script project to update the signature on multiple users of a Google Workspace instance.

A screenshot to demonstrate functionality:

<img width="894" alt="image" src="https://user-images.githubusercontent.com/41591830/234241628-7fab73bd-2d45-4104-8eb8-5ef2435597f6.png">

### What does this do?

This tool impersonates users on your Google Workspace instance, and updates their Gmail signatures.

### How does it work?

Uses [OAuth2 Library](https://github.com/googleworkspace/apps-script-oauth2) along with a service account with domain-wide delegation.
