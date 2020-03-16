const fs = require('fs')
const sheetId = '1rv5_TrhlFX4RMUaXAWMxJAJd5KHhi_v0EPhzGq9_NKw'
const outFile = `src/assets/cases_in_NewEngland.csv`
const os = require('os')
const keyPath = os.homedir();
const Gootenberg = require('gootenberg');

// Service account authentication key
const key = JSON.parse(fs.readFileSync(`${keyPath}/gootenberg-creds.json`, 'utf8'));

async function getFile(){
  const goot = new Gootenberg();
  await goot.auth.jwt(key);

  const data = await goot.drive.export(sheetId, 'text/csv');

  fs.writeFile(outFile, data, (err) => {
    if (err) console.log(err);
  });
}

getFile()
 .catch(err => console.error(err));
