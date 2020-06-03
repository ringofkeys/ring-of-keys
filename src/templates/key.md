# Just some pseudo code for the Key Profile Template

What I think I need to fix is all of the submits that happen. These need to be condensed into one submit call.

Currently, here is how the submit functionality works:

each field has its own call to handleUpdateSubmit which passes in a bunch (too many) of parameters and fires off a call to 
the updateDatoField serverless function. This calls the DatoCMS update function to update the field given, but this can take any number of fields easily.

What needs to happen instead is:

A running list of edits needs to be saved in state (and shown to the user on Save for each field), and the singular Submit button at the bottom of the profile
editor will send along the running tally of edits made all together. Each field will need to declare whether it's a file (which the current handleUpdateSubmit
already requires), so it looks like I just need to array-ize my handleUpdateSubmit function, then alter the fields to not call handleUpdateSubmit, but rather
setState({ ...profileEdits, [key]: val })
