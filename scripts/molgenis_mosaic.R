library("molgenisApi")
library("mosaicr")
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

snp.file.url <- row.data$snpFile$url
snp.file.url <- gsub("http://localhost", "host.docker.internal", snp.file.url)
snp.file.response <- getURL(paste0(snp.file.url, "?molgenis-token=", token))
snpm.data <- read.table(textConnection(snp.file.response), skip = 9, header = T, sep = "\t")[,c(3,4,6)]

event.file.url <- row.data$eventFile$url
event.file.url <- gsub("http://localhost", "host.docker.internal", event.file.url)
event.file.response <- getURL(paste0(event.file.url, "?molgenis-token=", token))
event.data <- read.table(textConnection(event.file.response), header = T, sep = "\t")

print(c(id, gender, event.file.url, snp.file.url ))

cat("Run analysis","\n")
events.filter <- MosaicCalculator(1, gender, snpm.data, event.data, '${outputFile}')
print(events.filter)
end.time <- Sys.time()

print(c("total time: ", end.time - start.time))
cat("Done","\n")

