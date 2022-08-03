import React from 'react';
import { CDBFooter, CDBFooterLink, CDBBox, CDBBtn, CDBIcon } from 'cdbreact';
import phfLogo from "../assets/phf-logo-ss-removebg-preview.png";
import "./styles/Footer.css";

function Footer() {
  return (
    <CDBFooter className="shadow">
      <CDBBox display="flex" flex="column" className="mx-auto py-5" style={{ width: '90%' }}>
        <CDBBox display="flex" justifyContent="between" className="flex-wrap">
          <CDBBox>
            <a href="/" className="d-flex align-items-center p-0 text-dark">
              <img className="phf-logo" src={phfLogo} />
              <div className="footer-title "><span className="h5 font-weight-bold"> Project Helper Function </span></div>
            </a>
            <p className="my-3" style={{ padding: '5px', width: '275px' }}>
             We are bringing you the power of search engines to get the snippet of code for your project. Disclaimer: Created as a Personal Project
            </p>
            <CDBBox display="flex" className="mt-3">
              <CDBBtn flat color="dark" className="p-3" href="https://github.com/cleeclee123/Project-Helper-Function" >
                <CDBIcon fab icon="github"/>
              </CDBBtn>
              <CDBBtn flat color="dark" className="mx-4 p-3" href="https://github.com/cleeclee123/Project-Helper-Function">
                <CDBIcon fab icon="linkedin" />
              </CDBBtn>
              <CDBBtn flat color="dark" className="p-3" href="https://github.com/cleeclee123/Project-Helper-Function">
                <CDBIcon fab icon="instagram" />
              </CDBBtn>
            </CDBBox>
          </CDBBox>
          <CDBBox>
            <p className="h5 mb-4" style={{ fontWeight: '600' }}>
              Project Helper Function
            </p>
            <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0', color: 'white '}}>
              <div className="link-footer"><a href="/">Go Home</a></div>
              <div className="link-footer"><a href="/">About the Project</a></div>
              <div className="link-footer"><a href="/">Source Code</a></div>
              <div className="link-footer"><a href="/">Message Chris</a></div>
            </CDBBox>
          </CDBBox>
          <CDBBox>
            <p className="h5 mb-4" style={{ fontWeight: '600' }}>
              Help Out
            </p>
            <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0' }}>
              <div className="link-footer"><a href="/">Report a Problem</a></div>
              <div className="link-footer"><a href="/"> {"Contribute </>"} </a></div>
              <div className="link-footer"><a href="/">Login</a></div>
              <div className="link-footer"><a href="/">Sign Up</a></div>
            </CDBBox>
          </CDBBox>
          <CDBBox>
            <p className="h5 mb-4" style={{ fontWeight: '600' }}>
              About Chris
            </p>
            <CDBBox flex="column" style={{ cursor: 'pointer', padding: '0' }}>
              <div className="link-footer"><a href="/">GitHub</a></div>
              <div className="link-footer"><a href="/">Linkedin</a></div>
              <div className="link-footer"><a href="/">Email</a></div>
              <div className="link-footer"><a href="/"> {"Contribute $$$"} </a></div>
            </CDBBox>
          </CDBBox>
        </CDBBox>
        <small className="text-center mt-5">&copy; Christopher Lee | Project Helper Function, 2022. All rights reserved.</small>
      </CDBBox>
    </CDBFooter>
  );
};

export default Footer;
