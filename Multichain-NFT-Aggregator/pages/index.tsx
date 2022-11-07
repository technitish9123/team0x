import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Navbar from "./api/components/Navbar";
import LazyMarketplace from "./LazyMarketplace";
import Homepage from "./Homepage";
import Launch from "./Launching";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const Home: NextPage = () => {
  return (
    <>
      <Launch />
    </>
  );
};

export default Home;
