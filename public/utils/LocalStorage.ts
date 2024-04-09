export const storageConstants = {
    accessToken: "accessToken",
    dataGoogle: "dataGoogle",
    refreshToken: "refreshToken",
};

export const LocalStorage = (function () {
    function _setToken(accessToken: string) {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
    }

    function _getAccessToken() {
        return localStorage.getItem("accessToken");
    }

    function _getRefreshToken() {
        return localStorage.getItem("refreshToken");
    }

    function _clearToken() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("walletName");
    }
    function _setDataGoogle(data: any) {
        if (data) {
            localStorage.setItem(storageConstants.dataGoogle, JSON.stringify(data));
        }
    }

    function _getDataGoogle() {
        return localStorage.getItem(storageConstants.dataGoogle);
    }
    function _setTheme(theme: string) {
        if (theme) {
            localStorage.setItem("theme", theme);
        }
    }
    function _getTheme() {
        return localStorage.getItem("theme");
    }
    return {
        setToken: _setToken,
        getAccessToken: _getAccessToken,
        getRefreshToken: _getRefreshToken,
        clearToken: _clearToken,
        setDataGoogle: _setDataGoogle,
        setTheme: _setTheme,
        getTheme: _getTheme,
    };
})();
