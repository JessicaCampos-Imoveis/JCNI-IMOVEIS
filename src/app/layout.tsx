import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_CONFIG } from "@/lib/site-config";
import { getPublicConfig } from "@/lib/config-reader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPublicConfig();
  return {
    metadataBase: new URL(SITE_CONFIG.siteUrl),
    title: {
      default: "JCNI – Jéssica Campos Negócios Imobiliários",
      template: "%s | JCNI",
    },
    description: SITE_CONFIG.shortDescription,
    openGraph: {
      title: "JCNI – Jéssica Campos Negócios Imobiliários",
      description: SITE_CONFIG.shortDescription,
      url: SITE_CONFIG.siteUrl,
      siteName: "JCNI – Jéssica Campos Negócios Imobiliários",
      locale: "pt_BR",
      type: "website",
      ...(config.ogImageUrl ? { images: [{ url: config.ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getPublicConfig();
  // Injeta as CSS variables do preset de tema ativo diretamente no <html>
  // sobrescrevendo os valores padrao do :root em globals.css.
  const themeVars = config.temaPreset.tokens as React.CSSProperties;

  return (
    <html lang="pt-BR" style={themeVars}>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}

        {/* ── Analytics e rastreamento ─────────────────────────── */}
        {config.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${config.gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(config.gaId)});`,
              }}
            />
          </>
        )}

        {config.metaPixelId && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(config.metaPixelId)});fbq('track','PageView');`,
            }}
          />
        )}

        {config.tiktokPixelId && (
          <Script
            id="tiktok-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `!function(w,d,t){var a=w[t]=w[t]||[];a.methods="page track identify instances debug on off once ready alias group enableCookie disableCookie".split(" ");a.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<a.methods.length;i++)a.setAndDefer(a,a.methods[i]);a.load=function(e){var s="https://analytics.tiktok.com/i18n/pixel/events.js",n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=s+"?sdkid="+e+"&lib="+t;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(n,r)};a.load(${JSON.stringify(config.tiktokPixelId)});a.page()}(window,document,"ttq");`,
            }}
          />
        )}

        {config.gtmId && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(config.gtmId)});`,
            }}
          />
        )}

        {config.linkedinTagId && (
          <Script
            id="linkedin-tag"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window._linkedin_partner_id=${JSON.stringify(config.linkedinTagId)};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`,
            }}
          />
        )}

        {/* ── Chat ao vivo ─────────────────────────────────────── */}
        {config.chatProvider === "tawk" && config.chatId && (
          <Script
            id="tawk"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src=${JSON.stringify(config.chatId)};s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0)})();`,
            }}
          />
        )}

        {config.chatProvider === "jivo" && config.chatId && (
          <Script
            src={`https://code.jivosite.com/widget/${config.chatId}`}
            strategy="lazyOnload"
          />
        )}

        {config.chatProvider === "crisp" && config.chatId && (
          <Script
            id="crisp"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `window.$crisp=[];window.CRISP_WEBSITE_ID=${JSON.stringify(config.chatId)};(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s)})();`,
            }}
          />
        )}

        {/* ── Scripts customizados ────────────────────────────── */}
        {config.scriptHead && (
          <Script
            id="custom-head"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: config.scriptHead }}
          />
        )}

        {config.scriptBody && (
          <Script
            id="custom-body"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: config.scriptBody }}
          />
        )}
      </body>
    </html>
  );
}
