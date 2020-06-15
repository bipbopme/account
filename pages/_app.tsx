import "../app.scss";
import App from "next/app";
import React from "react";

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}
