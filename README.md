# molgenis-app-mosaic-calculator

Front end for running [mosaic analysis](https://github.com/molgenis/mosaicr) using [molgenis](https://github.com/molgenis/molgenis). 

##Usage

- Use 'Regions file' input to select events file
- Use 'SNPs file' input to select snp-array output file
- Select the gender
- Click the 'Calculate' button to run the analysis.   

The files and selected gender will be uploaded to the molgenis server. 
Once uploaded the [mosaic analysis](https://github.com/molgenis/mosaicr) will be run.
Once completed the result summary will be displayed in the app.

Full analysis output is available by clicking the download link.

Nightly data and results removal is part of the app installation procedure. 
The user can remove data and result by clicking the 'clear all data' button.

###App instalation

- Upload app using molgenis app store (minimal molgenis version 7.3.7)
- Import datamodel from emx file as described in molgenis-data-model/README.md
- Add script via molgenis scripts plugin 
- Setup nightly cleaning job using scrips/mosaic_cleanup.R

##Development

#### Project setup
```
yarn install
```

#### Compiles and hot-reloads for development
```
yarn run serve
```

#### Compiles and minifies for production
```
yarn run build
```

#### Run your tests
```
yarn run test
```

#### Lints and fixes files
```
yarn run lint
```

#### Run your end-to-end tests
```
yarn run test:e2e
```

#### Run your unit tests
```
yarn run test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
