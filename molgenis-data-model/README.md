# Mosaic app data model

- Upload the data model emx file using the 'Advanced data import' plugin, commander or API.
- Use the molgenis permission manager to mark the 'exp_data' entity as row level secured.
(This work around is needed as row level security is not part of emx at the moment)
- Use the 'Meta data manager' plugin to mark the 'exp_data' entity file attributes (event data, snp BAF data) as 'Cascade delete'.
 (This work around is needed as 'cascade delete' is not part of emx at the moment)
- Use the scripts plugin, commander or api to import/create the analysis scripts found in the scrips folder. 
    - The molgenis_mosaic.R file should be stored with the following settings
        - Name: molgenis_mosaic
        - Type: R
        - Content: molgenis_mosaic.R file content
            -  Replace the `mol.url` variable with the molgenis server uri (for example: 'https://molgenis.org')
        - Generate security token; yes
        - Result file extension: pdf
        - Parameters: id 
- Setup a cleanup job using the 'Scheduled jobs' plugin to clear the data at a set interval (nightly).
    -  Replace the `mol.url` variable with the molgenis server uri (for example: 'https://molgenis.org')
