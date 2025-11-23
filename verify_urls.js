// Verification script for Meituan URL logic
console.log("Verifying Meituan URL logic...");

function generateMeituanUrls(keyword) {
    const encodedKeyword = encodeURIComponent(keyword);
    return {
        appLink: `imeituan://www.meituan.com/search?keyword=${keyword}`,
        webLink: `https://waimai.meituan.com/?keyword=${encodedKeyword}#/search`,
        mobileWebLink: `https://h5.waimai.meituan.com/waimai/mindex/home`
    };
}

const urls = generateMeituanUrls('汉堡');
console.log(JSON.stringify(urls, null, 2));
