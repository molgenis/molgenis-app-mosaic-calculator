library("molgenisRApi")
library("rjson")
library("RCurl")
mol.url <- "docker.for.mac.localhost:8080"
entity <- "mosaic_exp_data"
token <- molgenis.login(mol.url, "admin", "admin")
url <- paste0(mol.url, "/api/v2/", entity, "?molgenis-token=", token)
response <- fromJSON(getURL(url))
analyses <- response$items

print("delete analysis data")
for(analysis in analyses) {
    analysis.id <- analysis$id
    print(analysis.id)
    molgenis.delete(entity = entity, id = analysis.id)
}

print("delete result data")
for(analysis in analyses) {
    result.file.id <- analysis$resultFileId
    print(result.file.id)
    molgenis.delete(entity = "sys_FileMeta", id = result.file.id)
}

print("clean up done")