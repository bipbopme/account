import React from "react";
import Link from "next/link";
import Layout from "../components/layout";

export default class IndexPage extends React.Component {
  render() {
    return (
      <Layout title="Hi there">
        <h1>Hello fellow human 👋</h1>
        <p>
          <Link href="/signup">
            <a>Want to sign up for bipbop?</a>
          </Link>
        </p>
      </Layout>
    );
  }
}
