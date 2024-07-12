const path = require('path');
const os = require('os');
const fs = require('fs').promises;
const exec = require('child_process').exec;
const puppeteer = require('puppeteer');

async function run() {

    // Launch the browser and open a new blank page
    //Set useragent to be mac

    const browser = await puppeteer.launch({ headless: true });

    browser.userAgent = async () => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://dotnet.microsoft.com/en-us/download');

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box.
    //Get a using "a[data-bi-name="Download"]" element and get its href property.
    const downloadLink = await page.evaluate(() => {
        const downloadLink = document.querySelector('section:not([style="display:none;"]) a[data-bi-name="Download"]').href;
        return downloadLink;
    });

    console.log(downloadLink);

    await page.goto(downloadLink);

    //Wait for download to finish
    await new Promise(resolve => setTimeout(resolve, 10000));

    await browser.close();

    await new Promise(resolve => setTimeout(resolve, 10000));

    //Get latest "dotnet-sdk*" file from Dwonloads folder
    const downloadsFolder = path.join(os.homedir(), 'Downloads');
    const latestSdk = await fs.readdir(downloadsFolder)
        .then(files => files.filter(file => file.startsWith('dotnet-sdk-')))
        .then(files => files.sort((a, b) => a.localeCompare(b))[0]);

    //Luanch the file
    const dotnetSdkPath = path.join(downloadsFolder, latestSdk);
    console.log(dotnetSdkPath);
    exec(`open "${dotnetSdkPath}"`);
}
run();