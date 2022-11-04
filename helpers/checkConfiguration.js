export default function ({ errorLog, pageLog, pageLogFormat }) {
  let mssg;

  if (!errorLog) {
    mssg = 'errorLog is undefined';
  }
  if (!pageLog) {
    mssg = 'pageLog is undefined';
  }
  if (!pageLogFormat) {
    mssg = 'pagelogFormat is undefined';
  }

  if ('' === pageLogFormat) {
    mssg = 'pageLogFormat is "" and thus page will not be logged, change your CUPS config to enable pagelogs';
  }

  return {
    ok: mssg === undefined,
    mssg
  }
}