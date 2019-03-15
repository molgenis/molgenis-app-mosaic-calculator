library("molgenisApi")
library("mosaicr")
library("httr")
library("rjson")
library("RCurl")
start.time <- Sys.time()
mol.url <- "host.docker.internal:8080"
token <- '${molgenisToken}'
exp.data <- "mosaic_exp_data"
url <- paste0(mol.url, "/api/v2/", exp.data, "?molgenis-token=${molgenisToken}&q=id==${id}")
entity.response <- fromJSON(getURL(url))
row.data <- entity.response$items[[1]]

id <- row.data$id
gender <- row.data$gender

snp.file.url <- paste0(mol.url, "/files/", row.data$snpFile$id, "?molgenis-token=", token)
snp.file.response <- getURL(snp.file.url)
snpm.data <- read.table(textConnection(snp.file.response), skip = 9, header = T, sep = "\t")[,c(3,4,6)]

event.file.url <- paste0(mol.url, "/files/", row.data$eventFile$id, "?molgenis-token=", token)
event.file.response <- getURL(event.file.url)
event.data <- read.table(textConnection(event.file.response), header = T, sep = "\t")

print(c(id, gender, event.file.url, snp.file.url ))

cat("Run analysis","\n")
events.filter <- MosaicCalculator(1, gender, snpm.data, event.data, '${outputFile}')
print(events.filter)
end.time <- Sys.time()

print(c("total time: ", end.time - start.time))
cat("Done","\n")

