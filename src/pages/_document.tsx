import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          <meta
            property="og:url"
            content="https://qin-paneldiscussion.vercel.app/"
          />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Qin PanelDicussion" />
          <meta
            property="og:description"
            content="パネルディスカッション用アプリ"
          />
          <meta property="og:site_name" content="Qin PanelDiscussion" />
          <meta property="og:image" content="/images/og-image.png" />

          <meta name="twitter:card" content="Summary Card" />
          <meta name="twitter:site" content="@mayo1201blog" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
