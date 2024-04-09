function removeHttp(url: string) {
    return url.replace(/^https?:\/\//, "");
}

export default removeHttp;