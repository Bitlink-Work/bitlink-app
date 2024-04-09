import { LocalStorage } from "./public/utils/LocalStorage"

const themes: any = {
    yellow: {
        primary: "#ED1C24",
        sidebar: "#AD1112",
        sidebarHover: "#93090B",
        selectHover: "#ED1C241A",
        textPrimary: "#262626",
        textSecondary: "#434C76",
        error: "#FF4D4F",
        favIcon: "/images/kfc/favIcon.png",
        loginBg: "/images/kfc/loginBg.png",
        loginLogo: "/images/kfc/loginLogo.png",
        sidebarLogo: "/images/kfc/sidebarLogo.png",
        banner: "/images/kfc/banner.png",
        discountWeb: ''
    },
}

export const theme = themes[String(LocalStorage.getTheme() || process.env.NEXT_PUBLIC_DEFAULT_THEME)]