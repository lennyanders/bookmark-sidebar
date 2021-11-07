import AdmZip from 'adm-zip';

const zip = new AdmZip();
zip.addLocalFolder('./dist');
zip.writeZip('./dist/release.zip');
