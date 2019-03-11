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

print("delete result data")
for(analysis in analyses) {
    result.file.id <- analysis$resultFileId
    print(result.file.id)
    DELETE(paste0(mol.url, "/api/v1/sys_FileMeta/", result.file.id), add_headers('x-molgenis-token' = token))
}

print("clean up done")
