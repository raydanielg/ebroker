import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" web-version={process.env.NEXT_PUBLIC_WEB_VERSION} seo={process.env.NEXT_PUBLIC_SEO}>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
        />
        <script
          async
          defer
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        ></script>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API}&libraries=places&loading=async`}
        ></script>
        {/* Google AdSense Script Here */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxx"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="!pointer-events-auto antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
