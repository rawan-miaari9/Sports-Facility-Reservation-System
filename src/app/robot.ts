import { MetadataRoute } from "next";

export default function robot(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',// all the user agents from all Search engines
            allow: ["/"],
            disallow: [
             "/api/*",
             "/admin/*",
             "/dashboard/*",
             "/reservations/",
             "/users/*",
             "/settings/",
             "/UserSetting/",
             "/facilities/*"
      ]
        },
        sitemap: 'http://localhost:3000/sitemap.xml'
    }
}