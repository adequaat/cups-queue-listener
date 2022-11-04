import getCupsConfig from "cups-config-reader";

export default async function getRelevantConfiguration() {
  const {
    config: { PageLogFormat: pageLogFormat },
    filesConfig: { ErrorLog: errorLog, PageLog: pageLog },
  } = await getCupsConfig();

  return { pageLogFormat, errorLog, pageLog };
}
