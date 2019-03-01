# Mosaic app data model

- Upload the data model emx file using the 'Advanced data import' plugin, commander or API.
- Use the 'Meta data manager' plugin to mark the file attributes (eventFile, snpFile) as 'Cascade delete'.
- Use the scripts plugin, commander or api to update the analysis scripts found in the scrips folder. 
- Setup a cleanup job using the 'Scheduled jobs' plugin to clear the data at a set interval (nightly).   
