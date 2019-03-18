library("rjson")
library("httr")
library("RCurl")
mol.url <- "docker.for.mac.localhost:8080"
#mol.url <- "http://localhost:8080"
entity <- "mosaic_exp_data"
token <- '${molgenisToken}'

# fetch the rows to be cleaned
url <- paste0(mol.url, "/api/v2/", entity, "?molgenis-token=", token)
response <- fromJSON(getURL(url))
analyses <- response$items

print("delete analysis data")
for(analysis in analyses) {
    analysis.id <- analysis$id
    print(analysis.id)
    DELETE(paste0(mol.url, "/api/v1/mosaic_exp_data/", analysis.id), add_headers('x-molgenis-token' = token))
}

# fetch result rows to be cleaned
result.url <- paste0(mol.url, "/api/v2/sys_FileMeta?molgenis-token=", token, "&q=filename=like=.mosaic.pdf")
response <- fromJSON(getURL(result.url))
result.files <- response$items

print("delete result data")
for(file in result.files) {
    result.file.id <- file$id
    print(result.file.id)
    DELETE(paste0(mol.url, "/api/v1/sys_FileMeta/", result.file.id), add_headers('x-molgenis-token' = token))
}

print("clean up done")
