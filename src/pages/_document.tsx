/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/SIGSport.svg" />
        <title>SigSports</title>
        <meta
          name="description"
          content="Plataforma de gerenciamento de esportes"
        />
      </Head>

      <body className="h-screen bg-bgGray">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
